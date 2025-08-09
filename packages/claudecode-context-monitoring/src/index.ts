export { HybridTokenCounter } from './core/TokenCounter';
export { LanguageAnalyzer } from './core/LanguageAnalyzer';
export { CompactDetector } from './core/CompactDetector';
export { ContextAnalyzer } from './core/ContextAnalyzer';
export { Database } from './utils/Database';

import { HybridTokenCounter } from './core/TokenCounter';
import { LanguageAnalyzer, Recommendation } from './core/LanguageAnalyzer';
import { CompactDetector } from './core/CompactDetector';
import { ContextAnalyzer, ContextMetrics } from './core/ContextAnalyzer';
import { Database } from './utils/Database';

export type { 
  LanguageAnalysis, 
  LanguageStats, 
  Recommendation 
} from './core/LanguageAnalyzer';

export type { 
  CompactEvent 
} from './core/CompactDetector';

export type { 
  ContextMetrics,
  ResetEvent 
} from './core/ContextAnalyzer';

export type {
  SessionRecord,
  MessageRecord,
  FileAccessRecord
} from './utils/Database';

// Main monitoring class that ties everything together

export class ContextMonitor {
  private db: Database;
  private contextAnalyzer: ContextAnalyzer;
  private tokenCounter: HybridTokenCounter;
  private isInitialized = false;

  constructor(dbPath?: string) {
    this.db = new Database(dbPath);
    this.contextAnalyzer = new ContextAnalyzer(this.db);
    this.tokenCounter = new HybridTokenCounter();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    await this.db.initialize();
    this.isInitialized = true;
    console.log('✅ Context Monitor initialized');
  }

  async trackMessage(content: string, role: 'user' | 'assistant' = 'user'): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    // Count tokens
    const tokenResult = await this.tokenCounter.count(content, role);
    
    // Analyze language
    const languageAnalysis = this.contextAnalyzer.getLanguageAnalyzer().analyze(content, `message:${role}`);
    
    // Record in database (内容は保存しない、統計情報のみ)
    await this.db.recordMessage(
      role,
      tokenResult.count,
      languageAnalysis.japaneseTokens,
      languageAnalysis.englishTokens,
      parseFloat(languageAnalysis.japaneseRatio) / 100,
      languageAnalysis.primaryLanguage
    );

    // Update context size
    const currentSize = this.contextAnalyzer.getCurrentMetrics().current + tokenResult.count;
    this.contextAnalyzer.updateCurrentSize(currentSize);

    // Log if high Japanese usage
    if (parseFloat(languageAnalysis.japaneseRatio) > 50) {
      console.log(`📝 Message is ${languageAnalysis.japaneseRatio}% Japanese (${languageAnalysis.potentialSavings} tokens could be saved)`);
    }
  }

  async trackFileAccess(filePath: string, content?: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    let tokens = 0;
    let languageAnalysis = null;

    if (content) {
      const tokenResult = await this.tokenCounter.count(content, 'file');
      tokens = tokenResult.count;
      languageAnalysis = this.contextAnalyzer.getLanguageAnalyzer().analyze(content, `file:${filePath}`);
    }

    await this.db.recordFileAccess(
      filePath,
      'read',
      tokens,
      languageAnalysis?.primaryLanguage,
      languageAnalysis ? parseFloat(languageAnalysis.japaneseRatio) / 100 : undefined
    );
  }

  async handleReset(source: 'clear' | 'reset' | 'startup' | 'resume'): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    await this.contextAnalyzer.handleReset(source);
  }

  async getMetrics(): Promise<ContextMetrics> {
    if (!this.isInitialized) await this.initialize();
    return await this.contextAnalyzer.analyze();
  }

  async getRecommendations(): Promise<Recommendation[]> {
    if (!this.isInitialized) await this.initialize();
    return this.contextAnalyzer.getLanguageAnalyzer().generateRecommendations();
  }

  async getSessionStats(): Promise<any> {
    if (!this.isInitialized) await this.initialize();
    return await this.db.getSessionStats();
  }

  async close(): Promise<void> {
    if (this.isInitialized) {
      await this.db.close();
      this.tokenCounter.dispose();
      this.isInitialized = false;
    }
  }
}

// Export a singleton instance for easy use
let defaultMonitor: ContextMonitor | null = null;

export function getDefaultMonitor(): ContextMonitor {
  if (!defaultMonitor) {
    defaultMonitor = new ContextMonitor();
  }
  return defaultMonitor;
}