#!/bin/bash

# Track User Input Script - ユーザー入力の追跡
# UserPromptSubmitフックで実行される
# 利用可能な環境変数: prompt, session_id, transcript_path, cwd

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
LOG_DIR="$PROJECT_ROOT/optimization/logs"

# ディレクトリ作成
mkdir -p "$CONTEXT_DIR" "$LOG_DIR"

# タイムスタンプ
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
TIMESTAMP_SHORT=$(date "+%H:%M:%S")

# ユーザー入力の文字数とトークン推定
if [ -n "$prompt" ]; then
    # 文字数カウント
    CHAR_COUNT=$(echo -n "$prompt" | wc -c | tr -d ' ')
    
    # トークン推定（文字数÷3）
    ESTIMATED_TOKENS=$((CHAR_COUNT / 3))
    
    # ユーザー入力ログに記録
    echo "${TIMESTAMP}|USER|${CHAR_COUNT}|${ESTIMATED_TOKENS}|$(echo "$prompt" | head -c 100)..." >> "$LOG_DIR/user-inputs.log"
    
    # 累積文字数とトークン数を更新
    if [ -f "$CONTEXT_DIR/.user_input_stats" ]; then
        source "$CONTEXT_DIR/.user_input_stats"
        TOTAL_USER_CHARS=$((TOTAL_USER_CHARS + CHAR_COUNT))
        TOTAL_USER_TOKENS=$((TOTAL_USER_TOKENS + ESTIMATED_TOKENS))
    else
        TOTAL_USER_CHARS=$CHAR_COUNT
        TOTAL_USER_TOKENS=$ESTIMATED_TOKENS
    fi
    
    # 統計を保存
    cat > "$CONTEXT_DIR/.user_input_stats" << EOF
TOTAL_USER_CHARS=$TOTAL_USER_CHARS
TOTAL_USER_TOKENS=$TOTAL_USER_TOKENS
LAST_INPUT_CHARS=$CHAR_COUNT
LAST_INPUT_TOKENS=$ESTIMATED_TOKENS
LAST_INPUT_TIME="$TIMESTAMP"
EOF
    
    # ターン数をインクリメント
    TURN_COUNT=1
    if [ -f "$CONTEXT_DIR/.turn_count" ]; then
        CURRENT_TURNS=$(cat "$CONTEXT_DIR/.turn_count" 2>/dev/null || echo 0)
        TURN_COUNT=$((CURRENT_TURNS + 1))
    fi
    echo "$TURN_COUNT" > "$CONTEXT_DIR/.turn_count"
    
    # セッションログに記録
    echo "${TIMESTAMP_SHORT}|PROMPT|chars:${CHAR_COUNT}|tokens:${ESTIMATED_TOKENS}|turn:${TURN_COUNT}" >> "$CONTEXT_DIR/.session.log"
    
    # 会話ログに記録（calculate-tokens.shで使用）
    echo "[$TIMESTAMP] USER: $prompt" >> "$CONTEXT_DIR/.conversation.log"
    
    # デバッグ出力（開発時のみ）
    if [ "$DEBUG" = "1" ]; then
        echo "📝 User Input Tracked:"
        echo "  Characters: $CHAR_COUNT"
        echo "  Est. Tokens: $ESTIMATED_TOKENS"
        echo "  Turn: $TURN_COUNT"
        echo "  Total Chars: $TOTAL_USER_CHARS"
        echo "  Total Tokens: $TOTAL_USER_TOKENS"
    fi
else
    echo "${TIMESTAMP}|ERROR|No prompt data available" >> "$LOG_DIR/errors.log"
fi

# リアルタイムダッシュボード更新トリガー（別スクリプトで実装予定）
# bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-v2.sh" &