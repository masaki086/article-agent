import { Tiktoken, encoding_for_model } from 'tiktoken';

interface TokenCountResult {
  count: number;
  category: string;
  timestamp: number;
}

export class HybridTokenCounter {
  private cache: Map<string, number>;
  private encoder: Tiktoken | null = null;
  private claudeAdjustmentFactor = 1.1;
  private maxCacheSize = 1000;

  constructor() {
    this.cache = new Map();
    this.initializeEncoder();
  }

  private async initializeEncoder(): Promise<void> {
    try {
      // Use GPT-4 encoding as base reference
      this.encoder = encoding_for_model('gpt-4');
    } catch (error) {
      console.warn('Failed to initialize tiktoken encoder, using fallback estimation');
    }
  }

  async count(text: string, category: string = 'general'): Promise<TokenCountResult> {
    const tokens = await this.estimateTokens(text);
    
    // Manage cache size
    if (this.cache.size > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    return {
      count: tokens,
      category,
      timestamp: Date.now()
    };
  }

  async estimateTokens(text: string): Promise<number> {
    // Check cache first
    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }

    let tokenCount: number;

    try {
      if (this.encoder) {
        // Use tiktoken for base calculation
        const encoded = this.encoder.encode(text);
        const tiktokenCount = encoded.length;
        // Apply Claude adjustment factor
        tokenCount = Math.ceil(tiktokenCount * this.claudeAdjustmentFactor);
      } else {
        // Fallback to character-based estimation
        tokenCount = this.fallbackEstimation(text);
      }
    } catch (error) {
      // If tiktoken fails, use fallback
      tokenCount = this.fallbackEstimation(text);
    }

    // Cache the result
    this.cache.set(text, tokenCount);
    return tokenCount;
  }

  private fallbackEstimation(text: string): number {
    // Japanese character ranges
    const japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g;
    const japaneseMatches = text.match(japaneseRegex);
    const japaneseChars = japaneseMatches ? japaneseMatches.length : 0;
    const englishChars = text.length - japaneseChars;

    // Corrected character-to-token ratios
    // Japanese: ~1.5 chars per token (0.67 tokens per char)
    // English: ~4 chars per token (0.25 tokens per char)
    const tokens = Math.ceil(japaneseChars * 0.67 + englishChars * 0.25);
    return tokens;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  dispose(): void {
    if (this.encoder) {
      this.encoder.free();
    }
    this.cache.clear();
  }
}