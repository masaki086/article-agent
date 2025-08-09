export interface LanguageAnalysis {
  source: string;
  primaryLanguage: 'japanese' | 'english' | 'mixed';
  japaneseChars: number;
  englishChars: number;
  japaneseRatio: string;
  englishRatio: string;
  japaneseTokens: number;
  englishTokens: number;
  totalTokens: number;
  potentialSavings: number;
  savingsPercentage: string;
  timestamp: number;
}

export interface LanguageStats {
  totalJapanese: number;
  totalEnglish: number;
  messages: LanguageAnalysis[];
  files: Map<string, LanguageAnalysis>;
}

export interface Recommendation {
  level: 'high' | 'medium' | 'low' | 'info';
  message: string;
  estimatedSavings?: number;
  files?: Array<{
    path: string;
    japaneseRatio: string;
    potentialSavings: number;
  }>;
}

export class LanguageAnalyzer {
  private japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g;
  private stats: LanguageStats;
  private maxMessagesTracked = 100;

  constructor() {
    this.stats = {
      totalJapanese: 0,
      totalEnglish: 0,
      messages: [],
      files: new Map()
    };
  }

  analyze(text: string, source: string = 'message'): LanguageAnalysis {
    const japaneseMatches = text.match(this.japaneseRegex);
    const japaneseChars = japaneseMatches ? japaneseMatches.length : 0;
    const totalChars = text.length;
    const englishChars = Math.max(0, totalChars - japaneseChars);

    // Calculate percentages
    const japaneseRatio = totalChars > 0 ? japaneseChars / totalChars : 0;
    const englishRatio = totalChars > 0 ? englishChars / totalChars : 0;

    // Determine primary language (>10% Japanese = Japanese content)
    let primaryLanguage: 'japanese' | 'english' | 'mixed';
    if (japaneseRatio > 0.7) {
      primaryLanguage = 'japanese';
    } else if (japaneseRatio > 0.1) {
      primaryLanguage = 'mixed';
    } else {
      primaryLanguage = 'english';
    }

    // Calculate token costs
    const japaneseTokens = Math.ceil(japaneseChars * 0.67);
    const englishTokens = Math.ceil(englishChars * 0.25);
    const totalTokens = japaneseTokens + englishTokens;

    // Token efficiency comparison
    // If all content were in English, estimate token count
    const equivalentEnglishChars = totalChars * 0.6; // Rough estimate for same content
    const potentialEnglishTokens = Math.ceil(equivalentEnglishChars * 0.25);
    const tokenSavings = Math.max(0, totalTokens - potentialEnglishTokens);
    const savingsPercentage = totalTokens > 0 ? (tokenSavings / totalTokens) * 100 : 0;

    const analysis: LanguageAnalysis = {
      source,
      primaryLanguage,
      japaneseChars,
      englishChars,
      japaneseRatio: (japaneseRatio * 100).toFixed(1),
      englishRatio: (englishRatio * 100).toFixed(1),
      japaneseTokens,
      englishTokens,
      totalTokens,
      potentialSavings: tokenSavings,
      savingsPercentage: savingsPercentage.toFixed(1),
      timestamp: Date.now()
    };

    // Update statistics
    this.updateStats(analysis);

    return analysis;
  }

  private updateStats(analysis: LanguageAnalysis): void {
    this.stats.totalJapanese += analysis.japaneseTokens;
    this.stats.totalEnglish += analysis.englishTokens;

    if (analysis.source.startsWith('file:')) {
      this.stats.files.set(analysis.source, analysis);
    } else {
      this.stats.messages.push(analysis);
      // Limit message history
      if (this.stats.messages.length > this.maxMessagesTracked) {
        const removed = this.stats.messages.shift();
        if (removed) {
          // Adjust totals
          this.stats.totalJapanese -= removed.japaneseTokens;
          this.stats.totalEnglish -= removed.englishTokens;
        }
      }
    }
  }

