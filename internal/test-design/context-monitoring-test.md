# Context Monitoring System - Test Design

**Date:** 2025-01-09 | **Version:** 1.0  
**Feature:** Context Monitoring System

## 📋 Test Strategy Overview

### Test Objectives
1. Verify token counting accuracy for Claude models
2. Validate compact detection mechanisms
3. Ensure reset/clear command handling
4. Confirm 7-day data retention policy
5. Test dashboard real-time updates
6. Validate NPM package installation and usage

### Test Scope
- **In Scope**: Core functionality, Claude-specific features, data persistence, dashboard
- **Out of Scope**: Other AI models (GPT, Gemini), cloud sync features

## 🧪 Test Categories

### 1. Unit Tests

#### UT-01: Token Counter Tests
```javascript
// test/unit/TokenCounter.test.js
describe('ClaudeTokenCounter', () => {
  test('should count English text correctly', () => {
    const counter = new ClaudeTokenCounter();
    const text = 'Hello world'; // 11 chars
    const tokens = counter.estimateTokens(text);
    expect(tokens).toBe(3); // 11/4 = 2.75 → 3
  });
  
  test('should count Japanese text correctly', () => {
    const counter = new ClaudeTokenCounter();
    const text = 'こんにちは'; // 5 chars
    const tokens = counter.estimateTokens(text);
    expect(tokens).toBe(3); // 5/2 = 2.5 → 3
  });
  
  test('should count mixed text correctly', () => {
    const counter = new ClaudeTokenCounter();
    const text = 'Hello こんにちは world'; // 6 EN + 5 JP + 6 EN
    const tokens = counter.estimateTokens(text);
    expect(tokens).toBe(6); // (12/4) + (5/2) = 3 + 2.5 → 6
  });
  
  test('should use cache for repeated text', () => {
    const counter = new ClaudeTokenCounter();
    const text = 'Cached text';
    counter.estimateTokens(text);
    const spy = jest.spyOn(counter.cache, 'get');
    counter.estimateTokens(text);
    expect(spy).toHaveBeenCalled();
  });
});
```

#### UT-02: Compact Detector Tests
```javascript
// test/unit/CompactDetector.test.js
describe('CompactDetector', () => {
  test('should detect significant context reduction', () => {
    const detector = new CompactDetector();
    detector.detect(100000); // Initial
    const event = detector.detect(60000); // 40% reduction
    expect(event).toBeDefined();
    expect(event.reduction).toBe(40000);
    expect(event.rate).toBeCloseTo(0.4);
  });
  
  test('should not detect small reductions', () => {
    const detector = new CompactDetector();
    detector.detect(100000);
    const event = detector.detect(90000); // 10% reduction
    expect(event).toBeNull();
  });
  
  test('should not detect if reduction < 10000 tokens', () => {
    const detector = new CompactDetector();
    detector.detect(20000);
    const event = detector.detect(12000); // 40% but only 8000 tokens
    expect(event).toBeNull();
  });
  
  test('should store compact events', () => {
    const detector = new CompactDetector();
    detector.detect(100000);
    detector.detect(60000);
    detector.detect(30000);
    expect(detector.getEvents()).toHaveLength(2);
  });
});
```

#### UT-03: Reset Handler Tests
```javascript
// test/unit/ResetHandler.test.js
describe('ResetHandler', () => {
  test('should handle /clear command', async () => {
    const handler = new ResetHandler();
    const spy = jest.spyOn(handler, 'clearCounters');
    await handler.execute('clear');
    expect(spy).toHaveBeenCalled();
  });
  
  test('should handle /reset command', async () => {
    const handler = new ResetHandler();
    const spy = jest.spyOn(handler, 'archiveCurrentSession');
    await handler.execute('reset');
    expect(spy).toHaveBeenCalled();
  });
  
  test('should initialize new session after reset', async () => {
    const handler = new ResetHandler();
    const spy = jest.spyOn(handler, 'initializeNewSession');
    await handler.execute('clear');
    expect(spy).toHaveBeenCalled();
  });
});
```

#### UT-04: Data Retention Tests
```javascript
// test/unit/DataRetention.test.js
describe('DataRetention', () => {
  test('should delete data older than 7 days', async () => {
    const db = new Database();
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 8);
    
    await db.insert('sessions', { timestamp: oldDate });
    await db.cleanupOldData(7);
    
    const sessions = await db.getSessions();
    expect(sessions).toHaveLength(0);
  });
  
  test('should keep data within 7 days', async () => {
    const db = new Database();
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 5);
    
    await db.insert('sessions', { timestamp: recentDate });
    await db.cleanupOldData(7);
    
    const sessions = await db.getSessions();
    expect(sessions).toHaveLength(1);
  });
});
```

### 2. Integration Tests

