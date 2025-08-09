# Claude Code Context Monitoring

A context monitoring and optimization tool for Claude Code sessions that tracks token usage and encourages English usage for better efficiency.

## 🌟 Features

- **Hybrid Token Counting**: Accurate token counting using tiktoken with Claude-specific adjustments
- **Language Analysis**: Automatic Japanese/English detection with savings recommendations
- **Context Compact Detection**: Automatic detection of context compression events
- **Secure Data Management**: No message content storage, only statistics
- **Auto Cleanup**: Automatic deletion of data older than 7 days

## 📦 Installation

```bash
# Clone repository (until NPM publication)
git clone https://github.com/[username]/claudecode-context-monitoring.git
cd claudecode-context-monitoring
npm install
npm run build
```

## 🚀 Quick Start

### CLI Usage

```bash
# Initialize monitoring
node bin/context-monitor.js init

# Test with sample data
node bin/context-monitor.js test

# Check status
node bin/context-monitor.js status

# Start monitoring (dashboard coming soon)
node bin/context-monitor.js start
```

### Programmatic Usage

```typescript
import { ContextMonitor } from 'claudecode-context-monitoring';

const monitor = new ContextMonitor();
await monitor.initialize();

// Track messages
await monitor.trackMessage('こんにちは世界', 'user');
await monitor.trackMessage('Hello World', 'assistant');

// Get metrics
const metrics = await monitor.getMetrics();
console.log(`Token usage: ${metrics.usage}%`);
console.log(`Japanese tokens: ${metrics.languageStats.japaneseTokens}`);
console.log(`Potential savings: ${metrics.languageStats.potentialSavings}`);

// Get recommendations
const recommendations = await monitor.getRecommendations();
recommendations.forEach(rec => {
  console.log(`${rec.level}: ${rec.message}`);
});
```

## 🔒 Security & Privacy

- **No Content Storage**: Message contents are never stored
- **Local Only**: All data stays on your machine
- **Auto Cleanup**: Data older than 7 days is automatically deleted
- **No External Calls**: No data is sent to external services

## 📊 Language Efficiency

The tool analyzes your Japanese/English usage and provides recommendations:

- 🚨 **High Priority** (>50% Japanese): Consider using English for 40-50% token savings
- ⚠️ **Medium Priority** (30-50% Japanese): English could save ~30% tokens
- 📊 **Low Priority** (<30% Japanese): You're using English efficiently!

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## 📝 Configuration

Configuration file is created at `.context-monitor/config.json`:

```json
{
  "maxContext": 200000,
  "thresholds": {
    "warning": 0.8,
    "critical": 0.9
  },
  "dataRetention": 7,
  "language": {
    "encourageEnglish": true,
    "alertThreshold": 0.5
  }
}
```

## 🗺️ Roadmap

- [x] Core functionality
- [x] CLI tool
- [x] Security compliance
- [ ] Web dashboard
- [ ] Claude Code hook integration
- [ ] NPM package publication
- [ ] Full documentation

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Status

**Alpha Version** - Core features are working but dashboard and hook integration are still under development.

---

For detailed migration and development information, see [MIGRATION.md](./MIGRATION.md)