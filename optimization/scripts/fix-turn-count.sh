#!/bin/bash

# Fix Turn Count Script - ターン数を修正
# Purpose: 実際の会話数に基づいてターン数を調整

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
TURN_FILE="$CONTEXT_DIR/.turn_count"

# 引数処理
ACTION="${1:-show}"
VALUE="${2:-}"

case "$ACTION" in
    set)
        # 手動で設定
        if [ -n "$VALUE" ]; then
            echo "$VALUE" > "$TURN_FILE"
            echo "✅ ターン数を $VALUE に設定しました"
            bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-js.sh"
        else
            echo "使用方法: $0 set <number>"
        fi
        ;;
    
    increment)
        # 1増加
        CURRENT=$(cat "$TURN_FILE" 2>/dev/null || echo 0)
        NEW=$((CURRENT + 1))
        echo "$NEW" > "$TURN_FILE"
        echo "✅ ターン数: $CURRENT → $NEW"
        bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-js.sh"
        ;;
    
    show)
        # 現在の値を表示
        CURRENT=$(cat "$TURN_FILE" 2>/dev/null || echo 0)
        echo "📊 現在のターン数: $CURRENT"
        ;;
    
    estimate)
        # セッション開始からの経過時間で推定
        if [ -f "$CONTEXT_DIR/.session_start_time" ]; then
            START_TIME=$(cat "$CONTEXT_DIR/.session_start_time")
            echo "セッション開始: $START_TIME"
        fi
        
        # 実際の会話数を推定（この会話で約15ターン目と推定）
        echo "推定ターン数: 約15ターン（手動で設定してください）"
        echo "使用方法: $0 set 15"
        ;;
    
    *)
        echo "使用方法: $0 [show|set|increment|estimate] [value]"
        ;;
esac