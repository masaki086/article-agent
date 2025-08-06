**Date:** 2025-08-06 | **Version:** 1.0

# Claude Code Hooks Guide

## 🪝 Overview

Hooks in Claude Code are automated shell commands that execute in response to specific events, enabling workflow automation and quality control throughout your development process.

## 📋 How Hooks Work

### Basic Operation Flow

1. **Event Trigger**: Tool execution, file changes, or user actions
2. **Hook Detection**: Configured hooks respond to events
3. **Command Execution**: Defined shell commands run automatically
4. **Feedback**: Results are reported to the user

## 🎯 Available Hook Types

### 1. **user-prompt-submit-hook**
- **Trigger**: When user submits a prompt
- **Use Cases**: Input validation, preprocessing
- **Example**:
  ```json
  {
    "user-prompt-submit": {
      "command": "echo 'Processing: ${user_input}' >> activity.log"
    }
  }
  ```

### 2. **tool-call-hook**
- **Trigger**: Before/after any tool invocation
- **Use Cases**: Tool monitoring, logging
- **Example**:
  ```json
  {
    "tool-call": {
      "command": "echo 'Tool called: ${tool_name}' | tee -a tools.log"
    }
  }
  ```

### 3. **file-change-hook**
- **Trigger**: When files are modified
- **Use Cases**: Auto-formatting, syntax checking
- **Example**:
  ```json
  {
    "file-change": {
      "pattern": "*.ts",
      "command": "prettier --write ${file_path}"
    }
  }
  ```

### 4. **pre-commit-hook**
- **Trigger**: Before Git commits
- **Use Cases**: Code quality checks, test execution
- **Example**:
  ```json
  {
    "pre-commit": {
      "command": "npm run lint && npm test",
      "blocking": true
    }
  }
  ```

### 5. **post-article-hook**
- **Trigger**: After article creation
- **Use Cases**: Quality checks, tag generation
- **Example**:
  ```json
  {
    "post-article": {
      "command": "/quality-check ${article_path}",
      "blocking": false
    }
  }
  ```

## 📝 Configuration

### Settings File Structure

Hooks are configured in `.claude/settings.json` or `settings.local.json`:

```json
{
  "hooks": {
    "hook-name": {
      "command": "shell command to execute",
      "blocking": true,
      "timeout": 30000,
      "pattern": "*.js",
      "error_message": "Custom error message",
      "success_message": "Custom success message"
    }
  }
}
```

### Environment Variables

Available variables in hook commands:

| Variable | Description | Example |
|----------|-------------|---------|
| `${file_path}` | Path to modified file | `/path/to/file.js` |
| `${article_path}` | Path to created article | `/articles/series/article.md` |
| `${tool_name}` | Name of executed tool | `Write`, `Edit`, `Bash` |
| `${user_input}` | User's input content | User prompt text |
| `${project_root}` | Project root directory | `/Users/name/project` |
| `${timestamp}` | Current timestamp | `2025-08-06T10:30:45` |

## ⚙️ Configuration Options

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `command` | Shell command to execute | - | Yes |
| `blocking` | Wait for completion before continuing | `false` | No |
| `timeout` | Timeout in milliseconds | `10000` | No |
| `pattern` | File glob pattern | `*` | No |
| `error_message` | Custom error message | - | No |
| `success_message` | Custom success message | - | No |
| `condition` | Condition for execution | - | No |
| `retry` | Number of retry attempts | `0` | No |

## 🚀 Practical Examples

### 1. Quality Assurance Automation

```json
{
  "hooks": {
    "post-write": {
      "command": "eslint ${file_path} --fix && prettier --write ${file_path}",
      "pattern": "*.{js,ts,jsx,tsx}",
      "success_message": "Code formatted and linted successfully"
    }
  }
}
```

### 2. Article Creation Workflow

```json
{
  "hooks": {
    "post-article-generation": {
      "command": "/quality-check ${article_path} && /generate-tags ${article_path}",
      "blocking": true,
      "timeout": 60000,
      "error_message": "Article quality check failed"
    },
    "pre-qiita-post": {
      "command": "test $(cat ${article_path} | wc -w) -gt 1000",
      "blocking": true,
      "error_message": "Article too short (minimum 1000 words)"
    }
  }
}
```

### 3. Security Checks

```json
{
  "hooks": {
    "pre-commit": {
      "command": "git secrets --scan && npm audit",
      "blocking": true,
      "error_message": "Security vulnerabilities detected"
    },
    "file-change": {
      "pattern": "*.env*",
      "command": "echo 'WARNING: Environment file modified' >&2",
      "blocking": false
    }
  }
}
```

### 4. Development Workflow Enhancement

```json
{
  "hooks": {
    "post-npm-install": {
      "command": "npm ls --depth=0 > dependencies.txt",
      "success_message": "Dependencies list updated"
    },
    "pre-build": {
      "command": "rm -rf dist && echo 'Clean build initiated'",
      "blocking": true
    },
    "post-test": {
      "command": "[ -f coverage/lcov.info ] && echo 'Coverage: $(cat coverage/lcov.info | grep -o '[0-9]*%' | head -1)'",
      "blocking": false
    }
  }
}
```

## 💡 Advanced Techniques

### 1. Conditional Execution

```json
{
  "hooks": {
    "pre-commit": {
      "command": "if [ -f package.json ]; then npm test; elif [ -f Makefile ]; then make test; fi",
      "blocking": true
    }
  }
}
```

