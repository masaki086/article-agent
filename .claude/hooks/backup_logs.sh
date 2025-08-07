#!/bin/bash
# Simple log backup script for session end

LOG_DIR=".claude/logs"
BACKUP_DIR="$LOG_DIR/backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Get timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup files if they have content
if [ -s "$LOG_DIR/conversation-log.txt" ]; then
    cp "$LOG_DIR/conversation-log.txt" "$BACKUP_DIR/conversation-log_$TIMESTAMP.txt"
    echo "📦 Backed up: conversation-log_$TIMESTAMP.txt"
fi

if [ -s "$LOG_DIR/read-log.txt" ]; then
    cp "$LOG_DIR/read-log.txt" "$BACKUP_DIR/read-log_$TIMESTAMP.txt"
    echo "📦 Backed up: read-log_$TIMESTAMP.txt"
fi

if [ -s "$LOG_DIR/debug-hook.txt" ]; then
    cp "$LOG_DIR/debug-hook.txt" "$BACKUP_DIR/debug-hook_$TIMESTAMP.txt"
    echo "📦 Backed up: debug-hook_$TIMESTAMP.txt"
fi

# Clear the log files
> "$LOG_DIR/conversation-log.txt"
> "$LOG_DIR/read-log.txt"
> "$LOG_DIR/debug-hook.txt"

echo "🧹 Log files cleared for next session"