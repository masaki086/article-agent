# Claude Code Hooks Comprehensive Guide

## Overview

Claude Code Hooksは、Claude Codeのライフサイクルの特定のポイントで自動的に実行されるユーザー定義のシェルコマンドです。これにより、カスタムロジック、スクリプト、コマンドをClaudeの操作に直接注入できます。

## Hook Events (8 Types)

### 1. PreToolUse
**トリガー**: ツール実行前（Read, WebFetch, WebSearch含む）
**対象ツール**: Bash, Edit, Write, Read, MultiEdit, Task, Glob, Grep, WebFetch, WebSearch
**用途**: ツール使用の検証、危険なコマンドのブロック、権限チェック、情報取得の制御

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/validate_bash.sh"
      }]
    }]
  }
}
```

**Sample Script (validate_bash.sh)**:
```bash
#!/bin/bash
# Read JSON input from stdin
input=$(cat)
command=$(echo "$input" | jq -r '.command')

# Block dangerous commands
if [[ "$command" =~ rm.*-rf|sudo.*rm|chmod.*777 ]]; then
    echo '{"decision": "deny", "reason": "Dangerous command blocked"}' 
    exit 2
fi

echo '{"decision": "allow"}'
exit 0
```

**Python Implementation**:
```python
#!/usr/bin/env python3
import sys
import json
import re

input_data = json.loads(sys.stdin.read())
tool_name = input_data.get('tool_name')
command = input_data.get('command', '')

dangerous_patterns = [
    r'rm\s+.*-[rf]',      # rm -rf variants
    r'sudo\s+rm',         # sudo rm commands
    r'chmod\s+777',       # Dangerous permissions
    r'>\s*/etc/',         # Writing to system directories
    r'dd\s+if=/dev/zero', # Disk wipe commands
]

if tool_name == "Bash":
    for pattern in dangerous_patterns:
        if re.search(pattern, command, re.IGNORECASE):
            output = {
                "decision": "deny",
                "reason": f"Blocked dangerous pattern: {pattern}"
            }
            print(json.dumps(output))
            sys.exit(2)

# Allow the command
print('{"decision": "allow"}')
sys.exit(0)
```

**Read/WebFetch/WebSearch Hook Example**:
```python
#!/usr/bin/env python3
import sys
import json

input_data = json.loads(sys.stdin.read())
tool_name = input_data.get('tool_name')

# Monitor file reading
if tool_name == "Read":
    file_path = input_data.get('file_path', '')
    
    # Block sensitive files
    sensitive_patterns = ['.env', 'secrets', 'private', '.key', '.pem']
    if any(pattern in file_path for pattern in sensitive_patterns):
        output = {
            "decision": "deny",
            "reason": f"Cannot read sensitive file: {file_path}"
        }
        print(json.dumps(output))
        sys.exit(2)

# Control web access
elif tool_name == "WebFetch":
    url = input_data.get('url', '')
    
    # Whitelist allowed domains
    allowed_domains = ['react.dev', 'docs.python.org', 'developer.mozilla.org']
    if not any(domain in url for domain in allowed_domains):
        output = {
            "decision": "deny", 
            "reason": f"Domain not in whitelist: {url}"
        }
        print(json.dumps(output))
        sys.exit(2)

# Monitor search queries
elif tool_name == "WebSearch":
    query = input_data.get('query', '')
    
    # Log all searches for audit
    with open('.claude/logs/searches.log', 'a') as f:
        f.write(f"{input_data.get('session_id')}: {query}\n")
    
    # Check for sensitive terms
    if any(term in query.lower() for term in ['password', 'secret', 'key']):
        print("Warning: Searching for potentially sensitive information")

sys.exit(0)
```

### 2. PostToolUse
**トリガー**: ツール実行後
**用途**: 自動フォーマット、ログ記録、結果検証

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/auto_format.py"
      }]
    }]
  }
}
```