### 2. Command Chaining

```json
{
  "hooks": {
    "post-article": {
      "command": "/quality-check ${article_path} && /generate-diagrams && echo 'Processing complete'",
      "timeout": 120000
    }
  }
}
```

### 3. Error Handling with Fallbacks

```json
{
  "hooks": {
    "pre-publish": {
      "command": "/validate-article ${article_path} || (echo 'Validation failed, attempting fix' && /auto-fix ${article_path})",
      "blocking": true,
      "retry": 2
    }
  }
}
```

### 4. Parallel Processing

```json
{
  "hooks": {
    "post-series-creation": {
      "command": "find articles/${series_name} -name '*.md' | xargs -P 4 -I {} /quality-check {}",
      "timeout": 300000
    }
  }
}
```

## 🔒 Security and Restrictions

### Restrictions

1. **Execution Permissions**: Only commands allowed in `settings.local.json`
2. **Timeout Limits**: Default 10 seconds, maximum 60 seconds
3. **Concurrent Execution**: Same hooks cannot run in parallel
4. **Resource Limits**: CPU and memory usage are monitored

### Security Best Practices

1. **Command Validation**
   - Only use trusted commands
   - Avoid direct user input in commands
   - Use environment variables safely

2. **Permission Management**
   ```json
   {
     "permissions": {
       "allow": ["Bash(allowed-command:*)"],
       "deny": ["Bash(rm -rf:*)"]
     }
   }
   ```

3. **Input Sanitization**
   ```json
   {
     "hooks": {
       "file-change": {
         "command": "basename '${file_path}' | grep -E '^[a-zA-Z0-9._-]+$' && process-file '${file_path}'"
       }
     }
   }
   ```

## 🎯 Project-Specific Implementation

### Article Agent Project Hooks

```json
{
  "hooks": {
    "post-series-define": {
      "command": "echo 'Series created: $(ls -1 articles/ | tail -1)' && tree articles/$(ls -1 articles/ | tail -1) -L 2",
      "success_message": "Series structure created successfully"
    },
    "pre-qiita-post": {
      "command": "grep -q '^**Generated Tags:**' ${article_path} && echo 'Tags found' || echo 'Warning: No tags found'",
      "blocking": false
    },
    "post-diagram-generation": {
      "command": "find . -name '*.png' -mmin -1 | wc -l | xargs -I {} echo '{} diagrams generated'",
      "pattern": "*.mmd"
    },
    "quality-threshold": {
      "command": "score=$(/quality-check ${article_path} | grep 'Score:' | grep -o '[0-9]+'); test $score -ge 95",
      "blocking": true,
      "error_message": "Quality score below 95/100"
    }
  }
}
```

## ⚠️ Troubleshooting

### Common Issues and Solutions

#### 1. Hook Not Executing

**Symptoms**: Hook commands don't run
**Solutions**:
- Check permission settings in `settings.local.json`
- Verify pattern matching for file-based hooks
- Ensure hook name matches event type

#### 2. Timeout Errors

**Symptoms**: Hook fails with timeout
**Solutions**:
```json
{
  "hooks": {
    "slow-process": {
      "command": "long-running-command",
      "timeout": 60000,
      "blocking": false
    }
  }
}
```

#### 3. Blocking Issues

**Symptoms**: Claude Code freezes during hook execution
**Solutions**:
- Set `blocking: false` for non-critical hooks
- Add proper error handling
- Use shorter timeout values

#### 4. Permission Denied

**Symptoms**: Command execution fails
**Solutions**:
- Add command to `settings.local.json` allow list
- Check file permissions
- Use full paths for executables

### Debug Mode

Enable verbose logging for hooks:

```json
{
  "hooks": {
    "debug-mode": true,
    "your-hook": {
      "command": "echo 'Debug: ${tool_name} called' >&2 && your-command"
    }
  }
}
```

## 📈 Performance Optimization

### 1. Minimize Blocking Hooks

```json
{
  "hooks": {
    "async-processing": {
      "command": "nohup process-in-background ${file_path} &",
      "blocking": false
    }
  }
}
```

### 2. Cache Results

```json
{
  "hooks": {
    "cached-check": {
      "command": "[ -f .cache/${file_path}.result ] && cat .cache/${file_path}.result || (check-file ${file_path} | tee .cache/${file_path}.result)"
    }
  }
}
```

### 3. Batch Processing

```json
{
  "hooks": {
    "batch-processor": {
      "command": "echo ${file_path} >> .batch-queue && [ $(wc -l < .batch-queue) -ge 10 ] && process-batch .batch-queue"
    }
  }
}
```

## 📚 Best Practices

1. **Keep Commands Simple**: Complex logic should be in scripts
2. **Use Non-blocking for Monitoring**: Don't block on logging/metrics
3. **Implement Timeouts**: Always set reasonable timeouts
4. **Handle Errors Gracefully**: Use || operators for fallbacks
5. **Document Hook Purpose**: Add comments in configuration
6. **Test Hooks Independently**: Verify commands work outside Claude Code
7. **Monitor Performance**: Track execution time and resource usage

## 🚀 Next Steps

1. Review current workflow for automation opportunities
2. Implement basic hooks for quality control
3. Add security checks to pre-commit hooks
4. Create custom hooks for project-specific needs
5. Monitor and optimize hook performance

Use hooks to transform your Claude Code workflow into an automated, quality-assured development pipeline.