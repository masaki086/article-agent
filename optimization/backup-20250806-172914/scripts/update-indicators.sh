#!/bin/bash

# Update Indicators Script - レスポンス後に自動実行
# Purpose: 精度指標の更新、ファイル参照数カウント、エラー率計算

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
LIMITS_DIR="$PROJECT_ROOT/optimization/limits"
INDICATORS_FILE="$LIMITS_DIR/indicators.md"
REFERENCE_FILE="$CONTEXT_DIR/reference-files.md"
TURN_FILE="$CONTEXT_DIR/.turn_count"
FILE_COUNT_FILE="$CONTEXT_DIR/.file_count"
ERROR_COUNT_FILE="$CONTEXT_DIR/.error_count"

# 現在の時刻
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# ターン数を読み込み
if [ -f "$TURN_FILE" ]; then
    TURN_COUNT=$(cat "$TURN_FILE")
else
    TURN_COUNT=0
fi

# ファイル参照数（簡易的にランダムで増加させる - 実際は他の方法で追跡）
if [ -f "$FILE_COUNT_FILE" ]; then
    FILE_COUNT=$(cat "$FILE_COUNT_FILE")
else
    FILE_COUNT=0
fi

# エラー数（簡易実装）
if [ -f "$ERROR_COUNT_FILE" ]; then
    ERROR_COUNT=$(cat "$ERROR_COUNT_FILE")
else
    ERROR_COUNT=0
fi

# 総合評価の判定
OVERALL_STATUS="🟢 良好"
RECOMMENDATION="通常作業継続"

# ターン数による判定
if [ $TURN_COUNT -gt 15 ]; then
    OVERALL_STATUS="🔴 限界"
    RECOMMENDATION="即座にタスク完了"
elif [ $TURN_COUNT -gt 10 ]; then
    OVERALL_STATUS="🟡 注意"
    RECOMMENDATION="タスク完了を検討"
fi

# ファイル参照数による判定
if [ $FILE_COUNT -gt 10 ]; then
    OVERALL_STATUS="🔴 限界"
    RECOMMENDATION="ファイル参照過多 - タスク分割推奨"
elif [ $FILE_COUNT -gt 8 ]; then
    if [ "$OVERALL_STATUS" = "🟢 良好" ]; then
        OVERALL_STATUS="🟡 注意"
    fi
fi

# indicators.mdの更新
if [ -f "$INDICATORS_FILE" ]; then
    # 総合評価を更新
    sed -i.bak "/^### 総合評価:/c\\
### 総合評価: $OVERALL_STATUS" "$INDICATORS_FILE"
    
    # ファイル参照指標を更新
    sed -i.bak "/\*\*参照数\*\*:/c\\
- **参照数**: ${FILE_COUNT}ファイル" "$INDICATORS_FILE"
    
    # ファイル参照の状態判定
    if [ $FILE_COUNT -le 5 ]; then
        FILE_STATUS="🟢 良好"
    elif [ $FILE_COUNT -le 10 ]; then
        FILE_STATUS="🟡 注意"
    else
        FILE_STATUS="🔴 限界"
    fi
    
    sed -i.bak "/### 3\. ファイル参照指標/,/\*\*推奨\*\*:/{s/\*\*状態\*\*: .*/\*\*状態\*\*: $FILE_STATUS/}" "$INDICATORS_FILE"
    
    # 推奨アクションを更新
    sed -i.bak "/\*\*推奨\*\*:/c\\
- **推奨**: $RECOMMENDATION" "$INDICATORS_FILE"
fi

# reference-files.mdの更新
if [ -f "$REFERENCE_FILE" ]; then
    # ファイル数統計を更新
    sed -i.bak "/\*\*総参照ファイル数\*\*:/c\\
- **総参照ファイル数**: $FILE_COUNT" "$REFERENCE_FILE"
    
    # 状態判定
    if [ $FILE_COUNT -le 5 ]; then
        REF_STATUS="🟢 良好（< 5ファイル）"
    elif [ $FILE_COUNT -le 10 ]; then
        REF_STATUS="🟡 注意（6-10ファイル）"
    else
        REF_STATUS="🔴 限界（11+ファイル）"
    fi
    
    sed -i.bak "/\*\*状態\*\*:/c\\
- **状態**: $REF_STATUS" "$REFERENCE_FILE"
fi

# ログ出力
echo "[$TIMESTAMP] Updated - Turn: $TURN_COUNT, Files: $FILE_COUNT, Status: $OVERALL_STATUS" >> "$CONTEXT_DIR/.session.log"

# バックアップファイルを削除
rm -f "$INDICATORS_FILE.bak" "$REFERENCE_FILE.bak" 2>/dev/null

# 限界到達時の強い警告
if [ "$OVERALL_STATUS" = "🔴 限界" ]; then
    echo "🔴 精度限界到達: $RECOMMENDATION" >&2
fi

exit 0