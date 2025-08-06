#!/bin/bash

# Test script for conversation token calculation
# 会話トークン計算のテストスクリプト

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
CONVERSATION_LOG="$CONTEXT_DIR/.conversation.log"

echo "=== CONVERSATION_TOKENS テスト ==="
echo "プロジェクトルート: $PROJECT_ROOT"
echo "コンテキストディレクトリ: $CONTEXT_DIR"
echo ""

# ファイルの存在確認
echo "1. 会話ログファイルの確認:"
if [ -f "$CONVERSATION_LOG" ]; then
    echo "   ✅ ファイル存在: $CONVERSATION_LOG"
    echo "   サイズ: $(wc -c < "$CONVERSATION_LOG") bytes"
    echo "   行数: $(wc -l < "$CONVERSATION_LOG") lines"
    echo ""
    echo "   最初の5行:"
    head -5 "$CONVERSATION_LOG" | sed 's/^/   /'
else
    echo "   ❌ ファイルなし: $CONVERSATION_LOG"
fi
echo ""

# セッション開始位置の確認
echo "2. セッション開始マーカーの確認:"
if [ -f "$CONTEXT_DIR/.session_start" ]; then
    SESSION_START=$(cat "$CONTEXT_DIR/.session_start")
    echo "   ✅ セッション開始行: $SESSION_START"
else
    echo "   ❌ セッションマーカーなし"
    SESSION_START=1
fi
echo ""

# トークン計算のテスト
echo "3. トークン計算テスト:"
if [ -f "$CONVERSATION_LOG" ]; then
    # 全体のトークン
    TOTAL_CHARS=$(wc -c < "$CONVERSATION_LOG")
    TOTAL_TOKENS=$((TOTAL_CHARS / 3))
    echo "   全体: $TOTAL_CHARS chars → $TOTAL_TOKENS tokens"
    
    # セッション分のトークン
    SESSION_CHARS=$(tail -n +"$SESSION_START" "$CONVERSATION_LOG" 2>/dev/null | wc -c || echo 0)
    SESSION_TOKENS=$((SESSION_CHARS / 3))
    echo "   セッション分: $SESSION_CHARS chars → $SESSION_TOKENS tokens"
else
    echo "   計算不可（ログファイルなし）"
fi
echo ""

# 実際の関数を呼び出してテスト
echo "4. calculate-tokens.sh --conversation の結果:"
RESULT=$("$PROJECT_ROOT/optimization/scripts/calculate-tokens.sh" --conversation 2>&1)
echo "$RESULT" | sed 's/^/   /'