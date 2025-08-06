#!/bin/bash

# Update Dashboard JavaScript Data Script
# Purpose: JavaScriptファイルとしてデータを出力（HTMLから直接読み込み可能）

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
DATA_JS="$PROJECT_ROOT/optimization/dashboard/dashboard-data.js"
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

# ファイル数を読み込み
FILE_COUNT=0
if [ -f "$CONTEXT_DIR/.file_count" ]; then
    FILE_COUNT=$(cat "$CONTEXT_DIR/.file_count")
fi

# 状態判定
if [ $TOTAL_TOKENS -lt 30000 ]; then
    STATUS_OVERALL="good"
    STATUS_LEVEL="🟢"
    STATUS_MESSAGE="良好"
elif [ $TOTAL_TOKENS -lt 50000 ]; then
    STATUS_OVERALL="warning"
    STATUS_LEVEL="🟡"
    STATUS_MESSAGE="注意"
elif [ $TOTAL_TOKENS -lt 80000 ]; then
    STATUS_OVERALL="danger"
    STATUS_LEVEL="🔴"
    STATUS_MESSAGE="警告"
else
    STATUS_OVERALL="critical"
    STATUS_LEVEL="🛑"
    STATUS_MESSAGE="限界"
fi

# ファイルリストを生成
FILES_JSON="[]"
if [ -f "$FILE_LOG" ]; then
    FILES_JSON=$(tail -5 "$FILE_LOG" 2>/dev/null | awk -F'|' '
    BEGIN { print "[" }
    {
        if (NR > 1) print ","
        gsub(/^[ \t]+|[ \t]+$/, "", $1)
        gsub(/^[ \t]+|[ \t]+$/, "", $2)
        gsub(/^[ \t]+|[ \t]+$/, "", $3)
        gsub(/^[ \t]+|[ \t]+$/, "", $4)
        
        # ファイル名を取得
        n = split($2, path_parts, "/")
        filename = path_parts[n]
        if (filename == "") filename = "unknown"
        
        printf "  {\n"
        printf "    \"name\": \"%s\",\n", filename
        printf "    \"lastAccess\": \"%s\",\n", $1
        printf "    \"tokens\": %d,\n", ($4 != "" ? $4 : 0)
        printf "    \"operation\": \"%s\"\n", ($3 != "" ? $3 : "read")
        printf "  }"
    }
    END { print "\n]" }
    ')
fi

# モデル情報を取得
MODEL_INFO=$(bash "$PROJECT_ROOT/optimization/scripts/detect-engine.sh" --json 2>/dev/null || echo '{}')
MODEL_NAME=$(echo "$MODEL_INFO" | grep '"name"' | cut -d'"' -f4 || echo "Claude Opus 4.1")
MODEL_TYPE=$(echo "$MODEL_INFO" | grep '"characteristics"' | cut -d'"' -f4 || echo "複雑な推論・長文処理に最適")
MODEL_SCORE=$(echo "$MODEL_INFO" | grep '"performance_score"' | grep -o '[0-9]*' || echo "95")

# JavaScriptファイルとして出力
cat > "$DATA_JS" << EOF
// Dashboard Data - Auto-generated at $TIMESTAMP
// このファイルは自動生成されます。手動で編集しないでください。

window.dashboardData = {
  "timestamp": "$TIMESTAMP",
  "model": {
    "name": "$MODEL_NAME",
    "type": "$MODEL_TYPE",
    "score": "${MODEL_SCORE}/100"
  },
  "tokens": {
    "total": $TOTAL_TOKENS,
    "limit": 100000,
    "breakdown": {
      "システムルール": $SYSTEM_TOKENS,
      "会話履歴": $CONVERSATION_TOKENS,
      "参照ファイル": $FILE_TOKENS,
      "作業メモリ": $WORKING_TOKENS
    }
  },
  "session": {
    "startTime": "$(date '+%H:%M:%S')",
    "turns": $TURN_COUNT,
    "maxTurns": 20,
    "fileCount": $FILE_COUNT,
    "currentTask": "$(cat $CONTEXT_DIR/.current_task 2>/dev/null || echo '未設定')",
    "nextGoal": "$(cat $CONTEXT_DIR/.next_goal 2>/dev/null || echo '未設定')"
  },
  "status": {
    "overall": "$STATUS_OVERALL",
    "level": "$STATUS_LEVEL",
    "message": "$STATUS_MESSAGE"
  },
  "files": $FILES_JSON,
  "warnings": {
    "30000": {
      "level": "🟡",
      "label": "注意",
      "action": "タスク完了を意識"
    },
    "50000": {
      "level": "🔴",
      "label": "警告",
      "action": "重要作業のみ"
    },
    "80000": {
      "level": "🛑",
      "label": "限界",
      "action": "即座にセッション終了"
    }
  }
};

// データ更新通知用イベント
if (typeof window.onDashboardDataLoaded === 'function') {
  window.onDashboardDataLoaded(window.dashboardData);
}
EOF

# 成功メッセージ
echo "✅ ダッシュボードデータ更新完了: $TIMESTAMP" >&2
echo "📁 出力先: $DATA_JS" >&2

# 警告表示（必要に応じて）
if [ "$STATUS_OVERALL" = "danger" ] || [ "$STATUS_OVERALL" = "critical" ]; then
    echo "" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "$STATUS_LEVEL $STATUS_MESSAGE - トークン使用: $(printf "%'d" $TOTAL_TOKENS) / 100,000" >&2
    echo "HTMLダッシュボード: $PROJECT_ROOT/optimization/dashboard/dashboard.html" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
fi