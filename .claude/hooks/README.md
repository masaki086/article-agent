# Claude Code Hooks - Read Monitoring System

## Overview
This hook system monitors and logs all file reading and web access activities in Claude Code sessions.

## Features

### 1. File Read Monitoring (Read tool)
- Logs filename and file size in bytes
- Blocks sensitive files (.env, secrets, private keys)
- Warns for large files (>100KB)

### 2. Web Access Monitoring (WebFetch tool)
- Logs URL and prompt summary
- Can block specific domains
- Records session information

### 3. Search Query Tracking (WebSearch tool)
- Logs all search queries
- Warns about potentially sensitive searches
- Maintains audit trail

### 4. File Search Monitoring (Grep/Glob tools)
- Tracks search patterns and paths
- Useful for understanding what Claude is looking for

## Log Format

All activities are logged to `.claude/logs/read-log.txt` with the following format:

```
[YYYY-MM-DD HH:MM:SS] ToolName: Details [Session: session-id]
```

Examples:
```
[2025-01-07 10:30:45] Read: /src/index.js (2,456 bytes) [Session: abc123]
[2025-01-07 10:31:02] WebFetch: https://react.dev/learn (Prompt: Extract hooks info...) [Session: abc123]
[2025-01-07 10:31:15] WebSearch: "React useState best practices" [Session: abc123]
[2025-01-07 10:31:30] BLOCKED Read: .env (sensitive file)
```

## Configuration

The hook is configured in `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|WebFetch|WebSearch|Grep|Glob",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/read_monitor.py",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

## Security Features

### Blocked Sensitive Files
- `.env` files
- Files containing "secret", "private", "key", "pem", "token"

### Blocked Domains (customizable)
- Add domains to `blocked_domains` list in the script

### Sensitive Search Terms Detection
- Warns when searching for: password, api key, secret, credential, token

## Testing

Test the hook manually:
```bash
# Test Read monitoring
echo '{"tool_name":"Read","file_path":"test.py","session_id":"test123"}' | python3 .claude/hooks/read_monitor.py

# Test WebFetch monitoring
echo '{"tool_name":"WebFetch","url":"https://example.com","prompt":"test","session_id":"test123"}' | python3 .claude/hooks/read_monitor.py

# Test sensitive file blocking
echo '{"tool_name":"Read","file_path":".env","session_id":"test123"}' | python3 .claude/hooks/read_monitor.py
```

## View Logs

```bash
# View recent activity
tail -f .claude/logs/read-log.txt

# Count reads by file type
grep "Read:" .claude/logs/read-log.txt | wc -l

# Find large file reads
grep "Read:" .claude/logs/read-log.txt | grep -E "[0-9]{6,} bytes"
```

## Customization

Edit `.claude/hooks/read_monitor.py` to:
- Add more sensitive file patterns
- Change file size warning threshold
- Add domain allowlist/blocklist
- Customize log format
- Add external integrations (Slack, email, etc.)