**Auto-formatting Script**:
```python
#!/usr/bin/env python3
import sys
import json
import subprocess
import os

input_data = json.loads(sys.stdin.read())
tool_name = input_data.get('tool_name')
file_paths = os.environ.get('CLAUDE_FILE_PATHS', '').split()

# Auto-format Python files
for file_path in file_paths:
    if file_path.endswith('.py'):
        # Run formatters
        subprocess.run(['ruff', 'check', '--fix', file_path])
        subprocess.run(['black', file_path])
        print(f"Formatted: {file_path}")
    
    elif file_path.endswith(('.ts', '.tsx', '.js', '.jsx')):
        # Format TypeScript/JavaScript
        subprocess.run(['prettier', '--write', file_path])
        print(f"Formatted: {file_path}")

sys.exit(0)
```

### 3. UserPromptSubmit
**トリガー**: ユーザープロンプト送信時
**用途**: プロンプト検証、コンテキスト注入、ログ記録

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/prompt_enhancer.py"
      }]
    }]
  }
}
```

**Context Injection Script**:
```python
#!/usr/bin/env python3
import sys
import json
import subprocess
from datetime import datetime

input_data = json.loads(sys.stdin.read())
user_prompt = input_data.get('user_prompt', '')
session_id = input_data.get('session_id')

# Get git status for context
git_status = subprocess.run(
    ['git', 'status', '--short'], 
    capture_output=True, 
    text=True
).stdout

# Get recent commits
git_log = subprocess.run(
    ['git', 'log', '--oneline', '-5'], 
    capture_output=True, 
    text=True
).stdout

# Inject context
print(f"Session: {session_id}")
print(f"Time: {datetime.now().isoformat()}")
print(f"\nCurrent Git Status:\n{git_status}")
print(f"\nRecent Commits:\n{git_log}")
print("\nRemember to run tests after changes!")

sys.exit(0)
```

### 4. Stop
**トリガー**: メインエージェント終了時
**用途**: セッション完了の検証、自動コミット、通知

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/session_complete.py"
      }]
    }]
  }
}
```

**Session Completion Handler**:
```python
#!/usr/bin/env python3
import sys
import json
import subprocess
import os

input_data = json.loads(sys.stdin.read())
session_id = input_data.get('session_id')
transcript_path = input_data.get('transcript_path')

# Check if tests are passing
test_result = subprocess.run(
    ['npm', 'test'], 
    capture_output=True
)

if test_result.returncode != 0:
    # Block completion if tests fail
    output = {
        "decision": "block",
        "reason": "Tests are failing. Please fix before completing."
    }
    print(json.dumps(output))
    sys.exit(2)

# Auto-commit changes
modified_files = subprocess.run(
    ['git', 'diff', '--name-only'],
    capture_output=True,
    text=True
).stdout.strip()

if modified_files:
    subprocess.run(['git', 'add', '.'])
    subprocess.run([
        'git', 'commit', '-m', 
        f'Claude session {session_id}: Auto-commit'
    ])
    print(f"Changes committed for session {session_id}")

sys.exit(0)
```

### 5. SubagentStop
**トリガー**: サブエージェント終了時
**用途**: サブタスク完了の検証、結果集約

```json
{
  "hooks": {
    "SubagentStop": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/subagent_handler.py"
      }]
    }]
  }
}
```

**Subagent Handler**:
```python
#!/usr/bin/env python3
import sys
import json

input_data = json.loads(sys.stdin.read())
session_id = input_data.get('session_id')
subagent_type = input_data.get('subagent_type', 'unknown')

# Log subagent completion
with open('.claude/logs/subagents.log', 'a') as f:
    f.write(f"{session_id},{subagent_type},completed\n")

# Check if task should continue
if subagent_type == "test-runner" and not tests_passed():
    output = {
        "decision": "block",
        "reason": "Tests failed, requiring manual intervention"
    }
    print(json.dumps(output))
    sys.exit(2)

sys.exit(0)
```

### 6. SessionStart
**トリガー**: セッション開始時
**用途**: 初期設定、コンテキストロード、環境準備

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/session_init.py"
      }]
    }]
  }
}
```

**Session Initialization**:
```python
#!/usr/bin/env python3
import sys
import json
import subprocess
import os

input_data = json.loads(sys.stdin.read())
session_id = input_data.get('session_id')
source = input_data.get('source', 'interactive')

