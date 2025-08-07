# Hook Behavior Guide - CLAUDE.md Auto-loading Specifications

**Date Created:** 2025-08-07  
**Version:** 1.0  
**Author:** Claude Code Investigation

## Executive Summary

This document explains the behavior of CLAUDE.md file auto-loading in Claude Code and how it interacts with hook events. The key finding is that only the initial session startup reads of CLAUDE.md files from parent directories bypass hook events.

## CLAUDE.md Loading Patterns

### 1. Internal Processing (No Hook Events) 🔒

These reads are performed internally by Claude Code and **DO NOT trigger PreToolUse hooks**:

#### Session Startup Auto-loading
When a new Claude Code session starts, it automatically reads CLAUDE.md files recursively from the current working directory up to (but not including) the root directory:

```
Example for cwd: /Users/akuzawatooru/dev3/article-agent/

Automatically loaded (no hooks):
✅ /Users/akuzawatooru/dev3/article-agent/CLAUDE.md
✅ /Users/akuzawatooru/dev3/CLAUDE.md (if exists)
✅ /Users/akuzawatooru/CLAUDE.md (if exists)
✅ /Users/CLAUDE.md (if exists)

Also loads CLAUDE.local.md files in the same pattern
```

#### Other Internal Reads
- `.claude/settings.json` - Project settings
- `.claude/settings.local.json` - Local settings including hook definitions
- IDE integration files (e.g., VS Code extension)

### 2. Standard Tool Usage (Triggers Hooks) ✅

These reads use the standard Read tool and **DO trigger PreToolUse hooks**:

#### Subdirectory CLAUDE.md Discovery
When Claude reads files in subdirectories and discovers CLAUDE.md files:

```
Example:
📁 /articles/claude.md - Hook triggers when read
📁 /internal/CLAUDE.md - Hook triggers when read
📁 /any/subdirectory/CLAUDE.md - Hook triggers when read
```

#### Explicit Read Requests
Any explicit Read tool usage by Claude or user requests:
- User asks to read CLAUDE.md
- Claude reads any file using the Read tool
- File discovery during navigation

## Verification Evidence

### Test Results (2025-08-07)

1. **Initial session CLAUDE.md read**
   - File: `/Users/akuzawatooru/dev3/article-agent/CLAUDE.md`
   - Hook triggered: ❌ No (internal processing)
   - Log entry: None in read-log.txt initially

2. **Subdirectory CLAUDE.md read**
   - File: `/articles/claude.md`
   - Hook triggered: ✅ Yes
   - Log entry: `[2025-08-07 10:02:08] Read: /articles/claude.md (9,396 bytes)`

## Hook Configuration Reference

Current hook configuration in `.claude/settings.local.json`:

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

## Implications for Monitoring

### What Can Be Monitored
- All user-initiated file reads
- All Claude's explicit Read tool usage during sessions
- Subdirectory CLAUDE.md discoveries
- Web fetches and searches
- File searches with Grep/Glob

### What Cannot Be Monitored
- Initial session CLAUDE.md loading from parent directories
- Internal settings file reads
- IDE integration file access

## Best Practices

1. **For Security Monitoring**
   - Focus on monitoring explicit Read tool usage
   - Accept that initial CLAUDE.md loading is unmonitored
   - Consider the root CLAUDE.md as "trusted" configuration

2. **For Usage Tracking**
   - Understand that byte counts will miss initial CLAUDE.md reads
   - Session logs will be incomplete for startup operations
   - Consider alternative tracking for critical operations

3. **For Hook Development**
   - Design hooks assuming they won't catch all reads
   - Don't rely on hooks for initial configuration validation
   - Test hooks with explicit Read operations

## Technical Notes

### Hook Data Structure
When hooks ARE triggered, they receive:

```json
{
  "session_id": "uuid",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/current/working/directory",
  "hook_event_name": "PreToolUse",
  "tool_name": "Read",
  "tool_input": {
    "file_path": "/path/to/file",
    "limit": 10  // optional
  }
}
```

### File Size Retrieval
The `read_monitor.py` script correctly retrieves file sizes using:
```python
os.path.getsize(file_path)
```

## Future Considerations

1. **Potential Claude Code Updates**
   - This behavior may change in future versions
   - Monitor Claude Code release notes for changes

2. **Hook Enhancement Ideas**
   - Request feature for session startup hooks
   - Consider post-session analysis of transcript files

3. **Documentation Updates**
   - Keep this guide updated with new findings
   - Document any version-specific differences

---

*This document was created through empirical testing and observation of Claude Code v1.0.70 behavior on 2025-08-07.*