#!/bin/bash

# Update Dashboard Script - ダッシュボード更新
# Purpose: session-dashboard.mdをリアルタイム更新

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
DASHBOARD="$CONTEXT_DIR/session-dashboard.md"
TOKEN_FILE="$CONTEXT_DIR/.token_usage"
FILE_LOG="$CONTEXT_DIR/.file_access.log"
TURN_FILE="$CONTEXT_DIR/.turn_count"

# 現在時刻
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# トークン計算を実行
bash "$PROJECT_ROOT/optimization/scripts/calculate-tokens.sh" > /dev/null 2>&1

# トークン情報を読み込み
if [ -f "$TOKEN_FILE" ]; then
    source "$TOKEN_FILE"
else
    SYSTEM_TOKENS=0
    CONVERSATION_TOKENS=0
    FILE_TOKENS=0
    WORKING_TOKENS=0
    TOTAL_TOKENS=0
fi

# ターン数を読み込み
TURN_COUNT=0
if [ -f "$TURN_FILE" ]; then
    TURN_COUNT=$(cat "$TURN_FILE")
fi

# 使用率計算
USAGE=$((TOTAL_TOKENS * 100 / 100000))

# プログレスバー生成
generate_progress_bar() {
    local percentage=$1
    local width=20
    local filled=$((percentage * width / 100))
    local empty=$((width - filled))
    
    printf "█%.0s" $(seq 1 $filled) 2>/dev/null
    printf "░%.0s" $(seq 1 $empty) 2>/dev/null
}

PROGRESS_BAR=$(generate_progress_bar $USAGE)

# 状態判定
if [ $TOTAL_TOKENS -lt 30000 ]; then
    OVERALL_STATUS="🟢 良好"
    TOKEN_STATUS="🟢"
elif [ $TOTAL_TOKENS -lt 50000 ]; then
    OVERALL_STATUS="🟡 注意"
    TOKEN_STATUS="🟡"
elif [ $TOTAL_TOKENS -lt 80000 ]; then
    OVERALL_STATUS="🔴 警告"
    TOKEN_STATUS="🔴"
else
    OVERALL_STATUS="🛑 限界"
    TOKEN_STATUS="🛑"
fi

# ダッシュボード更新
if [ -f "$DASHBOARD" ]; then
    # 最終更新時刻
    sed -i.bak "s/\*最終更新: .*/\*最終更新: $TIMESTAMP\*/" "$DASHBOARD"
    
    # 総合状態
    sed -i.bak "s/### 総合状態: .*/### 総合状態: $OVERALL_STATUS/" "$DASHBOARD"
    
    # プログレスバー更新
    sed -i.bak "/^トークン使用量:/c\\
トークン使用量: $PROGRESS_BAR $(printf "%'d" $TOTAL_TOKENS) / 100,000 (${USAGE}%)" "$DASHBOARD"
    
    # 内訳テーブル更新
    sed -i.bak "/| システムルール |/c\\
| システムルール | $(printf "%'d" $SYSTEM_TOKENS) | $((SYSTEM_TOKENS * 100 / (TOTAL_TOKENS + 1)))% | 📌 常時 |" "$DASHBOARD"
    
    sed -i.bak "/| 会話履歴 |/c\\
| 会話履歴 | $(printf "%'d" $CONVERSATION_TOKENS) | $((CONVERSATION_TOKENS * 100 / (TOTAL_TOKENS + 1)))% | 📝 累積中 |" "$DASHBOARD"
    
    sed -i.bak "/| 参照ファイル |/c\\
| 参照ファイル | $(printf "%'d" $FILE_TOKENS) | $((FILE_TOKENS * 100 / (TOTAL_TOKENS + 1)))% | 📁 アクティブ |" "$DASHBOARD"
    
    sed -i.bak "/| 作業メモリ |/c\\
| 作業メモリ | $(printf "%'d" $WORKING_TOKENS) | $((WORKING_TOKENS * 100 / (TOTAL_TOKENS + 1)))% | 💭 使用中 |" "$DASHBOARD"
    
    # ターン数更新
    sed -i.bak "s/\*\*総ターン数\*\*: [0-9]*\/[0-9]*/\*\*総ターン数\*\*: $TURN_COUNT\/20/" "$DASHBOARD"
    
    # 品質指標テーブル更新
    sed -i.bak "/| トークン使用率 |/c\\
| トークン使用率 | ${USAGE}% | 50% | $TOKEN_STATUS |" "$DASHBOARD"
    
    sed -i.bak "/| ターン数 |/c\\
| ターン数 | $TURN_COUNT/20 | 15/20 | $([ $TURN_COUNT -le 10 ] && echo '🟢' || ([ $TURN_COUNT -le 15 ] && echo '🟡' || echo '🔴')) |" "$DASHBOARD"
fi

# 参照ファイルリストを更新
if [ -f "$FILE_LOG" ] && [ -f "$DASHBOARD" ]; then
    # 一時ファイルに最新5件を取得
    TEMP_FILE="/tmp/dashboard_files_$$.tmp"
    echo "| ファイル | 最終アクセス | トークン | 操作 |" > "$TEMP_FILE"
    echo "|---------|-------------|----------|------|" >> "$TEMP_FILE"
    
    tail -5 "$FILE_LOG" 2>/dev/null | while IFS='|' read -r timestamp filepath operation tokens; do
        if [ -n "$filepath" ]; then
            filename=$(basename "$filepath" 2>/dev/null || echo "-")
            echo "| $filename | $timestamp | ${tokens:-0} | ${operation:-read} |" >> "$TEMP_FILE"
        fi
    done
    
    # ダッシュボードのファイルテーブルを更新
    sed -i.bak '/### 📁 アクティブファイル/,/^$/d' "$DASHBOARD"
    echo "### 📁 アクティブファイル（直近5件）" >> "$DASHBOARD"
    cat "$TEMP_FILE" >> "$DASHBOARD"
    echo "" >> "$DASHBOARD"
    rm -f "$TEMP_FILE"
fi

# ファイルアクセスログ関数（他のスクリプトから呼び出し用）
log_file_access() {
    local filepath="$1"
    local operation="${2:-read}"
    local tokens="${3:-0}"
    
    if [ -f "$filepath" ]; then
        tokens=$(bash "$PROJECT_ROOT/optimization/scripts/calculate-tokens.sh" --file "$filepath" 2>/dev/null || echo 0)
    fi
    
    echo "$(date '+%H:%M:%S')|$filepath|$operation|$tokens" >> "$FILE_LOG"
    
    # ファイルカウント更新
    local file_count=0
    if [ -f "$CONTEXT_DIR/.file_count" ]; then
        file_count=$(cat "$CONTEXT_DIR/.file_count")
    fi
    echo $((file_count + 1)) > "$CONTEXT_DIR/.file_count"
}

# バックアップファイル削除
rm -f "$DASHBOARD.bak" 2>/dev/null

# 警告表示（必要に応じて）
if [ "$OVERALL_STATUS" = "🔴 警告" ] || [ "$OVERALL_STATUS" = "🛑 限界" ]; then
    echo "" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "$OVERALL_STATUS - トークン使用: $(printf "%'d" $TOTAL_TOKENS) / 100,000" >&2
    echo "ダッシュボード確認: cat $DASHBOARD" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
fi

echo "✅ ダッシュボード更新完了: $TIMESTAMP" >&2