import { CompactDetector, CompactEvent } from './CompactDetector';
import { LanguageAnalyzer } from './LanguageAnalyzer';
import { Database } from '../utils/Database';

export interface ContextMetrics {
  current: number;
  max: number;
  usage: number; // percentage
  status: 'safe' | 'warning' | 'critical';
  compactEvents: CompactEvent[];
  recommendations: string[];
  languageStats: {
    japaneseTokens: number;
    englishTokens: number;
    potentialSavings: number;
  };
}

export interface ResetEvent {
  source: 'clear' | 'reset' | 'startup' | 'resume';
  timestamp: number;
  previousSize: number;
}

export class ContextAnalyzer {
  private db: Database;
  private compactDetector: CompactDetector;
  private languageAnalyzer: LanguageAnalyzer;
  private thresholds = {
    warning: 0.8,    // 80%
    critical: 0.9    // 90%
  };
  private maxContext = 200000; // Claude's context window
  private currentSize = 0;
  private resetEvents: ResetEvent[] = [];

  constructor(database: Database) {
    this.db = database;
    this.compactDetector = new CompactDetector();
    this.languageAnalyzer = new LanguageAnalyzer();
  }

  async analyze(currentSize?: number): Promise<ContextMetrics> {
    // Update current size if provided
    if (currentSize !== undefined) {
      this.currentSize = currentSize;
    }

    const usage = this.currentSize / this.maxContext;

    // Detect context compact
    const compactDetected = this.compactDetector.detect(this.currentSize);
    if (compactDetected) {
      await this.handleCompact(compactDetected);
    }

    // Determine status
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (usage > this.thresholds.critical) {
      status = 'critical';
      await this.triggerAlert('critical', usage);
    } else if (usage > this.thresholds.warning) {
      status = 'warning';
      await this.triggerAlert('warning', usage);
    }

    // Get language statistics
    const languageSummary = this.languageAnalyzer.getSessionSummary();

    // Generate recommendations
    const recommendations = await this.generateRecommendations(usage, status);

    return {
      current: this.currentSize,
      max: this.maxContext,
      usage: usage * 100,
      status,
      compactEvents: this.compactDetector.getEvents(),
      recommendations,
      languageStats: {
        japaneseTokens: languageSummary.japaneseTokens,
        englishTokens: languageSummary.englishTokens,
        potentialSavings: languageSummary.potentialTotalSavings
      }
    };
  }

  async handleReset(source: 'clear' | 'reset' | 'startup' | 'resume'): Promise<void> {
    const resetEvent: ResetEvent = {
      source,
      timestamp: Date.now(),
      previousSize: this.currentSize
    };

    this.resetEvents.push(resetEvent);

    // Record in database
    await this.db.recordReset(source, resetEvent.timestamp, this.currentSize);

    // Handle different reset types
    switch (source) {
      case 'clear':
      case 'reset':
        // Full reset
        this.currentSize = 0;
        this.compactDetector.recordManualReset(resetEvent.previousSize, 0);
        this.languageAnalyzer.reset();
        console.log(`🔄 Context reset (${source}): cleared ${resetEvent.previousSize.toLocaleString()} tokens`);
        break;
      
      case 'startup':
        // New session
        this.currentSize = 0;
        this.compactDetector.reset();
        this.languageAnalyzer.reset();
        console.log('🚀 New session started');
        break;
      
      case 'resume':
        // Session resumed, keep current state
        console.log('⏯️ Session resumed');
        break;
    }
  }

  private async handleCompact(event: CompactEvent): Promise<void> {
    // Log to database
    await this.db.recordCompact(event);

    // Update current size
    this.currentSize = event.after;

    // Generate alert
    const message = `Context compacted: ${event.reduction.toLocaleString()} tokens recovered (${(event.rate * 100).toFixed(1)}% reduction)`;
    console.info(`🔄 ${message}`);
  }

  private async triggerAlert(level: 'warning' | 'critical', usage: number): Promise<void> {
    const percentage = (usage * 100).toFixed(1);
    const remaining = this.maxContext - this.currentSize;
    
    const message = level === 'critical'
      ? `🚨 CRITICAL: Context at ${percentage}% (${remaining.toLocaleString()} tokens remaining)`
      : `⚠️ WARNING: Context at ${percentage}% (${remaining.toLocaleString()} tokens remaining)`;

    console.warn(message);
    
    // Record alert in database
    await this.db.recordAlert(level, percentage, this.currentSize);
  }

  private async generateRecommendations(usage: number, status: string): Promise<string[]> {
    const recommendations: string[] = [];

    // Context usage recommendations
    if (status === 'critical') {
      recommendations.push('🚨 Consider resetting context or starting a new session');
      recommendations.push('📝 Save important information before context limit');
    } else if (status === 'warning') {
      recommendations.push('⚠️ Context usage high - consider summarizing previous work');
      recommendations.push('🗂️ Archive completed tasks to free up context');
    }

    // Language recommendations
    const langRecommendations = this.languageAnalyzer.generateRecommendations();
    langRecommendations.forEach(rec => {
      if (rec.level === 'high' || rec.level === 'medium') {
        recommendations.push(rec.message);
      }
    });

    // Compact history recommendations
    const compactStats = this.compactDetector.getStatistics();
    if (compactStats.compactsLast24h > 3) {
      recommendations.push(`📊 ${compactStats.compactsLast24h} compacts in last 24h - consider shorter sessions`);
    }

    // File access patterns (would need FileTracker integration)
    // This would be implemented when FileTracker is added

    return recommendations;
  }

  updateCurrentSize(size: number): void {
    this.currentSize = size;
  }

  getCurrentMetrics(): ContextMetrics {
    const usage = this.currentSize / this.maxContext;
    const languageSummary = this.languageAnalyzer.getSessionSummary();

    return {
      current: this.currentSize,
      max: this.maxContext,
      usage: usage * 100,
      status: usage > this.thresholds.critical ? 'critical' 
            : usage > this.thresholds.warning ? 'warning' 
            : 'safe',
      compactEvents: this.compactDetector.getEvents(),
      recommendations: [],
      languageStats: {
        japaneseTokens: languageSummary.japaneseTokens,
        englishTokens: languageSummary.englishTokens,
        potentialSavings: languageSummary.potentialTotalSavings
      }
    };
  }

  getLanguageAnalyzer(): LanguageAnalyzer {
    return this.languageAnalyzer;
  }

  getCompactDetector(): CompactDetector {
    return this.compactDetector;
  }

  setMaxContext(max: number): void {
    if (max > 0) {
      this.maxContext = max;
    }
  }

  setThresholds(warning: number, critical: number): void {
    if (warning > 0 && warning < 1 && critical > warning && critical < 1) {
      this.thresholds.warning = warning;
      this.thresholds.critical = critical;
    }
  }
}