#### IT-01: Hook Integration
```javascript
// test/integration/hooks.test.js
describe('Hook Integration', () => {
  test('should capture user input events', async () => {
    const hook = new UserInputHook();
    const context = { message: 'Test input', timestamp: Date.now() };
    
    await hook.execute(context);
    
    const stats = await getSessionStats();
    expect(stats.lastInput).toBe('Test input');
  });
  
  test('should track file access via tool calls', async () => {
    const hook = new ToolCallHook();
    const context = {
      tool: 'Read',
      params: { file_path: '/test/file.js' }
    };
    
    await hook.execute(context);
    
    const fileAccess = await getFileAccessLog();
    expect(fileAccess).toContainEqual(
      expect.objectContaining({ path: '/test/file.js' })
    );
  });
});
```

#### IT-02: Dashboard WebSocket
```javascript
// test/integration/dashboard.test.js
describe('Dashboard WebSocket', () => {
  test('should establish connection', (done) => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
      done();
    });
  });
  
  test('should receive initial state', (done) => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      expect(message.type).toBe('init');
      expect(message.data).toHaveProperty('tokenUsage');
      ws.close();
      done();
    });
  });
  
  test('should receive real-time updates', (done) => {
    const ws = new WebSocket('ws://localhost:3001');
    let messageCount = 0;
    
    ws.on('message', () => {
      messageCount++;
      if (messageCount > 1) {
        expect(messageCount).toBeGreaterThan(1);
        ws.close();
        done();
      }
    });
    
    // Trigger an update
    setTimeout(() => {
      triggerTokenUpdate(1000);
    }, 100);
  });
});
```

#### IT-03: NPM Package Installation
```javascript
// test/integration/npm-package.test.js
describe('NPM Package', () => {
  test('should install globally', async () => {
    const result = await exec('npm install -g context-monitoring');
    expect(result.code).toBe(0);
  });
  
  test('should run CLI commands', async () => {
    const result = await exec('context-monitor --version');
    expect(result.stdout).toMatch(/\d+\.\d+\.\d+/);
  });
  
  test('should initialize in project', async () => {
    const result = await exec('context-monitor init');
    expect(fs.existsSync('.context-monitor')).toBe(true);
  });
});
```

### 3. End-to-End Tests

#### E2E-01: Complete Session Flow
```javascript
// test/e2e/session.test.js
describe('Complete Session', () => {
  test('should track entire session lifecycle', async () => {
    // Start session
    await startMonitoring();
    
    // Simulate user inputs
    await simulateUserInput('Hello Claude');
    await simulateToolCall('Read', { file_path: '/test.js' });
    
    // Check metrics
    let metrics = await getMetrics();
    expect(metrics.tokenCount).toBeGreaterThan(0);
    
    // Simulate context growth
    for (let i = 0; i < 100; i++) {
      await simulateUserInput(`Message ${i}`);
    }
    
    // Check for warnings
    metrics = await getMetrics();
    expect(metrics.contextUsage).toBeGreaterThan(50);
    
    // Simulate reset
    await simulateCommand('/clear');
    
    // Verify reset
    metrics = await getMetrics();
    expect(metrics.tokenCount).toBe(0);
  });
});
```

#### E2E-02: Compact Detection Flow
```javascript
// test/e2e/compact.test.js
describe('Compact Detection', () => {
  test('should detect and handle context compact', async () => {
    // Fill context to near limit
    await fillContext(180000);
    
    // Simulate compact (sudden reduction)
    await simulateCompact(100000);
    
    // Check compact event recorded
    const events = await getCompactEvents();
    expect(events).toHaveLength(1);
    expect(events[0].reduction).toBe(80000);
    
    // Check dashboard notification
    const dashboard = await getDashboardState();
    expect(dashboard.alerts).toContain('Compact detected');
  });
});
```

### 4. Performance Tests

#### PT-01: Token Counting Speed
```javascript
// test/performance/token-speed.test.js
describe('Token Counting Performance', () => {
  test('should count tokens < 10ms', async () => {
    const counter = new ClaudeTokenCounter();
    const text = 'Sample text'.repeat(100); // ~1100 chars
    
    const start = performance.now();
    await counter.estimateTokens(text);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(10);
  });
  
  test('should handle large texts efficiently', async () => {
    const counter = new ClaudeTokenCounter();
    const text = 'Large text'.repeat(10000); // ~100K chars
    
    const start = performance.now();
    await counter.estimateTokens(text);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
  });
});
```

#### PT-02: Dashboard Latency
```javascript
// test/performance/dashboard.test.js
describe('Dashboard Performance', () => {
  test('should update within 1 second', async () => {
    const start = Date.now();
    
    await triggerTokenUpdate(5000);
    await waitForDashboardUpdate();
    
    const latency = Date.now() - start;
    expect(latency).toBeLessThan(1000);
  });
  
  test('should handle rapid updates', async () => {
    const updates = [];
    
    for (let i = 0; i < 10; i++) {
      updates.push(triggerTokenUpdate(100));
    }
    
    await Promise.all(updates);
    
    const dashboard = await getDashboardState();
    expect(dashboard.errors).toHaveLength(0);
  });
});
```

