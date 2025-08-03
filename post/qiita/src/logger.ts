import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  action: string;
  message: string;
  details?: any;
}

export class Logger {
  private logFile: string;

  constructor() {
    const logsDir = path.resolve(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    this.logFile = path.join(logsDir, `qiita-upload-${date}.log`);
  }

  private formatLog(entry: LogEntry): string {
    const sanitizedDetails = entry.details ? this.sanitizeDetails(entry.details) : '';
    return `[${entry.timestamp}] [${entry.level}] [${entry.action}] ${entry.message}${sanitizedDetails ? ` | ${JSON.stringify(sanitizedDetails)}` : ''}`;
  }

  private sanitizeDetails(details: any): any {
    if (typeof details !== 'object' || details === null) {
      return details;
    }

    const sanitized = { ...details };

    // Remove sensitive fields
    const sensitiveFields = ['token', 'access_token', 'authorization', 'password', 'secret'];
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    // Recursively sanitize nested objects
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeDetails(sanitized[key]);
      }
    }

    return sanitized;
  }

  log(level: LogLevel, action: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      action,
      message,
      details,
    };

    // Console output with colors
    const coloredMessage = this.getColoredMessage(entry);
    console.log(coloredMessage);

    // File output
    const logLine = this.formatLog(entry);
    fs.appendFileSync(this.logFile, logLine + '\n', 'utf-8');
  }

  private getColoredMessage(entry: LogEntry): string {
    const colors = {
      [LogLevel.INFO]: '\x1b[36m', // Cyan
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.SUCCESS]: '\x1b[32m', // Green
    };
    const reset = '\x1b[0m';

    return `${colors[entry.level]}[${entry.level}] ${entry.action}: ${entry.message}${reset}`;
  }

  info(action: string, message: string, details?: any): void {
    this.log(LogLevel.INFO, action, message, details);
  }

  warn(action: string, message: string, details?: any): void {
    this.log(LogLevel.WARN, action, message, details);
  }

  error(action: string, message: string, details?: any): void {
    this.log(LogLevel.ERROR, action, message, details);
  }

  success(action: string, message: string, details?: any): void {
    this.log(LogLevel.SUCCESS, action, message, details);
  }

  logSummary(results: Array<{ article: any; result: any }>): void {
    const successful = results.filter(r => !(r.result instanceof Error)).length;
    const failed = results.length - successful;

    console.log('\n' + '='.repeat(50));
    console.log('📊 Upload Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📝 Total: ${results.length}`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Articles:');
      results.forEach(({ article, result }) => {
        if (result instanceof Error) {
          console.log(`  - "${article.title}": ${result.message}`);
        }
      });
    }

    console.log('\n📁 Log file:', this.logFile);
  }
}