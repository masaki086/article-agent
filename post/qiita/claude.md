# Qiita API Module - Core Guidelines

**Date:** 2025-01-03 | **Version:** 2.0

## Security Essentials
- Token: `/.claude/config/qiita-token.json` (never hardcode)
- HTTPS only, sanitize inputs, mask logs
- Validate: title<255chars, body markdown, max 5 tags

## Core Rules
- Rate: 1000/hr, buffer 100 requests
- Retry: 429→wait, 5xx→retry max 3x
- Log: structured, mask tokens
- Rollback: any series failure→delete all uploaded

## ♻️ Code Reusability

### 1. Modular Architecture
```
/post/qiita/
├── core/
│   ├── client.ts          # API client wrapper
│   ├── auth.ts            # Authentication module
│   └── rateLimiter.ts     # Rate limiting logic
├── services/
│   ├── articleService.ts  # Article CRUD operations
│   ├── imageService.ts    # Image upload handling
│   └── tagService.ts      # Tag validation/management
├── utils/
│   ├── validator.ts       # Input validation
│   ├── formatter.ts       # Data formatting
│   └── logger.ts          # Logging utilities
└── types/
    └── qiita.d.ts         # TypeScript definitions
```

### 2. Interface Design
```typescript
// Clear, typed interfaces
interface QiitaArticle {
  title: string;
  body: string;
  tags: QiitaTag[];
  private?: boolean;
  coediting?: boolean;
  group_url_name?: string;
}

interface QiitaTag {
  name: string;
  versions?: string[];
}

interface PostResult {
  success: boolean;
  articleId?: string;
  url?: string;
  error?: Error;
}
```

### 3. Configuration Management
```typescript
// Centralized configuration
export const config = {
  apiBaseUrl: process.env.QIITA_API_URL || 'https://qiita.com/api/v2',
  timeout: 30000,
  retryAttempts: 3,
  rateLimitBuffer: 100, // Reserve 100 requests
  batchSize: 10,
};
```

## 🧪 Testing Requirements

### 1. Unit Tests
- Minimum 80% code coverage
- Test all error scenarios
- Mock external API calls
- Validate input sanitization

### 2. Integration Tests
```typescript
// Test with real API (sandbox/test account)
- Authentication flow
- Article posting lifecycle
- Rate limit handling
- Error recovery
```

### 3. Performance Tests
- Batch posting efficiency
- Memory usage under load
- Response time benchmarks
- Concurrent request handling

## 📋 Best Practices

### 1. Async Operations
```typescript
// Use async/await with proper error handling
async function postArticle(article: QiitaArticle): Promise<PostResult> {
  const validated = await validateArticle(article);
  const rateLimitOk = await checkRateLimit();
  
  if (!rateLimitOk) {
    return queueForLater(article);
  }
  
  return await apiClient.post('/items', validated);
}
```

### 2. Batch Processing
```typescript
// Efficient batch processing
async function postBatch(articles: QiitaArticle[]): Promise<PostResult[]> {
  const results = [];
  const batchSize = config.batchSize;
  
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(article => postArticle(article))
    );
    results.push(...batchResults);
    
    // Respect rate limits between batches
    await delay(calculateBatchDelay());
  }
  
  return results;
}
```

### 3. State Management
- Track posting status in local database
- Implement idempotency keys
- Handle duplicate prevention
- Maintain posting history

## 🚨 Critical Warnings

1. **Never** expose API tokens in error messages or logs
2. **Always** validate and sanitize user inputs
3. **Implement** circuit breakers for API failures
4. **Monitor** API usage to prevent service disruption
5. **Document** all API interactions and error codes

## 📊 Monitoring & Metrics

### Required Metrics
- API call success/failure rates
- Average response times
- Rate limit usage percentage
- Error frequency by type
- Queue depth for batched operations

### Alerting Thresholds
- Rate limit usage > 80%
- Error rate > 5%
- Response time > 5 seconds
- Queue depth > 100 items

## 🔄 Deployment Checklist

- [ ] All sensitive data in environment variables
- [ ] Error handling covers all edge cases
- [ ] Rate limiting implemented and tested
- [ ] Logging configured appropriately
- [ ] Unit tests passing with >80% coverage
- [ ] Integration tests completed
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Monitoring configured
- [ ] Rollback plan documented