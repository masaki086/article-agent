#!/usr/bin/env python3
"""
Session management hook for Claude Code
Handles session start/end log rotation
"""
import sys
import json
import os
import shutil
from datetime import datetime
from pathlib import Path

def backup_logs():
    """Create backup of current log files with timestamp"""
    log_dir = Path('.claude/logs')
    backup_dir = log_dir / 'backups'
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Files to backup
    log_files = [
        ('read-log.txt', f'read-log_{timestamp}.txt'),
        ('conversation-log.txt', f'conversation-log_{timestamp}.txt'),
        ('debug-hook.txt', f'debug-hook_{timestamp}.txt')
    ]
    
    backed_up = []
    for source_file, backup_name in log_files:
        source_path = log_dir / source_file
        if source_path.exists() and source_path.stat().st_size > 0:
            backup_path = backup_dir / backup_name
            shutil.copy2(source_path, backup_path)
            backed_up.append(backup_name)
    
    return backed_up

def clear_logs():
    """Clear the main log files (create empty files)"""
    log_dir = Path('.claude/logs')
    log_dir.mkdir(parents=True, exist_ok=True)
    
    # Files to clear
    log_files = ['read-log.txt', 'conversation-log.txt', 'debug-hook.txt']
    
    for log_file in log_files:
        log_path = log_dir / log_file
        # Create empty file or truncate existing
        open(log_path, 'w').close()

def main():
    # Read input from stdin
    try:
        stdin_input = sys.stdin.read()
        if stdin_input:
            input_data = json.loads(stdin_input)
        else:
            # If no input, treat as session end command
            input_data = {'message': {'content': '/exit'}}
    except json.JSONDecodeError:
        # If JSON decode fails, still try to process as exit
        input_data = {'message': {'content': '/exit'}}
    
    # Get the user message
    message = input_data.get('message', {})
    content = message.get('content', '').lower() if isinstance(message, dict) else str(message).lower()
    
    # Check for session end commands
    session_end_triggers = ['/clear', '/exit', 'exit', 'clear', '/quit', 'quit', '/bye', 'bye']
    
    # Check for session start (first message of session)
    is_session_start = input_data.get('is_first_message', False)
    
    # Handle session end - always backup when hook is triggered
    # Since the hook matcher already filtered for these commands
    if any(trigger in content for trigger in session_end_triggers) or not stdin_input:
        backed_up = backup_logs()
        if backed_up:
            print(f"📦 Session logs backed up: {', '.join(backed_up)}")
            clear_logs()
            print("🧹 Log files cleared for next session")
    
    # Handle session start
    elif is_session_start:
        # Check if logs have content (might be from previous session)
        log_dir = Path('.claude/logs')
        if log_dir.exists():
            read_log = log_dir / 'read-log.txt'
            if read_log.exists() and read_log.stat().st_size > 100:  # More than 100 bytes suggests real content
                backed_up = backup_logs()
                if backed_up:
                    print(f"📦 Previous session logs backed up: {', '.join(backed_up)}")
        
        # Ensure clean log files for new session
        clear_logs()
        print("📝 Fresh log files created for new session")
    
    # Always allow the command to proceed
    sys.exit(0)

if __name__ == "__main__":
    main()