#!/bin/bash
# Log backup script for session start - backs up previous session logs

LOG_DIR=".claude/logs"
BACKUP_DIR="$LOG_DIR/backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Get timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup previous session files if they have content
backed_up=false

if [ -s "$LOG_DIR/conversation-log.txt" ]; then
    cp "$LOG_DIR/conversation-log.txt" "$BACKUP_DIR/conversation-log_$TIMESTAMP.txt"
    echo "📦 Backed up previous session: conversation-log_$TIMESTAMP.txt"
    backed_up=true
fi

if [ -s "$LOG_DIR/read-log.txt" ]; then
    cp "$LOG_DIR/read-log.txt" "$BACKUP_DIR/read-log_$TIMESTAMP.txt"
    echo "📦 Backed up previous session: read-log_$TIMESTAMP.txt"
    backed_up=true
fi

if [ -s "$LOG_DIR/debug-hook.txt" ]; then
    cp "$LOG_DIR/debug-hook.txt" "$BACKUP_DIR/debug-hook_$TIMESTAMP.txt"
    echo "📦 Backed up previous session: debug-hook_$TIMESTAMP.txt"
    backed_up=true
fi

# Clear the log files for new session
if [ "$backed_up" = true ]; then
    echo -n > "$LOG_DIR/conversation-log.txt"
    echo -n > "$LOG_DIR/read-log.txt"
    echo -n > "$LOG_DIR/debug-hook.txt"
    echo "🧹 Log files cleared for new session"
else
    echo "📝 Starting new session (no previous logs to backup)"
fi