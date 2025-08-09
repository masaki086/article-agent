import { LanguageAnalyzer } from '../LanguageAnalyzer';

describe('LanguageAnalyzer', () => {
  let analyzer: LanguageAnalyzer;

  beforeEach(() => {
    analyzer = new LanguageAnalyzer();
  });

  describe('analyze', () => {
    test('should correctly identify pure Japanese text', () => {
      const result = analyzer.analyze('こんにちは世界');
      expect(result.primaryLanguage).toBe('japanese');
      expect(parseFloat(result.japaneseRatio)).toBeGreaterThan(90);
      expect(result.japaneseTokens).toBeGreaterThan(0);
      expect(result.englishTokens).toBe(0);
    });

    test('should correctly identify pure English text', () => {
      const result = analyzer.analyze('Hello World');
      expect(result.primaryLanguage).toBe('english');
      expect(parseFloat(result.englishRatio)).toBeGreaterThan(90);
      expect(result.englishTokens).toBeGreaterThan(0);
      expect(result.japaneseTokens).toBe(0);
    });

    test('should correctly identify mixed text', () => {
      const result = analyzer.analyze('const greeting = "こんにちは"');
      expect(result.primaryLanguage).toBe('mixed');
      expect(result.japaneseTokens).toBeGreaterThan(0);
      expect(result.englishTokens).toBeGreaterThan(0);
    });

    test('should calculate potential savings for Japanese text', () => {
      const result = analyzer.analyze('プログラミングは楽しいです');
      expect(result.potentialSavings).toBeGreaterThan(0);
      expect(parseFloat(result.savingsPercentage)).toBeGreaterThan(0);
    });

    test('should not calculate savings for English text', () => {
      const result = analyzer.analyze('Programming is fun');
      expect(result.potentialSavings).toBe(0);
    });
  });

  describe('generateRecommendations', () => {
    test('should generate high priority recommendation for >50% Japanese', () => {
      // Add multiple Japanese messages
      analyzer.analyze('これは日本語のメッセージです');
      analyzer.analyze('プログラミングの勉強をしています');
      analyzer.analyze('今日は良い天気ですね');
      
      const recommendations = analyzer.generateRecommendations();
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].level).toBe('high');
      expect(recommendations[0].message).toContain('High Japanese usage');
    });

    test('should generate medium priority for 30-50% Japanese', () => {
      // Mix of English and Japanese
      analyzer.analyze('Hello, this is English');
      analyzer.analyze('こんにちは、日本語です');
      analyzer.analyze('Mixed content here');
      
      const recommendations = analyzer.generateRecommendations();
      const hasRecommendation = recommendations.some(r => 
        r.level === 'medium' || r.level === 'low'
      );
      expect(hasRecommendation).toBe(true);
    });
  });

  describe('getSessionSummary', () => {
    test('should provide accurate session summary', () => {
      analyzer.analyze('日本語のテキスト');
      analyzer.analyze('English text');
      
      const summary = analyzer.getSessionSummary();
      expect(summary.totalTokens).toBeGreaterThan(0);
      expect(summary.japaneseTokens).toBeGreaterThan(0);
      expect(summary.englishTokens).toBeGreaterThan(0);
      expect(summary.japanesePercentage).toBeGreaterThan(0);
      expect(summary.japanesePercentage).toBeLessThan(100);
    });
  });

  describe('reset', () => {
    test('should clear all statistics', () => {
      analyzer.analyze('Some text');
      analyzer.reset();
      
      const summary = analyzer.getSessionSummary();
      expect(summary.totalTokens).toBe(0);
      expect(summary.japaneseTokens).toBe(0);
      expect(summary.englishTokens).toBe(0);
    });
  });
});