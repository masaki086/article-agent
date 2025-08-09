# Context Monitoring System - Detailed Design

**Date:** 2025-01-09 | **Version:** 1.0  
**Feature:** Context Monitoring System

## 📐 Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   Claude Code Session                    │
├─────────────────────────────────────────────────────────┤
│                      Hook Layer                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │UserInput │ │ToolCall │ │Response │ │ Session  │  │
│  │  Hook    │ │  Hook   │ │  Hook   │ │  Hook    │  │
│  └────┬─────┘ └────┬────┘ └────┬────┘ └────┬─────┘  │
└───────┼────────────┼───────────┼───────────┼──────────┘
        │            │           │           │
        ▼            ▼           ▼           ▼
┌─────────────────────────────────────────────────────────┐
│              Context Monitoring Core                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Event Processor                      │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐   │
│  │  Token   │ │ Context  │ │  File    │ │Pattern │   │
│  │ Counter  │ │ Analyzer │ │ Tracker  │ │Detector│   │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘   │
└─────────────────────────────────────────────────────────┘
        │            │           │           │
        ▼            ▼           ▼           ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   SQLite     │ │  JSON Cache  │ │  Log Files  │   │
│  │   Database   │ │              │ │              │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────┘
        │            │           │
        ▼            ▼           ▼
┌─────────────────────────────────────────────────────────┐
│                 Presentation Layer                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  Dashboard   │ │     CLI      │ │     API      │   │
│  │   (Web UI)   │ │   Commands   │ │  (NPM pkg)   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Component Design

### 1. Hook Integration Layer

#### UserInputHook
```javascript
// Path: /optimization/hooks/user-input-hook.js
module.exports = {
  name: 'user-input-hook',
  priority: 100,
  async execute(context) {
    const { message, timestamp } = context;
    await tokenCounter.count(message, 'user');
    await sessionTracker.recordInput(message, timestamp);
    return context;
  }
};
```

#### ToolCallHook
```javascript
// Path: /optimization/hooks/tool-call-hook.js
module.exports = {
  name: 'tool-call-hook',
  priority: 100,
  async execute(context) {
    const { tool, params, result } = context;
    if (tool === 'Read') {
      await fileTracker.recordAccess(params.file_path);
    }
    await tokenCounter.countToolUse(tool, params, result);
    return context;
  }
};
```

### 2. Core Modules

#### TokenCounter (Hybrid Approach)
```javascript
// Path: /src/core/TokenCounter.js
const tiktoken = require('tiktoken');

class HybridTokenCounter {
  constructor(config) {
    this.cache = new LRUCache(1000);
    // Use tiktoken for better accuracy, with Claude-specific adjustments
    this.encoder = tiktoken.encoding_for_model('gpt-4'); // Base reference
    this.claudeAdjustmentFactor = 1.1; // Claude tends to use ~10% more tokens
  }
  
  async count(text, category) {
    const tokens = await this.estimateTokens(text);
    await this.store(tokens, category);
    return tokens;
  }
  
  async estimateTokens(text) {
    if (this.cache.has(text)) {
      return this.cache.get(text);
    }
    
    try {
      // Use tiktoken for base calculation
      const tiktokenCount = this.encoder.encode(text).length;
      // Apply Claude adjustment factor
      const adjustedCount = Math.ceil(tiktokenCount * this.claudeAdjustmentFactor);
      this.cache.set(text, adjustedCount);
      return adjustedCount;
    } catch (error) {
      // Fallback to character-based estimation if tiktoken fails
      return this.fallbackEstimation(text);
    }
  }
  
  fallbackEstimation(text) {
    // Corrected character-to-token ratios
    const japaneseChars = (text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g) || []).length;
    const englishChars = text.length - japaneseChars;
    
    // Japanese: ~1.5 chars per token (0.67 tokens per char)
    // English: ~4 chars per token (0.25 tokens per char)
    const tokens = Math.ceil(japaneseChars * 0.67 + englishChars * 0.25);
    return tokens;
  }
}
```

