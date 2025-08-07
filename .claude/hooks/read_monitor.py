#!/usr/bin/env python3
"""
Read/WebFetch/WebSearch monitoring hook
Logs all file reads and web access with character counts
"""
import sys
import json
import os
from datetime import datetime
from pathlib import Path

def log_read_activity(log_entry):
    """Append log entry to read-log.txt"""
    log_dir = Path('.claude/logs')
    log_dir.mkdir(parents=True, exist_ok=True)
    
    log_file = log_dir / 'read-log.txt'
    
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(log_entry + '\n')

def get_file_size(file_path):
    """Get file size in bytes"""
    try:
        if os.path.exists(file_path):
            return os.path.getsize(file_path)
    except:
        pass
    return 0

def main():
    # Read input from stdin
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        sys.exit(0)
    
    # Debug: Log the entire input structure
    debug_log_file = Path('.claude/logs/debug-hook.txt')
    with open(debug_log_file, 'a', encoding='utf-8') as f:
        f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Input data: {json.dumps(input_data, indent=2)}\n\n")
    
    tool_name = input_data.get('tool_name', '')
    session_id = input_data.get('session_id', 'unknown')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Handle Read tool
    if tool_name == "Read":
        # Get parameters from tool_input
        tool_input = input_data.get('tool_input', {})
        file_path = tool_input.get('file_path', '')
        
        # Check for sensitive files
        sensitive_patterns = ['.env', 'secrets', 'private', '.key', '.pem', 'token']
        if any(pattern in file_path.lower() for pattern in sensitive_patterns):
            log_entry = f"[{timestamp}] BLOCKED Read: {file_path} (sensitive file)"
            log_read_activity(log_entry)
            
            output = {
                "decision": "deny",
                "reason": f"Cannot read sensitive file: {file_path}"
            }
            print(json.dumps(output))
            sys.exit(2)
        
        # Get file size
        file_size = get_file_size(file_path)
        
        # Log successful read
        log_entry = f"[{timestamp}] Read: {file_path} ({file_size:,} bytes) [Session: {session_id}]"
        log_read_activity(log_entry)
        
        # Optional: Print info to Claude
        if file_size > 100000:  # Files larger than 100KB
            print(f"Note: Reading large file ({file_size:,} bytes)")
    
    # Handle WebFetch tool
    elif tool_name == "WebFetch":
        tool_input = input_data.get('tool_input', {})
        url = tool_input.get('url', '')
        prompt = tool_input.get('prompt', '')[:100]  # First 100 chars of prompt
        
        # Log web fetch
        log_entry = f"[{timestamp}] WebFetch: {url} (Prompt: {prompt}...) [Session: {session_id}]"
        log_read_activity(log_entry)
        
        # Optional: Domain restrictions
        blocked_domains = ['example-blocked.com', 'internal.company.com']
        if any(domain in url for domain in blocked_domains):
            log_entry = f"[{timestamp}] BLOCKED WebFetch: {url} (restricted domain)"
            log_read_activity(log_entry)
            
            output = {
                "decision": "deny",
                "reason": f"Domain not allowed: {url}"
            }
            print(json.dumps(output))
            sys.exit(2)
    
    # Handle WebSearch tool
    elif tool_name == "WebSearch":
        tool_input = input_data.get('tool_input', {})
        query = tool_input.get('query', '')
        
        # Log search query
        log_entry = f"[{timestamp}] WebSearch: \"{query}\" [Session: {session_id}]"
        log_read_activity(log_entry)
        
        # Check for sensitive search terms
        sensitive_terms = ['password', 'api key', 'secret', 'credential', 'token']
        if any(term in query.lower() for term in sensitive_terms):
            warning = f"[{timestamp}] WARNING: Potentially sensitive search: \"{query}\""
            log_read_activity(warning)
            print(f"Warning: Searching for potentially sensitive information: {query}")
    
    # Handle other tools that might read data
    elif tool_name in ["Grep", "Glob"]:
        tool_input = input_data.get('tool_input', {})
        pattern = tool_input.get('pattern', '')
        path = tool_input.get('path', '.')
        
        log_entry = f"[{timestamp}] {tool_name}: Pattern=\"{pattern}\" Path={path} [Session: {session_id}]"
        log_read_activity(log_entry)
    
    # Always allow (unless explicitly denied above)
    sys.exit(0)

if __name__ == "__main__":
    main()