# Load project context
if os.path.exists('.claude/context.md'):
    with open('.claude/context.md', 'r') as f:
        print(f"Project Context:\n{f.read()}")

# Check dependencies
print("\nChecking environment...")
subprocess.run(['npm', 'install'])
subprocess.run(['pip', 'install', '-r', 'requirements.txt'])

# Display project info
print(f"\nSession {session_id} initialized")
print(f"Source: {source}")
print("Ready for development!")

sys.exit(0)
```

### 7. PreCompact
**トリガー**: コンテキスト圧縮前
**用途**: 重要情報の保存、コンテキスト最適化

```json
{
  "hooks": {
    "PreCompact": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/context_optimizer.py"
      }]
    }]
  }
}
```

**Context Optimization**:
```python
#!/usr/bin/env python3
import sys
import json
import os
from pathlib import Path

input_data = json.loads(sys.stdin.read())
session_id = input_data.get('session_id')
transcript_path = input_data.get('transcript_path')

# Save important context before compaction
important_files = [
    'requirements.txt',
    'package.json',
    '.env.example',
    'README.md'
]

context_dir = Path(f'.claude/sessions/{session_id}')
context_dir.mkdir(parents=True, exist_ok=True)

for file in important_files:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
            (context_dir / file).write_text(content)

print(f"Context saved for session {session_id}")
print("Proceeding with compaction...")

sys.exit(0)
```

### 8. Notification
**トリガー**: システム通知時
**用途**: カスタム通知、外部システム連携

```json
{
  "hooks": {
    "Notification": [{
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/notifier.py"
      }]
    }]
  }
}
```

**Custom Notifier**:
```python
#!/usr/bin/env python3
import sys
import json
import os
import subprocess

input_data = json.loads(sys.stdin.read())
notification = os.environ.get('CLAUDE_NOTIFICATION', '')
session_id = input_data.get('session_id')

# Send desktop notification (macOS)
if 'task completed' in notification.lower():
    subprocess.run([
        'osascript', '-e',
        f'display notification "{notification}" with title "Claude Code"'
    ])

# Log notification
with open('.claude/logs/notifications.log', 'a') as f:
    f.write(f"{session_id}: {notification}\n")

sys.exit(0)
```

## Environment Variables

All hooks receive these environment variables:

- `CLAUDE_PROJECT_DIR`: Project root directory
- `CLAUDE_FILE_PATHS`: Space-separated list of affected files
- `CLAUDE_TOOL_NAME`: Name of the tool being used
- `CLAUDE_TOOL_OUTPUT`: Output from tool execution (PostToolUse only)
- `CLAUDE_NOTIFICATION`: Notification message (Notification hook only)

## Advanced Configuration Examples

### 1. Multi-Hook Configuration
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/bash_validator.py"
          },
          {
            "type": "command",
            "command": ".claude/hooks/command_logger.py"
          }
        ]
      },
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/file_validator.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": ".*\\.py$",
        "hooks": [
          {
            "type": "command",
            "command": "ruff check --fix $CLAUDE_FILE_PATHS && black $CLAUDE_FILE_PATHS",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 2. Observability System
```python
#!/usr/bin/env python3
"""
Complete observability system for Claude Code
Tracks all events and sends to monitoring server
"""
import sys
import json
import requests
from datetime import datetime

OBSERVABILITY_SERVER = "http://localhost:8080"

