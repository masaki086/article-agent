export interface CompactEvent {
  timestamp: number;
  before: number;
  after: number;
  reduction: number;
  rate: number;
  type: 'auto' | 'manual' | 'detected';
}

export class CompactDetector {
  private previousSize: number = 0;
  private events: CompactEvent[] = [];
  private threshold: number = 0.3; // 30% reduction threshold
  private minReduction: number = 10000; // Minimum 10k token reduction
  private maxEvents: number = 100;

  detect(currentSize: number): CompactEvent | null {
    // Initialize on first call
    if (this.previousSize === 0) {
      this.previousSize = currentSize;
      return null;
    }

    const reduction = this.previousSize - currentSize;
    const rate = this.previousSize > 0 ? reduction / this.previousSize : 0;

    // Detect significant reduction
    if (rate > this.threshold && reduction > this.minReduction) {
      const event: CompactEvent = {
        timestamp: Date.now(),
        before: this.previousSize,
        after: currentSize,
        reduction,
        rate,
        type: 'detected'
      };

      this.recordEvent(event);
      this.previousSize = currentSize;
      return event;
    }

    // Check for gradual increase (no compact)
    if (currentSize > this.previousSize) {
      this.previousSize = currentSize;
    }

    return null;
  }

  recordManualReset(before: number, after: number = 0): CompactEvent {
    const event: CompactEvent = {
      timestamp: Date.now(),
      before,
      after,
      reduction: before - after,
      rate: before > 0 ? (before - after) / before : 1,
      type: 'manual'
    };

    this.recordEvent(event);
    this.previousSize = after;
    return event;
  }

  private recordEvent(event: CompactEvent): void {
    this.events.push(event);
    
    // Limit event history
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log significant compacts
    if (event.reduction > 50000) {
      console.warn(`🔄 Major context compact detected: ${event.reduction.toLocaleString()} tokens reduced (${(event.rate * 100).toFixed(1)}%)`);
    } else if (event.reduction > 20000) {
      console.info(`🔄 Context compact detected: ${event.reduction.toLocaleString()} tokens reduced (${(event.rate * 100).toFixed(1)}%)`);
    }
  }

  getEvents(): CompactEvent[] {
    return [...this.events];
  }

  getLatestEvent(): CompactEvent | null {
    return this.events.length > 0 ? this.events[this.events.length - 1] : null;
  }

  getStatistics(): {
    totalCompacts: number;
    totalTokensRecovered: number;
    averageReduction: number;
    largestCompact: CompactEvent | null;
    compactsLast24h: number;
  } {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const totalTokensRecovered = this.events.reduce((sum, e) => sum + e.reduction, 0);
    const averageReduction = this.events.length > 0 
      ? totalTokensRecovered / this.events.length 
      : 0;

    const largestCompact = this.events.length > 0
      ? this.events.reduce((max, e) => e.reduction > max.reduction ? e : max)
      : null;

    const compactsLast24h = this.events.filter(e => e.timestamp > oneDayAgo).length;

    return {
      totalCompacts: this.events.length,
      totalTokensRecovered,
      averageReduction,
      largestCompact,
      compactsLast24h
    };
  }

  setThreshold(threshold: number): void {
    if (threshold > 0 && threshold < 1) {
      this.threshold = threshold;
    }
  }

  setMinReduction(minReduction: number): void {
    if (minReduction > 0) {
      this.minReduction = minReduction;
    }
  }

  reset(): void {
    this.previousSize = 0;
    this.events = [];
  }

  getCurrentSize(): number {
    return this.previousSize;
  }
}