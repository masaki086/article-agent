#!/bin/bash

# Check Limits Script - 精度限界チェック
# Purpose: 閾値チェック、警告表示、セッションリセット提案

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
LIMITS_DIR="$PROJECT_ROOT/optimization/limits"
TURN_FILE="$CONTEXT_DIR/.turn_count"
FILE_COUNT_FILE="$CONTEXT_DIR/.file_count"
SESSION_FILE="$CONTEXT_DIR/current-session.md"

# 現在の値を読み込み
TURN_COUNT=0
if [ -f "$TURN_FILE" ]; then
    TURN_COUNT=$(cat "$TURN_FILE")
fi

FILE_COUNT=0
if [ -f "$FILE_COUNT_FILE" ]; then
    FILE_COUNT=$(cat "$FILE_COUNT_FILE")
fi

# 閾値定義
MAX_TURNS=20
WARNING_TURNS=15
CAUTION_TURNS=10

MAX_FILES=10
WARNING_FILES=8
CAUTION_FILES=5

# チェック結果
EXIT_CODE=0
MESSAGES=()

# ターン数チェック
if [ $TURN_COUNT -ge $MAX_TURNS ]; then
    MESSAGES+=("🛑 ターン数限界到達 ($TURN_COUNT/$MAX_TURNS)")
    EXIT_CODE=2
elif [ $TURN_COUNT -ge $WARNING_TURNS ]; then
    MESSAGES+=("🔴 ターン数警告 ($TURN_COUNT/$MAX_TURNS) - 速やかにタスク完了を")
    EXIT_CODE=1
elif [ $TURN_COUNT -ge $CAUTION_TURNS ]; then
    MESSAGES+=("🟡 ターン数注意 ($TURN_COUNT/$MAX_TURNS) - タスク完了を検討")
fi

# ファイル参照数チェック
if [ $FILE_COUNT -gt $MAX_FILES ]; then
    MESSAGES+=("🛑 ファイル参照限界 ($FILE_COUNT files)")
    EXIT_CODE=2
elif [ $FILE_COUNT -gt $WARNING_FILES ]; then
    MESSAGES+=("🔴 ファイル参照警告 ($FILE_COUNT files)")
    EXIT_CODE=1
elif [ $FILE_COUNT -gt $CAUTION_FILES ]; then
    MESSAGES+=("🟡 ファイル参照注意 ($FILE_COUNT files)")
fi

# メッセージ表示
if [ ${#MESSAGES[@]} -gt 0 ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "📊 精度管理システム通知" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    for msg in "${MESSAGES[@]}"; do
        echo "$msg" >&2
    done
    
    # 推奨アクション
    if [ $EXIT_CODE -eq 2 ]; then
        echo "" >&2
        echo "📋 推奨アクション:" >&2
        echo "1. 現在の作業を即座に保存" >&2
        echo "2. セッションをリセット (新しいターミナル)" >&2
        echo "3. optimization/context/current-session.md から継続" >&2
    elif [ $EXIT_CODE -eq 1 ]; then
        echo "" >&2
        echo "💡 推奨: 重要な作業のみ完了してセッションリセット" >&2
    fi
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
fi

# セッションリセット用スクリプトを作成（必要に応じて）
if [ $EXIT_CODE -eq 2 ]; then
    RESET_SCRIPT="$CONTEXT_DIR/reset-session.sh"
    cat > "$RESET_SCRIPT" << 'EOF'
#!/bin/bash
# セッションリセットスクリプト
echo "🔄 セッションをリセットします..."
rm -f optimization/context/.turn_count
rm -f optimization/context/.file_count
rm -f optimization/context/.error_count
echo "0" > optimization/context/.turn_count
echo "✅ リセット完了 - 新しいセッションを開始できます"
EOF
    chmod +x "$RESET_SCRIPT"
    echo "" >&2
    echo "リセット用: bash $RESET_SCRIPT" >&2
fi

exit $EXIT_CODE