#### ContextAnalyzer with Compact Detection
```javascript
// Path: /src/core/ContextAnalyzer.js
class ContextAnalyzer {
  constructor(database) {
    this.db = database;
    this.thresholds = { warning: 0.8, critical: 0.9 };
    this.maxContext = 200000; // Claude context window
    this.compactDetector = new CompactDetector();
    this.resetHandler = new ResetHandler();
  }
  
  async analyze() {
    const current = await this.getCurrentSize();
    const usage = current / this.maxContext;
    
    // Detect context compact
    const compactDetected = await this.compactDetector.detect(current);
    if (compactDetected) {
      await this.handleCompact(compactDetected);
    }
    
    // Alert on thresholds
    if (usage > this.thresholds.critical) {
      await this.triggerAlert('critical', usage);
    } else if (usage > this.thresholds.warning) {
      await this.triggerAlert('warning', usage);
    }
    
    return {
      current,
      max: this.maxContext,
      usage: usage * 100,
      compactEvents: this.compactDetector.getEvents(),
      recommendations: await this.generateRecommendations(usage)
    };
  }
  
  async handleReset(source) {
    // Handle /reset or /clear commands
    await this.resetHandler.execute(source);
    await this.db.recordReset(source, Date.now());
  }
}

class CompactDetector {
  constructor() {
    this.previousSize = 0;
    this.events = [];
    this.threshold = 0.3; // 30% reduction
  }
  
  async detect(currentSize) {
    if (this.previousSize === 0) {
      this.previousSize = currentSize;
      return null;
    }
    
    const reduction = this.previousSize - currentSize;
    const rate = reduction / this.previousSize;
    
    if (rate > this.threshold && reduction > 10000) {
      const event = {
        timestamp: Date.now(),
        before: this.previousSize,
        after: currentSize,
        reduction,
        rate
      };
      this.events.push(event);
      this.previousSize = currentSize;
      return event;
    }
    
    this.previousSize = currentSize;
    return null;
  }
}

class ResetHandler {
  async execute(source) {
    // source: 'clear', 'reset', 'startup', 'resume'
    console.log(`🔄 Context reset: ${source}`);
    // Reset all counters and tracking data
    await this.clearCounters();
    await this.archiveCurrentSession();
    await this.initializeNewSession();
  }
}
```

#### LanguageAnalyzer
```javascript
// Path: /src/core/LanguageAnalyzer.js
class LanguageAnalyzer {
  constructor() {
    this.japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g;
    this.stats = {
      totalJapanese: 0,
      totalEnglish: 0,
      messages: [],
      files: new Map()
    };
  }
  
  analyze(text, source = 'message') {
    const japaneseChars = (text.match(this.japaneseRegex) || []).length;
    const totalChars = text.length;
    const englishChars = totalChars - japaneseChars;
    
    // Calculate percentages
    const japaneseRatio = totalChars > 0 ? japaneseChars / totalChars : 0;
    const englishRatio = totalChars > 0 ? englishChars / totalChars : 0;
    
    // Determine primary language (>10% Japanese = Japanese content)
    const primaryLanguage = japaneseRatio > 0.1 ? 'japanese' : 'english';
    
    // Calculate token costs
    const japaneseTokens = Math.ceil(japaneseChars * 0.67);
    const englishTokens = Math.ceil(englishChars * 0.25);
    const totalTokens = japaneseTokens + englishTokens;
    
    // Token efficiency comparison
    const equivalentEnglishChars = totalChars * 0.6; // Estimate if all in English
    const potentialEnglishTokens = Math.ceil(equivalentEnglishChars * 0.25);
    const tokenSavings = totalTokens - potentialEnglishTokens;
    const savingsPercentage = totalTokens > 0 ? (tokenSavings / totalTokens) * 100 : 0;
    
    const analysis = {
      source,
      primaryLanguage,
      japaneseChars,
      englishChars,
      japaneseRatio: (japaneseRatio * 100).toFixed(1),
      englishRatio: (englishRatio * 100).toFixed(1),
      japaneseTokens,
      englishTokens,
      totalTokens,
      potentialSavings: tokenSavings > 0 ? tokenSavings : 0,
      savingsPercentage: savingsPercentage.toFixed(1),
      timestamp: Date.now()
    };
    
    // Update statistics
    this.updateStats(analysis);
    
    return analysis;
  }
  
  updateStats(analysis) {
    this.stats.totalJapanese += analysis.japaneseTokens;
    this.stats.totalEnglish += analysis.englishTokens;
    
    if (analysis.source.startsWith('file:')) {
      this.stats.files.set(analysis.source, analysis);
    } else {
      this.stats.messages.push(analysis);
    }
  }
  
  generateRecommendation() {
    const total = this.stats.totalJapanese + this.stats.totalEnglish;
    const japanesePercent = (this.stats.totalJapanese / total) * 100;
    
    const recommendations = [];
    
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
    }
    
    // File-specific recommendations
    const heavyJapaneseFiles = Array.from(this.stats.files.entries())
      .filter(([_, analysis]) => analysis.japaneseRatio > 50)
      .sort((a, b) => b[1].totalTokens - a[1].totalTokens)
      .slice(0, 5);
    
    if (heavyJapaneseFiles.length > 0) {
      recommendations.push({
        level: 'info',
        message: '📁 Files with high Japanese content:',
        files: heavyJapaneseFiles.map(([path, analysis]) => ({
          path,
          japaneseRatio: analysis.japaneseRatio,
          potentialSavings: analysis.potentialSavings
        }))
      });
    }
    
    return recommendations;
  }
}
```

