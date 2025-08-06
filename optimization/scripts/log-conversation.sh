#!/bin/bash

# Log Conversation Script - 会話履歴をログに記録
# Purpose: ユーザーとAIの会話を記録してトークン計算の精度を向上

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
CONVERSATION_LOG="$CONTEXT_DIR/.conversation.log"

# 引数
TYPE="${1:-USER}"  # USER or AI
MESSAGE="${2:-}"

# タイムスタンプ
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# メッセージを記録
if [ -n "$MESSAGE" ]; then
    echo "[$TIMESTAMP] $TYPE: $MESSAGE" >> "$CONVERSATION_LOG"
    
    # デバッグ出力
    CHARS=${#MESSAGE}
    TOKENS=$((CHARS / 3))
    echo "📝 会話記録: $TYPE message ($TOKENS tokens)" >&2
fi

# ログファイルのサイズ管理（100KB以上で古いエントリを削除）
if [ -f "$CONVERSATION_LOG" ]; then
    SIZE=$(wc -c < "$CONVERSATION_LOG")
    if [ $SIZE -gt 100000 ]; then
        # 最新50%を保持
        LINES=$(wc -l < "$CONVERSATION_LOG")
        KEEP=$((LINES / 2))
        tail -n $KEEP "$CONVERSATION_LOG" > "${CONVERSATION_LOG}.tmp"
        mv "${CONVERSATION_LOG}.tmp" "$CONVERSATION_LOG"
        echo "⚠️ 会話ログをトリミング（サイズ: $SIZE bytes）" >&2
    fi
fi