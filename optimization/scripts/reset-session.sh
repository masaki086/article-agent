#!/bin/bash

# Reset Session Script - セッションリセット
# Purpose: コンテキストサイズをリセットして新しいセッションを開始

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
echo "🔄 セッションリセット開始" >&2
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2

# 現在の行数を記録（会話履歴のリセットポイント）
if [ -f "$CONTEXT_DIR/.conversation.log" ]; then
    CURRENT_LINE=$(wc -l < "$CONTEXT_DIR/.conversation.log")
    echo "$CURRENT_LINE" > "$CONTEXT_DIR/.session_start"
    echo "✅ 会話履歴のリセットポイント設定: Line $CURRENT_LINE" >&2
else
    echo "1" > "$CONTEXT_DIR/.session_start"
    echo "✅ 新規セッション開始" >&2
fi

# ターンカウントをリセット
echo "0" > "$CONTEXT_DIR/.turn_count"
echo "✅ ターンカウント: リセット" >&2

# ファイルカウントをリセット
echo "0" > "$CONTEXT_DIR/.file_count"
echo "✅ ファイルカウント: リセット" >&2

# ファイルアクセスログをクリア（オプション）
if [ "$1" = "--clear-files" ]; then
    > "$CONTEXT_DIR/.file_access.log"
    echo "✅ ファイルアクセスログ: クリア" >&2
fi

# 現在のタスクとゴールをクリア
echo "新規セッション" > "$CONTEXT_DIR/.current_task"
echo "未設定" > "$CONTEXT_DIR/.next_goal"
echo "✅ タスク情報: リセット" >&2

# トークン計算を実行して新しい状態を確認
echo "" >&2
echo "📊 リセット後のコンテキストサイズ:" >&2
bash "$PROJECT_ROOT/optimization/scripts/calculate-tokens.sh"

# ダッシュボード更新
bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-js.sh" > /dev/null 2>&1

echo "" >&2
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
echo "✨ セッションリセット完了" >&2
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
echo "" >&2
echo "使用方法:" >&2
echo "  bash optimization/scripts/reset-session.sh           # 基本リセット" >&2
echo "  bash optimization/scripts/reset-session.sh --clear-files  # ファイルログもクリア" >&2