#### FileTracker
```javascript
// Path: /src/core/FileTracker.js
class FileTracker {
  constructor(database, languageAnalyzer) {
    this.db = database;
    this.languageAnalyzer = languageAnalyzer;
    this.accessLog = new Map();
  }
  
  async recordAccess(filePath, operation = 'read', content = null) {
    const timestamp = Date.now();
    const fileSize = await this.getFileSize(filePath);
    const tokenCost = await this.estimateTokens(filePath);
    
    // Analyze language if content provided
    let languageAnalysis = null;
    if (content) {
      languageAnalysis = this.languageAnalyzer.analyze(content, `file:${filePath}`);
    }
    
    await this.db.insert('file_access', {
      path: filePath,
      operation,
      timestamp,
      size: fileSize,
      tokens: tokenCost,
      language: languageAnalysis?.primaryLanguage,
      japaneseRatio: languageAnalysis?.japaneseRatio
    });
    
    // Track redundant access
    if (this.accessLog.has(filePath)) {
      const lastAccess = this.accessLog.get(filePath);
      if (timestamp - lastAccess < 60000) { // Within 1 minute
        await this.flagRedundant(filePath);
      }
    }
    this.accessLog.set(filePath, timestamp);
  }
}
```

#### PatternDetector
```javascript
// Path: /src/core/PatternDetector.js
class PatternDetector {
  constructor(database) {
    this.db = database;
    this.patterns = [];
  }
  
  async detectLoops() {
    const recentMessages = await this.db.getRecentMessages(20);
    const loops = this.findRepeatingSequences(recentMessages);
    return loops;
  }
  
  async analyzeEfficiency() {
    const sessions = await this.db.getSessions();
    return {
      avgSessionLength: this.calculateAverage(sessions),
      optimalLength: this.findOptimal(sessions),
      completionRate: this.calculateCompletionRate(sessions)
    };
  }
}
```

### 3. Data Layer

#### Database Schema (SQLite)
```sql
-- Sessions table
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  total_tokens INTEGER,
  model VARCHAR(50),
  status VARCHAR(20)
);

-- Messages table
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER,
  role VARCHAR(20),
  content TEXT,
  tokens INTEGER,
  timestamp TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- File access table
CREATE TABLE file_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER,
  file_path TEXT,
  operation VARCHAR(20),
  tokens INTEGER,
  timestamp TIMESTAMP,
  redundant BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Metrics table
CREATE TABLE metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER,
  metric_type VARCHAR(50),
  value REAL,
  timestamp TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

### 4. Dashboard Implementation

#### WebSocket Server
```javascript
// Path: /src/dashboard/server.js
const WebSocket = require('ws');
const express = require('express');