#### PT-03: Memory Usage
```javascript
// test/performance/memory.test.js
describe('Memory Usage', () => {
  test('should stay under 50MB', async () => {
    const monitor = new ContextMonitor();
    await monitor.start();
    
    // Simulate heavy usage
    for (let i = 0; i < 1000; i++) {
      await monitor.trackToken(1000);
      await monitor.trackFile(`/file${i}.js`);
    }
    
    const memUsage = process.memoryUsage();
    expect(memUsage.heapUsed / 1024 / 1024).toBeLessThan(50);
  });
});
```

### 5. Acceptance Tests

#### AT-01: User Story - Monitor Session
```gherkin
Feature: Monitor Claude Code Session
  As a developer
  I want to monitor my token usage
  So that I can optimize my AI interactions

  Scenario: Start monitoring new session
    Given I have installed context-monitoring
    When I start a new Claude Code session
    Then the monitor should begin tracking
    And the dashboard should be accessible at localhost:3000

  Scenario: View real-time metrics
    Given monitoring is active
    When I interact with Claude Code
    Then I should see token count update in real-time
    And I should see context usage percentage
    And I should see file access history

  Scenario: Receive context warning
    Given my context usage is at 85%
    When I send another message
    Then I should receive a warning alert
    And the dashboard should show warning status
```

#### AT-02: User Story - Handle Reset
```gherkin
Feature: Handle Context Reset
  As a developer
  I want the monitor to handle resets properly
  So that my metrics remain accurate

  Scenario: Manual reset with /clear
    Given I have an active session with metrics
    When I execute the /clear command
    Then all counters should reset to zero
    And the previous session should be archived
    And a new session should start

  Scenario: Detect automatic compact
    Given my context is near the limit
    When Claude performs automatic compaction
    Then the monitor should detect the reduction
    And record the compact event
    And adjust metrics accordingly
```

## 📊 Test Data Requirements

### Sample Test Data
```javascript
// test/fixtures/test-data.js
module.exports = {
  englishTexts: [
    'Hello world',
    'The quick brown fox jumps over the lazy dog',
    'function calculateSum(a, b) { return a + b; }'
  ],
  japaneseTexts: [
    'こんにちは世界',
    '吾輩は猫である',
    'プログラミングは楽しい'
  ],
  mixedTexts: [
    'Hello こんにちは world',
    'const 変数 = "value"',
    'Error: ファイルが見つかりません'
  ],
  largeText: 'Lorem ipsum...'.repeat(1000),
  filePaths: [
    '/src/index.js',
    '/test/unit.test.js',
    '/package.json'
  ]
};
```

## 🎯 Acceptance Criteria

### Functional Criteria
- [ ] Token counting accuracy within ±10% for test data
- [ ] Compact detection triggers on 30%+ reduction
- [ ] Reset commands clear all metrics
- [ ] 7-day data retention enforced
- [ ] Dashboard updates within 1 second

### Performance Criteria
- [ ] Token counting < 10ms per operation
- [ ] Dashboard latency < 1 second
- [ ] Memory usage < 50MB
- [ ] CPU overhead < 2%

### Quality Criteria
- [ ] Unit test coverage > 80%
- [ ] Integration tests all passing
- [ ] E2E tests demonstrate full workflow
- [ ] Performance benchmarks met

## 🐛 Test Environment

### Local Development
```yaml
environment:
  node: '18.x'
  os: 'macOS/Linux/Windows'
  database: 'SQLite in-memory for tests'
  dashboard: 'localhost:3000'
```

### CI/CD Pipeline
```yaml
test_stages:
  - unit_tests:
      command: 'npm run test:unit'
      coverage: true
  - integration_tests:
      command: 'npm run test:integration'
      services: ['dashboard-server']
  - e2e_tests:
      command: 'npm run test:e2e'
      environment: 'staging'
  - performance_tests:
      command: 'npm run test:performance'
      threshold: 'benchmarks.json'
```

## 📝 Test Execution Plan

### Phase 1: Unit Tests (Day 1-2)
1. Implement token counter tests
2. Implement compact detector tests
3. Implement reset handler tests
4. Implement data retention tests

### Phase 2: Integration Tests (Day 3-4)
1. Setup test environment
2. Implement hook integration tests
3. Implement dashboard WebSocket tests
4. Implement NPM package tests

### Phase 3: E2E & Performance (Day 5-6)
1. Implement session flow tests
2. Implement compact detection flow
3. Implement performance benchmarks
4. Run acceptance tests

### Phase 4: Bug Fixes & Retesting (Day 7)
1. Fix identified issues
2. Rerun failed tests
3. Update documentation
4. Final validation

## ✅ Test Design Review Checklist

- [x] All requirements covered by tests
- [x] Claude-specific features tested
- [x] Compact detection scenarios included
- [x] Reset/clear command handling tested
- [x] 7-day retention policy validated
- [x] Performance benchmarks defined
- [x] Test data prepared
- [x] Acceptance criteria clear
- [ ] Human approval received

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-09 | Initial test design | Claude Code |