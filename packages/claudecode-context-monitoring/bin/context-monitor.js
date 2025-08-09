#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

// This will be compiled from TypeScript
const { ContextMonitor } = require('../lib/index');

program
  .name('context-monitor')
  .description('Context monitoring tool for Claude Code sessions')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize context monitoring in current directory')
  .action(async () => {
    try {
      const configPath = path.join(process.cwd(), '.context-monitor');
      if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath, { recursive: true });
      }

      // Create default config
      const config = {
        version: '1.0.0',
        maxContext: 200000,
        thresholds: {
          warning: 0.8,
          critical: 0.9
        },
        dataRetention: 7,
        language: {
          encourageEnglish: true,
          alertThreshold: 0.5
        }
      };

      fs.writeFileSync(
        path.join(configPath, 'config.json'),
        JSON.stringify(config, null, 2)
      );

      console.log(chalk.green('✅ Context monitoring initialized successfully!'));
      console.log(chalk.gray(`Configuration saved to ${configPath}/config.json`));
    } catch (error) {
      console.error(chalk.red('Failed to initialize:'), error.message);
      process.exit(1);
    }
  });

program
  .command('start')
  .description('Start monitoring context')
  .action(async () => {
    try {
      const monitor = new ContextMonitor();
      await monitor.initialize();
      
      console.log(chalk.green('🚀 Context monitoring started'));
      console.log(chalk.gray('Dashboard available at http://localhost:3000'));
      
      // In real implementation, this would start the dashboard server
      // For now, just show current metrics
      const metrics = await monitor.getMetrics();
      console.log('\nCurrent Metrics:');
      console.log(`  Context Usage: ${metrics.usage.toFixed(1)}% (${metrics.current}/${metrics.max} tokens)`);
      console.log(`  Status: ${metrics.status === 'safe' ? chalk.green(metrics.status) : 
                             metrics.status === 'warning' ? chalk.yellow(metrics.status) : 
                             chalk.red(metrics.status)}`);
      
      const langStats = metrics.languageStats;
      console.log(`  Japanese Tokens: ${langStats.japaneseTokens}`);
      console.log(`  English Tokens: ${langStats.englishTokens}`);
      if (langStats.potentialSavings > 0) {
        console.log(chalk.yellow(`  Potential Savings: ${langStats.potentialSavings} tokens`));
      }

      // Keep process alive
      process.stdin.resume();
    } catch (error) {
      console.error(chalk.red('Failed to start monitoring:'), error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show current monitoring status')
  .action(async () => {
    try {
      const monitor = new ContextMonitor();
      await monitor.initialize();
      
      const metrics = await monitor.getMetrics();
      const stats = await monitor.getSessionStats();
      
      console.log(chalk.bold('\n📊 Context Monitoring Status\n'));
      
      // Context usage bar
      const usage = metrics.usage;
      const barLength = 30;
      const filledLength = Math.round((usage / 100) * barLength);
      const emptyLength = barLength - filledLength;
      
      let barColor = chalk.green;
      if (metrics.status === 'warning') barColor = chalk.yellow;
      if (metrics.status === 'critical') barColor = chalk.red;
      
      const bar = barColor('█'.repeat(filledLength)) + chalk.gray('░'.repeat(emptyLength));
      console.log(`Context Usage: [${bar}] ${usage.toFixed(1)}%`);
      console.log(`Tokens: ${metrics.current.toLocaleString()} / ${metrics.max.toLocaleString()}`);
      
      // Language distribution
      const total = metrics.languageStats.japaneseTokens + metrics.languageStats.englishTokens;
      if (total > 0) {
        const jpPercent = (metrics.languageStats.japaneseTokens / total * 100).toFixed(1);
        const enPercent = (metrics.languageStats.englishTokens / total * 100).toFixed(1);
        
        console.log(`\n📝 Language Distribution:`);
        console.log(`  Japanese: ${jpPercent}% (${metrics.languageStats.japaneseTokens.toLocaleString()} tokens)`);
        console.log(`  English: ${enPercent}% (${metrics.languageStats.englishTokens.toLocaleString()} tokens)`);
        
        if (metrics.languageStats.potentialSavings > 0) {
          console.log(chalk.yellow(`  💡 Potential savings: ${metrics.languageStats.potentialSavings.toLocaleString()} tokens with English`));
        }
      }
      
      // Recommendations
      const recommendations = await monitor.getRecommendations();
      if (recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        recommendations.forEach(rec => {
          const icon = rec.level === 'high' ? '🚨' : 
                      rec.level === 'medium' ? '⚠️' : 
                      rec.level === 'low' ? '📊' : 'ℹ️';
          console.log(`  ${icon} ${rec.message}`);
          if (rec.estimatedSavings) {
            console.log(chalk.gray(`     Save ~${rec.estimatedSavings.toLocaleString()} tokens`));
          }
        });
      }
      
      await monitor.close();
    } catch (error) {
      console.error(chalk.red('Failed to get status:'), error.message);
      process.exit(1);
    }
  });

program
  .command('test')
  .description('Test monitoring with sample data')
  .action(async () => {
    try {
      const monitor = new ContextMonitor();
      await monitor.initialize();
      
      console.log(chalk.bold('🧪 Testing Context Monitor\n'));
      
      // Test Japanese message
      console.log('Testing Japanese message...');
      await monitor.trackMessage('こんにちは、今日はプログラミングの勉強をしています。');
      
      // Test English message
      console.log('Testing English message...');
      await monitor.trackMessage('Hello, I am studying programming today.');
      
      // Test mixed message
      console.log('Testing mixed message...');
      await monitor.trackMessage('const greeting = "こんにちは"; // Japanese greeting');
      
      // Test file tracking
      console.log('Testing file tracking...');
      await monitor.trackFileAccess('/test/sample.js', 'function hello() { return "Hello World"; }');
      await monitor.trackFileAccess('/test/sample_ja.js', 'function こんにちは() { return "こんにちは世界"; }');
      
      // Show results
      console.log('\n' + chalk.bold('📊 Test Results:\n'));
      
      const metrics = await monitor.getMetrics();
      console.log(`Total Tokens Used: ${metrics.current}`);
      console.log(`Context Usage: ${metrics.usage.toFixed(2)}%`);
      
      const langStats = metrics.languageStats;
      const total = langStats.japaneseTokens + langStats.englishTokens;
      if (total > 0) {
        const jpPercent = (langStats.japaneseTokens / total * 100).toFixed(1);
        console.log(`Japanese: ${jpPercent}% (${langStats.japaneseTokens} tokens)`);
        console.log(`English: ${100 - parseFloat(jpPercent)}% (${langStats.englishTokens} tokens)`);
        
        if (langStats.potentialSavings > 0) {
          console.log(chalk.yellow(`\n💡 Using English could save ${langStats.potentialSavings} tokens!`));
        }
      }
      
      const recommendations = await monitor.getRecommendations();
      if (recommendations.length > 0) {
        console.log('\n' + chalk.bold('Recommendations:'));
        recommendations.forEach(rec => {
          console.log(`• ${rec.message}`);
        });
      }
      
      await monitor.close();
      console.log(chalk.green('\n✅ Test completed successfully!'));
    } catch (error) {
      console.error(chalk.red('Test failed:'), error.message);
      process.exit(1);
    }
  });

program.parse();