#!/bin/bash

# Show Dashboard Script
# Purpose: HTMLダッシュボードを開く（ローカルファイル直接アクセス）

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DASHBOARD_HTML="$PROJECT_ROOT/optimization/dashboard/dashboard.html"
DATA_JS="$PROJECT_ROOT/optimization/dashboard/dashboard-data.js"

# データを更新（JavaScriptファイルとして出力）
echo "📊 ダッシュボードデータを更新中..."
bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-js.sh"

# HTMLファイルの存在確認
if [ ! -f "$DASHBOARD_HTML" ]; then
    echo "❌ エラー: ダッシュボードHTMLが見つかりません"
    echo "  パス: $DASHBOARD_HTML"
    exit 1
fi

# JSデータファイルの存在確認
if [ ! -f "$DATA_JS" ]; then
    echo "⚠️ 警告: データファイルが見つかりません"
    echo "  新規作成中..."
    bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-js.sh"
fi

# OS判定とブラウザ起動
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🌐 ダッシュボードを開いています..."
    open "$DASHBOARD_HTML"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🌐 ダッシュボードを開いています..."
    xdg-open "$DASHBOARD_HTML" 2>/dev/null || firefox "$DASHBOARD_HTML" 2>/dev/null || chromium "$DASHBOARD_HTML" 2>/dev/null
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "🌐 ダッシュボードを開いています..."
    start "$DASHBOARD_HTML"
else
    echo "⚠️ ブラウザを自動起動できません"
    echo "  手動で開いてください: $DASHBOARD_HTML"
fi

echo ""
echo "✅ ダッシュボード起動完了"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 トークン使用状況"
bash "$PROJECT_ROOT/optimization/scripts/calculate-tokens.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 使用方法:"
echo "  - HTMLファイル: $DASHBOARD_HTML"
echo "  - データ更新: bash optimization/scripts/update-dashboard-js.sh"
echo "  - 自動更新: 10秒ごとにJSファイルを再読み込み"
echo "  - 手動更新: ブラウザで「データ更新」ボタンをクリック"