import * as fs from 'fs';
import * as path from 'path';

interface QiitaConfig {
  access_token: string;
}

export class Config {
  private static instance: Config;
  private config: QiitaConfig;

  private constructor() {
    const configPath = path.resolve(__dirname, '../../../../.claude/config/qiita-token.json');
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found at: ${configPath}`);
    }

    try {
      const configData = fs.readFileSync(configPath, 'utf-8');
      this.config = JSON.parse(configData);
      
      if (!this.config.access_token) {
        throw new Error('Access token not found in config file');
      }
    } catch (error) {
      throw new Error(`Failed to load config: ${(error as Error).message}`);
    }
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  getAccessToken(): string {
    return this.config.access_token;
  }

  // Never log the actual token
  getRedactedToken(): string {
    const token = this.config.access_token;
    if (token.length <= 8) {
      return '***REDACTED***';
    }
    return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
  }
}

export const API_CONFIG = {
  baseUrl: 'https://qiita.com/api/v2',
  timeout: 30000,
  maxRetries: 3,
  rateLimit: {
    maxRequests: 1000,
    perHour: 3600000,
    bufferRequests: 100, // Keep 100 requests as buffer
  },
  batchSize: 10,
  retryDelay: {
    initial: 1000,
    multiplier: 2,
    maxDelay: 30000,
  },
};