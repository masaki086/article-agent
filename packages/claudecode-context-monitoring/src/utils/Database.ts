import * as sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs/promises';
import { CompactEvent } from '../core/CompactDetector';

export interface SessionRecord {
  id?: number;
  start_time: number;
  end_time?: number;
  total_tokens: number;
  model: string;
  status: 'active' | 'completed' | 'aborted';
}

export interface MessageRecord {
  id?: number;
  session_id: number;
  role: 'user' | 'assistant' | 'system';
  tokens: number;
  japanese_tokens: number;
  english_tokens: number;
  japanese_ratio?: number;
  primary_language?: string;
  timestamp: number;
  // content は保存しない（セキュリティ要件）
}

export interface FileAccessRecord {
  id?: number;
  session_id: number;
  file_path: string;
  operation: 'read' | 'write';
  tokens: number;
  language?: 'japanese' | 'english' | 'mixed';
  japanese_ratio?: number;
  timestamp: number;
  redundant: boolean;
}

export class Database {
  private db: sqlite3.Database | null = null;
  private dbPath: string;
  private sessionId: number | null = null;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || path.join(process.cwd(), '.context-monitor', 'data.db');
  }

  // Helper method to run database commands
  private run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Helper method to get single row
  private get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Helper method to get all rows
  private all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async initialize(): Promise<void> {
    // Ensure directory exists
    const dir = path.dirname(this.dbPath);
    await fs.mkdir(dir, { recursive: true });

    // Open database
    await new Promise<void>((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create tables
    await this.createTables();

    // Setup data retention
    await this.setupDataRetention();

    // Start new session
    await this.startSession();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Sessions table
    await this.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        total_tokens INTEGER DEFAULT 0,
        model TEXT DEFAULT 'claude',
        status TEXT DEFAULT 'active'
      )
    `);

    // Messages table - セキュリティのため内容は保存しない
    await this.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        tokens INTEGER DEFAULT 0,
        japanese_tokens INTEGER DEFAULT 0,
        english_tokens INTEGER DEFAULT 0,
        japanese_ratio REAL,
        primary_language TEXT,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // File access table
    await this.run(`
      CREATE TABLE IF NOT EXISTS file_access (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        operation TEXT DEFAULT 'read',
        tokens INTEGER DEFAULT 0,
        language TEXT,
        japanese_ratio REAL,
        timestamp INTEGER NOT NULL,
        redundant INTEGER DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // Metrics table
    await this.run(`
      CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        metric_type TEXT NOT NULL,
        value REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // Compact events table
    await this.run(`
      CREATE TABLE IF NOT EXISTS compact_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        before_tokens INTEGER NOT NULL,
        after_tokens INTEGER NOT NULL,
        reduction INTEGER NOT NULL,
        rate REAL NOT NULL,
        type TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // Alerts table
    await this.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        level TEXT NOT NULL,
        message TEXT,
        context_usage REAL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
      )
    `);

    // Create indexes
    await this.run('CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_file_access_session ON file_access(session_id)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_metrics_session ON metrics(session_id)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_compact_session ON compact_events(session_id)');
  }

  private async setupDataRetention(): Promise<void> {
    // 起動時に7日以上古いデータを削除
    await this.cleanupOldData(7);
    // CRONは使用しない（要件に従う）
  }

  async startSession(model: string = 'claude'): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    // End any active sessions
    await this.run(
      `UPDATE sessions SET end_time = ?, status = 'aborted' 
       WHERE status = 'active'`,
      [Date.now()]
    );

    // Create new session
    await this.run(
      'INSERT INTO sessions (start_time, model, status) VALUES (?, ?, ?)',
      [Date.now(), model, 'active']
    );

    // Get session ID
    const result = await this.get('SELECT last_insert_rowid() as id') as { id: number };
    this.sessionId = result.id;

    return this.sessionId;
  }

  async endSession(): Promise<void> {
    if (!this.db || !this.sessionId) return;

    // Calculate total tokens
    const tokenResult = await this.get(
      'SELECT SUM(tokens) as total FROM messages WHERE session_id = ?',
      [this.sessionId]
    ) as { total: number };

    // Update session
    await this.run(
      `UPDATE sessions 
       SET end_time = ?, status = 'completed', total_tokens = ?
       WHERE id = ?`,
      [Date.now(), tokenResult?.total || 0, this.sessionId]
    );

    this.sessionId = null;
  }

  async recordMessage(
    role: string, 
    tokens: number, 
    japaneseTokens: number = 0,
    englishTokens: number = 0,
    japaneseRatio?: number,
    primaryLanguage?: string
  ): Promise<void> {
    if (!this.db || !this.sessionId) return;

    await this.run(
      `INSERT INTO messages (session_id, role, tokens, japanese_tokens, english_tokens, japanese_ratio, primary_language, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [this.sessionId, role, tokens, japaneseTokens, englishTokens, japaneseRatio, primaryLanguage, Date.now()]
    );
  }

  async recordFileAccess(
    filePath: string, 
    operation: 'read' | 'write', 
    tokens: number,
    language?: string,
    japaneseRatio?: number,
    redundant: boolean = false
  ): Promise<void> {
    if (!this.db || !this.sessionId) return;

    await this.run(
      `INSERT INTO file_access (session_id, file_path, operation, tokens, language, japanese_ratio, timestamp, redundant)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [this.sessionId, filePath, operation, tokens, language, japaneseRatio, Date.now(), redundant ? 1 : 0]
    );
  }

  async recordMetric(metricType: string, value: number): Promise<void> {
    if (!this.db || !this.sessionId) return;

    await this.run(
      'INSERT INTO metrics (session_id, metric_type, value, timestamp) VALUES (?, ?, ?, ?)',
      [this.sessionId, metricType, value, Date.now()]
    );
  }

  async recordCompact(event: CompactEvent): Promise<void> {
    if (!this.db || !this.sessionId) return;

    await this.run(
      `INSERT INTO compact_events (session_id, before_tokens, after_tokens, reduction, rate, type, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [this.sessionId, event.before, event.after, event.reduction, event.rate, event.type, event.timestamp]
    );
  }

  async recordAlert(level: string, usage: string, contextSize: number): Promise<void> {
    if (!this.db || !this.sessionId) return;

    await this.run(
      `INSERT INTO alerts (session_id, level, message, context_usage, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [this.sessionId, level, `Context usage: ${usage}%`, parseFloat(usage), Date.now()]
    );
  }

  async recordReset(source: string, timestamp: number, previousSize: number): Promise<void> {
    if (!this.db || !this.sessionId) return;

    await this.run(
      'INSERT INTO metrics (session_id, metric_type, value, timestamp) VALUES (?, ?, ?, ?)',
      [this.sessionId, `reset_${source}`, previousSize, timestamp]
    );
  }

  async cleanupOldData(daysToKeep: number): Promise<void> {
    if (!this.db) return;

    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

    // Delete old sessions and cascade
    await this.run(
      'DELETE FROM sessions WHERE start_time < ? AND status != ?',
      [cutoffTime, 'active']
    );

    console.log(`🧹 Cleaned up data older than ${daysToKeep} days`);
  }

  async getSessionStats(): Promise<any> {
    if (!this.db || !this.sessionId) return null;

    const session = await this.get(
      'SELECT * FROM sessions WHERE id = ?',
      [this.sessionId]
    );

    const messageStats = await this.get(
      `SELECT 
        COUNT(*) as count,
        SUM(tokens) as total_tokens,
        AVG(tokens) as avg_tokens,
        AVG(japanese_ratio) as avg_japanese_ratio
       FROM messages 
       WHERE session_id = ?`,
      [this.sessionId]
    );

    const fileStats = await this.all(
      `SELECT 
        file_path,
        COUNT(*) as access_count,
        SUM(tokens) as total_tokens,
        AVG(japanese_ratio) as avg_japanese_ratio
       FROM file_access 
       WHERE session_id = ?
       GROUP BY file_path
       ORDER BY total_tokens DESC
       LIMIT 10`,
      [this.sessionId]
    );

    return {
      session,
      messageStats,
      topFiles: fileStats
    };
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.endSession();
      this.db.close();
      this.db = null;
    }
  }
}