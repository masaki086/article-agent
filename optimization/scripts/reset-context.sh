#!/bin/bash

# Reset Context Script - コンテキストリセット処理
# SessionStartフックで source="clear" の時に実行される
# /reset または /clear コマンド実行時

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
LOG_DIR="$PROJECT_ROOT/optimization/logs"

# タイムスタンプ
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# sourceパラメータをチェック（clear, startup, resume）
SOURCE="${source:-unknown}"

echo "🔄 Session Reset Triggered (source: $SOURCE)" >&2

if [ "$SOURCE" = "clear" ]; then
    echo "📝 Clearing context and resetting counters..." >&2
    
    # ターン数をリセット
    echo "0" > "$CONTEXT_DIR/.turn_count"
    echo "  ✓ Turn count reset to 0" >&2
    
    # ユーザー入力統計をリセット
    cat > "$CONTEXT_DIR/.user_input_stats" << EOF
TOTAL_USER_CHARS=0
TOTAL_USER_TOKENS=0
LAST_INPUT_CHARS=0
LAST_INPUT_TOKENS=0
LAST_INPUT_TIME="$TIMESTAMP"
RESET_TIME="$TIMESTAMP"
EOF
    echo "  ✓ User input stats reset" >&2
    
    # ファイルアクセスログをバックアップして新規作成
    if [ -f "$CONTEXT_DIR/.file_access.log" ]; then
        mv "$CONTEXT_DIR/.file_access.log" "$CONTEXT_DIR/.file_access.log.$(date +%Y%m%d-%H%M%S)"
        echo "  ✓ File access log backed up" >&2
    fi
    touch "$CONTEXT_DIR/.file_access.log"
    
    # セッションログをリセット
    echo "=== SESSION RESET AT $TIMESTAMP ===" > "$CONTEXT_DIR/.session.log"
    echo "  ✓ Session log reset" >&2
    
    # トークン使用量をリセット
    cat > "$CONTEXT_DIR/.token_usage" << EOF
SYSTEM_TOKENS=0
CONVERSATION_TOKENS=0
FILE_TOKENS=0
WORKING_TOKENS=0
TOTAL_TOKENS=0
TIMESTAMP=$TIMESTAMP
EOF
    echo "  ✓ Token usage reset" >&2
    
    # 累積トークン使用量もリセット
    echo "0" > "$CONTEXT_DIR/.total_tokens_used"
    
    # 現在のタスクとゴールもクリア
    echo "新規セッション" > "$CONTEXT_DIR/.current_task"
    echo "未設定" > "$CONTEXT_DIR/.next_goal"
    
    # リセットログに記録
    echo "$TIMESTAMP|RESET|source:$SOURCE" >> "$LOG_DIR/reset-history.log"
    
    echo "✅ Context successfully reset!" >&2
    
elif [ "$SOURCE" = "startup" ]; then
    echo "🚀 New session started" >&2
    # 新規起動時の処理（必要に応じて追加）
    
elif [ "$SOURCE" = "resume" ]; then
    echo "⏯️  Session resumed" >&2
    # セッション再開時の処理（カウンターは維持）
    
else
    echo "⚠️  Unknown source: $SOURCE" >&2
fi

# ダッシュボード更新（必要に応じて）
# bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-v2.sh" &