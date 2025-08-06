#!/bin/bash

# Track Token Usage Script - トークン使用量追跡
# Purpose: 実際のAPI使用量を追跡し、累積使用量を記録

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
USAGE_FILE="$CONTEXT_DIR/.total_tokens_used"
TURN_FILE="$CONTEXT_DIR/.turn_count"

# 引数処理
ACTION="${1:-increment}"
AMOUNT="${2:-5000}"  # デフォルト: 1ターンあたり5000トークン

case "$ACTION" in
    increment)
        # ターンごとにトークン使用量を増加
        CURRENT_USAGE=0
        if [ -f "$USAGE_FILE" ]; then
            CURRENT_USAGE=$(cat "$USAGE_FILE")
        fi
        NEW_USAGE=$((CURRENT_USAGE + AMOUNT))
        echo "$NEW_USAGE" > "$USAGE_FILE"
        echo "✅ トークン使用量更新: ${CURRENT_USAGE} → ${NEW_USAGE} (+${AMOUNT})" >&2
        ;;
        
    reset)
        # セッションリセット時に使用量をクリア
        echo "0" > "$USAGE_FILE"
        echo "✅ トークン使用量リセット: 0" >&2
        ;;
        
    show)
        # 現在の使用量を表示
        if [ -f "$USAGE_FILE" ]; then
            USAGE=$(cat "$USAGE_FILE")
            echo "📊 現在のトークン使用量: ${USAGE} tokens" >&2
            
            # 予算に対する使用率
            BUDGET=1000000  # 100万トークン
            PERCENT=$((USAGE * 100 / BUDGET))
            echo "💰 予算使用率: ${PERCENT}% (${USAGE}/${BUDGET})" >&2
            
            # 残量警告
            if [ $PERCENT -gt 80 ]; then
                echo "⚠️ 警告: 予算の80%以上を使用しています" >&2
            elif [ $PERCENT -gt 50 ]; then
                echo "📌 注意: 予算の50%以上を使用しています" >&2
            fi
        else
            echo "📊 トークン使用量: 0 tokens (未計測)" >&2
        fi
        ;;
        
    estimate)
        # ターン数から推定使用量を計算
        if [ -f "$TURN_FILE" ]; then
            TURNS=$(cat "$TURN_FILE")
            ESTIMATED=$((TURNS * 5000))
            echo "$ESTIMATED" > "$USAGE_FILE"
            echo "📊 推定トークン使用量: ${ESTIMATED} tokens (${TURNS}ターン × 5000)" >&2
        fi
        ;;
        
    *)
        echo "使用方法: $0 [increment|reset|show|estimate] [amount]" >&2
        echo "  increment [amount] - 指定量だけ使用量を増加（デフォルト: 5000）" >&2
        echo "  reset             - 使用量をリセット" >&2
        echo "  show              - 現在の使用量を表示" >&2
        echo "  estimate          - ターン数から使用量を推定" >&2
        exit 1
        ;;
esac