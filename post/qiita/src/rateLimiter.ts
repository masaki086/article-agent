import { API_CONFIG } from './config';

export class RateLimiter {
  private requestCount: number = 0;
  private resetTime: number = Date.now() + API_CONFIG.rateLimit.perHour;
  private maxRequests: number = API_CONFIG.rateLimit.maxRequests;

  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    
    // Reset counter if hour has passed
    if (now >= this.resetTime) {
      this.requestCount = 0;
      this.resetTime = now + API_CONFIG.rateLimit.perHour;
    }

    const availableRequests = this.maxRequests - API_CONFIG.rateLimit.bufferRequests;
    return this.requestCount < availableRequests;
  }

  async waitForSlot(): Promise<void> {
    if (await this.checkLimit()) {
      this.requestCount++;
      return;
    }

    // Wait until next reset
    const waitTime = this.resetTime - Date.now();
    console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.requestCount++;
        resolve();
      }, waitTime);
    });
  }

  updateFromHeaders(headers: Record<string, string>): void {
    if (headers['rate-limit']) {
      const limit = parseInt(headers['rate-limit'], 10);
      if (!isNaN(limit)) {
        // Store locally instead of mutating global config
        this.maxRequests = limit;
      }
    }

    if (headers['rate-remaining']) {
      const remaining = parseInt(headers['rate-remaining'], 10);
      if (!isNaN(remaining)) {
        this.requestCount = this.maxRequests - remaining;
      }
    }

    if (headers['rate-reset']) {
      const reset = parseInt(headers['rate-reset'], 10) * 1000;
      if (!isNaN(reset)) {
        this.resetTime = reset;
      }
    }
  }

  getStatus(): { used: number; remaining: number; resetIn: number } {
    const remaining = this.maxRequests - this.requestCount;
    const resetIn = Math.max(0, this.resetTime - Date.now());
    
    return {
      used: this.requestCount,
      remaining,
      resetIn: Math.ceil(resetIn / 1000),
    };
  }
}