def send_event(event_data):
    """Send event to observability server"""
    try:
        response = requests.post(
            f"{OBSERVABILITY_SERVER}/events",
            json=event_data,
            timeout=5
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Failed to send event: {e}", file=sys.stderr)
        return False

input_data = json.loads(sys.stdin.read())
event_name = input_data.get('hook_event_name')
session_id = input_data.get('session_id')

# Enrich event data
event_data = {
    "timestamp": datetime.now().isoformat(),
    "session_id": session_id,
    "event_type": event_name,
    "data": input_data
}

# Send to monitoring
if send_event(event_data):
    print(f"Event {event_name} tracked successfully")
else:
    print(f"Warning: Failed to track event {event_name}")

sys.exit(0)
```

### 3. TDD Enforcement System
```python
#!/usr/bin/env python3
"""
TDD Guard - Ensures tests are written before implementation
"""
import sys
import json
import os
import re

input_data = json.loads(sys.stdin.read())
tool_name = input_data.get('tool_name')
file_paths = os.environ.get('CLAUDE_FILE_PATHS', '').split()

if tool_name in ['Edit', 'Write']:
    for file_path in file_paths:
        # Check if editing implementation file
        if not file_path.endswith(('_test.py', '.test.js', '.spec.ts')):
            # Look for corresponding test file
            test_patterns = [
                file_path.replace('.py', '_test.py'),
                file_path.replace('.js', '.test.js'),
                file_path.replace('.ts', '.spec.ts')
            ]
            
            test_exists = any(os.path.exists(test) for test in test_patterns)
            
            if not test_exists:
                output = {
                    "decision": "deny",
                    "reason": f"TDD violation: No test file found for {file_path}. Write tests first!"
                }
                print(json.dumps(output))
                sys.exit(2)

sys.exit(0)
```

## Best Practices

### 1. Security
- Always validate and sanitize inputs
- Use absolute paths
- Quote shell variables: `"$VAR"` not `$VAR`
- Block path traversal (check for `..`)
- Skip sensitive files (.env, .git)

### 2. Performance
- Set appropriate timeouts (default: 60s, max: 600s)
- Use parallel execution for independent hooks
- Cache expensive operations
- Minimize external API calls

### 3. Error Handling
```python
try:
    # Your hook logic
    result = process_hook()
    sys.exit(0)
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)  # Non-blocking error
```

### 4. Logging
```python
import logging

logging.basicConfig(
    filename='.claude/logs/hooks.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
logger.info(f"Processing {event_name} for session {session_id}")
```

## Real-World Use Cases

### 1. Automatic Git Workflow
```bash
# PreToolUse: Create feature branch
git checkout -b claude-session-$CLAUDE_SESSION_ID

# PostToolUse: Stage changes
git add $CLAUDE_FILE_PATHS

# Stop: Commit and create PR
git commit -m "Session complete"
gh pr create --fill
```

### 2. Quality Assurance Pipeline
```python
# Run on PostToolUse for code files
def quality_check():
    checks = [
        ('Linting', 'ruff check'),
        ('Type checking', 'mypy'),
        ('Tests', 'pytest'),
        ('Coverage', 'coverage run -m pytest')
    ]
    
    for name, command in checks:
        result = subprocess.run(command.split(), capture_output=True)
        if result.returncode != 0:
            return False, f"{name} failed"
    
    return True, "All checks passed"
```

### 3. Documentation Generation
```python
# PostToolUse hook for Python files
def update_docs(file_path):
    if file_path.endswith('.py'):
        # Generate docstrings
        subprocess.run(['pydocstyle', '--add-missing', file_path])
        
        # Update API documentation
        subprocess.run(['sphinx-apidoc', '-o', 'docs/', '.'])
        
        # Build documentation
        subprocess.run(['make', 'html'], cwd='docs/')
```

## Troubleshooting

### Common Issues

1. **Hook not executing**
   - Check file permissions: `chmod +x script.py`
   - Verify path in settings.json
   - Check JSON syntax

2. **Exit codes**
   - 0: Success (continue)
   - 1: Non-blocking error
   - 2: Blocking error (with decision)

3. **Debugging**
   ```bash
   # Add to your hook script
   echo "Debug: $CLAUDE_TOOL_NAME" >> /tmp/claude_debug.log
   echo "Input: $(cat)" >> /tmp/claude_debug.log
   ```

4. **Testing hooks locally**
   ```bash
   echo '{"session_id": "test", "tool_name": "Bash"}' | python3 .claude/hooks/my_hook.py
   ```

## Summary

Claude Code Hooksは開発ワークフローを自動化し、品質を向上させる強力なシステムです。8つのイベントタイプを活用することで、セキュリティ強化、自動フォーマット、テスト駆動開発、観測可能性など、様々な機能を実装できます。

適切に設定されたHooksは、チーム全体の開発効率を大幅に向上させ、一貫性のある高品質なコードベースの維持に貢献します。