class DashboardServer {
  constructor(port = 3000) {
    this.app = express();
    this.wss = new WebSocket.Server({ port: port + 1 });
    this.setupRoutes();
    this.setupWebSocket();
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      // Send initial state
      ws.send(JSON.stringify({
        type: 'init',
        data: this.getCurrentMetrics()
      }));
      
      // Subscribe to updates
      this.subscribeToUpdates(ws);
    });
  }
  
  broadcast(data) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
```

#### Dashboard Frontend with Language Analytics
```html
<!-- Path: /src/dashboard/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Context Monitor</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div id="app">
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Token Usage</h3>
        <canvas id="tokenChart"></canvas>
      </div>
      <div class="metric-card">
        <h3>Context Size</h3>
        <div class="progress-bar">
          <div id="contextBar"></div>
        </div>
      </div>
      <div class="metric-card">
        <h3>Language Distribution</h3>
        <canvas id="languageChart"></canvas>
        <div class="language-stats">
          <p>Japanese: <span id="jpTokens">0</span> tokens</p>
          <p>English: <span id="enTokens">0</span> tokens</p>
          <p class="savings">Potential Savings: <span id="savings">0</span> tokens</p>
        </div>
      </div>
      <div class="metric-card">
        <h3>Optimization Tips</h3>
        <div id="recommendations" class="recommendations">
          <!-- Dynamic recommendations here -->
        </div>
      </div>
      <div class="metric-card">
        <h3>File Access</h3>
        <ul id="fileList"></ul>
      </div>
    </div>
  </div>
  <script src="dashboard.js"></script>
</body>
</html>
```

```javascript
// Path: /src/dashboard/dashboard.js
class DashboardClient {
  constructor() {
    this.ws = null;
    this.charts = {};
    this.initWebSocket();
    this.initCharts();
  }
  
