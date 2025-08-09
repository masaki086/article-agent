import { CompactDetector } from '../CompactDetector';

describe('CompactDetector', () => {
  let detector: CompactDetector;

  beforeEach(() => {
    detector = new CompactDetector();
  });

  describe('detect', () => {
    test('should detect significant context reduction', () => {
      detector.detect(100000); // Initialize
      const event = detector.detect(60000); // 40% reduction
      
      expect(event).not.toBeNull();
      expect(event?.reduction).toBe(40000);
      expect(event?.rate).toBeCloseTo(0.4);
      expect(event?.type).toBe('detected');
    });

    test('should not detect small reductions', () => {
      detector.detect(100000);
      const event = detector.detect(90000); // 10% reduction
      
      expect(event).toBeNull();
    });

    test('should not detect if reduction is less than threshold', () => {
      detector.detect(20000);
      const event = detector.detect(12000); // 40% but only 8000 tokens
      
      expect(event).toBeNull();
    });

    test('should handle context growth without false positives', () => {
      detector.detect(50000);
      const event = detector.detect(60000); // Growth, not reduction
      
      expect(event).toBeNull();
      expect(detector.getCurrentSize()).toBe(60000);
    });
  });

  describe('recordManualReset', () => {
    test('should record manual reset events', () => {
      const event = detector.recordManualReset(50000, 0);
      
      expect(event.type).toBe('manual');
      expect(event.before).toBe(50000);
      expect(event.after).toBe(0);
      expect(event.reduction).toBe(50000);
      expect(event.rate).toBe(1);
    });

    test('should update previous size after manual reset', () => {
      detector.recordManualReset(50000, 10000);
      expect(detector.getCurrentSize()).toBe(10000);
    });
  });

  describe('getStatistics', () => {
    test('should calculate statistics correctly', () => {
      detector.detect(100000);
      detector.detect(50000); // 50% reduction
      detector.detect(80000);
      detector.detect(40000); // 50% reduction
      
      const stats = detector.getStatistics();
      
      expect(stats.totalCompacts).toBe(2);
      expect(stats.totalTokensRecovered).toBe(90000);
      expect(stats.averageReduction).toBe(45000);
      expect(stats.largestCompact?.reduction).toBe(50000);
    });

    test('should handle empty event list', () => {
      const stats = detector.getStatistics();
      
      expect(stats.totalCompacts).toBe(0);
      expect(stats.totalTokensRecovered).toBe(0);
      expect(stats.averageReduction).toBe(0);
      expect(stats.largestCompact).toBeNull();
    });
  });

  describe('configuration', () => {
    test('should allow threshold adjustment', () => {
      detector.setThreshold(0.5); // 50% threshold
      detector.detect(100000);
      
      const event40 = detector.detect(60000); // 40% reduction
      expect(event40).toBeNull(); // Should not detect
      
      const event60 = detector.detect(30000); // 50% reduction from 60000
      expect(event60).not.toBeNull(); // Should detect
    });

    test('should allow minimum reduction adjustment', () => {
      detector.setMinReduction(20000);
      detector.detect(100000);
      
      const event = detector.detect(65000); // 35% and 35000 reduction
      expect(event).not.toBeNull();
      
      detector.detect(80000);
      const smallEvent = detector.detect(65000); // less than 20000 reduction
      expect(smallEvent).toBeNull();
    });
  });

  describe('reset', () => {
    test('should clear all data', () => {
      detector.detect(100000);
      detector.detect(50000);
      
      detector.reset();
      
      expect(detector.getEvents()).toHaveLength(0);
      expect(detector.getCurrentSize()).toBe(0);
    });
  });
});