  generateRecommendations(): Recommendation[] {
    const total = this.stats.totalJapanese + this.stats.totalEnglish;
    if (total === 0) return [];

    const japanesePercent = (this.stats.totalJapanese / total) * 100;
    const recommendations: Recommendation[] = [];

    // Overall language usage recommendations
    if (japanesePercent > 50) {
      recommendations.push({
        level: 'high',
        message: `🚨 High Japanese usage (${japanesePercent.toFixed(1)}%). Consider using English for 40-50% token savings.`,
        estimatedSavings: Math.floor(this.stats.totalJapanese * 0.4)
      });
    } else if (japanesePercent > 30) {
      recommendations.push({
        level: 'medium',
        message: `⚠️ Moderate Japanese usage (${japanesePercent.toFixed(1)}%). English input could save ~30% tokens.`,
        estimatedSavings: Math.floor(this.stats.totalJapanese * 0.3)
      });
    } else if (japanesePercent > 10) {
      recommendations.push({
        level: 'low',
        message: `📊 Low Japanese usage (${japanesePercent.toFixed(1)}%). You're doing well with English usage!`,
        estimatedSavings: Math.floor(this.stats.totalJapanese * 0.2)
      });
    }

    // File-specific recommendations
    const heavyJapaneseFiles = Array.from(this.stats.files.entries())
      .filter(([_, analysis]) => parseFloat(analysis.japaneseRatio) > 50)
      .sort((a, b) => b[1].totalTokens - a[1].totalTokens)
      .slice(0, 5);

    if (heavyJapaneseFiles.length > 0) {
      recommendations.push({
        level: 'info',
        message: '📁 Files with high Japanese content (consider translating or using English versions):',
        files: heavyJapaneseFiles.map(([path, analysis]) => ({
          path: path.replace('file:', ''),
          japaneseRatio: analysis.japaneseRatio,
          potentialSavings: analysis.potentialSavings
        }))
      });
    }

    // Recent message trend
    if (this.stats.messages.length >= 10) {
      const recentMessages = this.stats.messages.slice(-10);
      const recentJapanese = recentMessages.reduce((sum, m) => sum + m.japaneseTokens, 0);
      const recentTotal = recentMessages.reduce((sum, m) => sum + m.totalTokens, 0);
      const recentJapanesePercent = (recentJapanese / recentTotal) * 100;

      if (recentJapanesePercent > 70) {
        recommendations.push({
          level: 'medium',
          message: `📈 Recent messages are ${recentJapanesePercent.toFixed(1)}% Japanese. Try switching to English for better efficiency.`
        });
      }
    }

    return recommendations;
  }

  getStats(): LanguageStats {
    return { ...this.stats };
  }

  getSessionSummary(): {
    totalTokens: number;
    japaneseTokens: number;
    englishTokens: number;
    japanesePercentage: number;
    potentialTotalSavings: number;
    topJapaneseFiles: Array<{ path: string; tokens: number }>;
  } {
    const totalTokens = this.stats.totalJapanese + this.stats.totalEnglish;
    const japanesePercentage = totalTokens > 0 ? (this.stats.totalJapanese / totalTokens) * 100 : 0;
    const potentialTotalSavings = Math.floor(this.stats.totalJapanese * 0.4);

    const topJapaneseFiles = Array.from(this.stats.files.entries())
      .filter(([_, analysis]) => analysis.japaneseTokens > 0)
      .sort((a, b) => b[1].japaneseTokens - a[1].japaneseTokens)
      .slice(0, 3)
      .map(([path, analysis]) => ({
        path: path.replace('file:', ''),
        tokens: analysis.japaneseTokens
      }));

    return {
      totalTokens,
      japaneseTokens: this.stats.totalJapanese,
      englishTokens: this.stats.totalEnglish,
      japanesePercentage,
      potentialTotalSavings,
      topJapaneseFiles
    };
  }

  reset(): void {
    this.stats = {
      totalJapanese: 0,
      totalEnglish: 0,
      messages: [],
      files: new Map()
    };
  }
}