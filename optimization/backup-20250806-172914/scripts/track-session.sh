#!/bin/bash

# Track Session Script - ユーザー入力時に自動実行
# Purpose: ターン数カウント、セッション情報更新、精度チェック

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
LIMITS_DIR="$PROJECT_ROOT/optimization/limits"
SESSION_FILE="$CONTEXT_DIR/current-session.md"
INDICATORS_FILE="$LIMITS_DIR/indicators.md"
TURN_FILE="$CONTEXT_DIR/.turn_count"

# 現在の時刻
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# ターン数を読み込み（なければ0）
if [ -f "$TURN_FILE" ]; then
    TURN_COUNT=$(cat "$TURN_FILE")
else
    TURN_COUNT=0
fi

# ターン数をインクリメント
TURN_COUNT=$((TURN_COUNT + 1))
echo "$TURN_COUNT" > "$TURN_FILE"

# 最大ターン数
MAX_TURNS=20

# セッションファイル更新
if [ -f "$SESSION_FILE" ]; then
    # 現在のターン数を更新
    sed -i.bak "s/\*\*現在のターン\*\*: [0-9]*/\*\*現在のターン\*\*: $TURN_COUNT/" "$SESSION_FILE"
    sed -i.bak "s|ターン: [0-9]*/[0-9]*|ターン: $TURN_COUNT/$MAX_TURNS|" "$SESSION_FILE"
fi

# 精度状態の判定
if [ $TURN_COUNT -le 5 ]; then
    STATUS="🟢 良好"
    MESSAGE=""
elif [ $TURN_COUNT -le 10 ]; then
    STATUS="🟢 良好"
    MESSAGE=""
elif [ $TURN_COUNT -le 15 ]; then
    STATUS="🟡 注意"
    MESSAGE="📊 ターン$TURN_COUNT/$MAX_TURNS - タスク完了を検討してください"
elif [ $TURN_COUNT -le 18 ]; then
    STATUS="🔴 警告"
    MESSAGE="⚠️ ターン$TURN_COUNT/$MAX_TURNS - 精度限界接近！速やかにタスクを完了してください"
else
    STATUS="🔴 限界"
    MESSAGE="🛑 ターン$TURN_COUNT/$MAX_TURNS - 精度限界！セッションリセットを推奨"
fi

# indicatorsファイル更新
if [ -f "$INDICATORS_FILE" ]; then
    # ターン数指標を更新
    sed -i.bak "s/\*\*現在\*\*: [0-9]*/\*\*現在\*\*: $TURN_COUNT/" "$INDICATORS_FILE"
    sed -i.bak "s|ターン: [0-9]*/[0-9]*|ターン: $TURN_COUNT/$MAX_TURNS|" "$INDICATORS_FILE"
    
    # 使用率計算
    USAGE=$((TURN_COUNT * 100 / MAX_TURNS))
    sed -i.bak "s/\*\*使用率\*\*: [0-9]*%/\*\*使用率\*\*: $USAGE%/" "$INDICATORS_FILE"
    
    # 状態更新
    sed -i.bak "s/\*\*状態\*\*: .*/\*\*状態\*\*: $STATUS/" "$INDICATORS_FILE"
    
    # プログレスバー更新
    FILLED=$((TURN_COUNT * 20 / MAX_TURNS))
    EMPTY=$((20 - FILLED))
    PROGRESS="["
    for ((i=1; i<=FILLED; i++)); do PROGRESS="${PROGRESS}#"; done
    for ((i=1; i<=EMPTY; i++)); do PROGRESS="${PROGRESS} "; done
    PROGRESS="${PROGRESS}] $TURN_COUNT/$MAX_TURNS"
    
    # プログレスバーの行を更新
    sed -i.bak "/^\[.*\] [0-9]*\/[0-9]*/c\\
$PROGRESS" "$INDICATORS_FILE"
fi

# 警告メッセージを表示
if [ -n "$MESSAGE" ]; then
    echo "$MESSAGE" >&2
fi

# ログ出力（デバッグ用）
echo "[$TIMESTAMP] Turn $TURN_COUNT/$MAX_TURNS - Status: $STATUS" >> "$CONTEXT_DIR/.session.log"

# 会話をログに記録（トークン計算用）
if [ -n "${user_input:-}" ]; then
    echo "[$TIMESTAMP] USER: ${user_input:0:200}" >> "$CONTEXT_DIR/.conversation.log"
fi

# トークン使用量を更新
bash "$PROJECT_ROOT/optimization/scripts/track-token-usage.sh" increment 5000 2>/dev/null

# ダッシュボード更新を呼び出し
bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-js.sh" 2>/dev/null &

# バックアップファイルを削除
rm -f "$SESSION_FILE.bak" "$INDICATORS_FILE.bak" 2>/dev/null

exit 0