  initCharts() {
    // Language distribution pie chart
    this.charts.language = new Chart(
      document.getElementById('languageChart'),
      {
        type: 'doughnut',
        data: {
          labels: ['Japanese', 'English'],
          datasets: [{
            data: [0, 0],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} tokens (${percentage}%)`;
                }
              }
            }
          }
        }
      }
    );
  }
  
  updateLanguageStats(data) {
    // Update pie chart
    this.charts.language.data.datasets[0].data = [
      data.japaneseTokens,
      data.englishTokens
    ];
    this.charts.language.update();
    
    // Update text stats
    document.getElementById('jpTokens').textContent = data.japaneseTokens.toLocaleString();
    document.getElementById('enTokens').textContent = data.englishTokens.toLocaleString();
    document.getElementById('savings').textContent = data.potentialSavings.toLocaleString();
    
    // Update recommendations
    this.updateRecommendations(data.recommendations);
  }
  
  updateRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
    
    recommendations.forEach(rec => {
      const div = document.createElement('div');
      div.className = `recommendation ${rec.level}`;
      div.innerHTML = `
        <p>${rec.message}</p>
        ${rec.estimatedSavings ? `<p class="savings-amount">Save ~${rec.estimatedSavings} tokens</p>` : ''}
        ${rec.files ? this.renderFileList(rec.files) : ''}
      `;
      container.appendChild(div);
    });
  }
  
  renderFileList(files) {
    return '<ul class="file-recommendations">' +
      files.map(f => 
        `<li>${f.path} (${f.japaneseRatio}% JP, save ${f.potentialSavings} tokens)</li>`
      ).join('') +
      '</ul>';
  }
}
```

### 5. NPM Package Structure

```
claudecode-context-monitoring/   # NPM package name
├── package.json
├── README.md
├── LICENSE
├── bin/
│   └── context-monitor.js      # CLI entry point
├── src/
│   ├── index.js                 # Main export
│   ├── core/
│   │   ├── TokenCounter.js
│   │   ├── ContextAnalyzer.js
│   │   ├── FileTracker.js
│   │   └── PatternDetector.js
│   ├── hooks/
│   │   ├── index.js
│   │   ├── user-input-hook.js
│   │   └── tool-call-hook.js
│   ├── dashboard/
│   │   ├── server.js
│   │   ├── index.html
│   │   └── dashboard.js
│   └── utils/
│       ├── database.js
│       ├── logger.js
│       └── config.js
├── tests/
│   ├── unit/
│   └── integration/
└── examples/
    └── basic-usage/
```

## 🔧 Technical Decisions

### Token Counting Strategy
- **Hybrid Approach**: tiktoken with Claude-specific adjustments
  - Primary: tiktoken (GPT-4 model) with 1.1x adjustment factor for Claude
  - Fallback: Character-based estimation when tiktoken unavailable
    - Japanese: 1.5 characters per token (0.67 tokens/char)
    - English: 4 characters per token (0.25 tokens/char)
- **Caching**: LRU cache for frequently counted text
- **Validation**: Periodic comparison with actual API usage

### Data Storage
- **Primary**: SQLite for structured data (sessions, metrics)
- **Secondary**: JSON files for configuration and cache
- **Logs**: Rotating log files (7-day retention)
- **Data Retention**: Automatic cleanup after 7 days

### Real-time Updates
- **WebSocket**: For dashboard real-time updates
- **Event-driven**: Internal event bus for module communication
- **Throttling**: Update dashboard max 1Hz to prevent overload

### Performance Optimizations
- **Lazy Loading**: Load modules on-demand
- **Worker Threads**: Token counting in separate thread
- **Batch Processing**: Group database writes
- **Compression**: Compress old session data

## 🔐 Security Considerations

### Data Protection
- No sensitive data in logs (filter API keys, passwords)
- Local storage only (no external API calls)
- Automatic data deletion after 7 days
- No personal information collection

### Access Control
- Dashboard runs on localhost with open access
- No authentication required (local use only)
- Read-only API endpoints
- No external network access

## 🧪 Testing Strategy

### Unit Tests
- TokenCounter: Accuracy tests with known token counts
- ContextAnalyzer: Threshold detection tests
- FileTracker: Redundancy detection tests
- PatternDetector: Loop detection algorithm tests

### Integration Tests
- Hook integration with Claude Code
- Database operations under load
- WebSocket connection stability
- NPM package installation

### Performance Tests
- Token counting speed (target: <10ms)
- Dashboard update latency (target: <1s)
- Memory usage under long sessions
- CPU usage monitoring

## 📦 Deployment Plan

### NPM Publishing
1. Build and bundle with webpack
2. Generate TypeScript definitions
3. Publish to npm registry as 'claudecode-context-monitoring'
4. Create GitHub release

### Installation Process
```bash
# Install globally
npm install -g claudecode-context-monitoring

# Or as dev dependency
npm install --save-dev claudecode-context-monitoring

# Initialize in project
context-monitor init

# Start monitoring
context-monitor start
```

## 🎯 Success Metrics

### Performance Metrics
- Token counting accuracy: ±5%
- Dashboard latency: <1 second
- Memory usage: <50MB
- CPU overhead: <2%

### Quality Metrics
- Test coverage: >80%
- Documentation coverage: 100%
- Zero critical bugs in first release
- NPM weekly downloads: >100

## 📚 Dependencies

### Core Dependencies
- `tiktoken`: Accurate token counting (with Claude adjustments)
- `sqlite3`: Database operations
- `ws`: WebSocket server
- `express`: Dashboard server
- `chart.js`: Dashboard visualizations
- `node-cron`: Scheduled data cleanup (7-day retention)

### Dev Dependencies
- `jest`: Testing framework
- `webpack`: Bundling
- `eslint`: Code quality
- `prettier`: Code formatting

## 🔄 Migration Plan

### From Existing System
1. Preserve existing bash scripts as legacy mode
2. Migrate historical data to SQLite
3. Update hooks configuration
4. Gradual rollout with feature flags

## 📝 Documentation Plan

### User Documentation
- Quick start guide
- Configuration reference
- Dashboard user guide
- Troubleshooting guide

### Developer Documentation
- API reference
- Hook development guide
- Contributing guidelines
- Architecture deep dive

## ✅ Design Review Checklist

- [x] Architecture supports all requirements
- [x] Performance targets achievable
- [x] Security considerations addressed
- [x] Testing strategy comprehensive
- [x] NPM package structure defined
- [x] Migration path clear
- [ ] Human approval received

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-09 | Initial design | Claude Code |