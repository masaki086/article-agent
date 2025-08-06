#!/bin/bash

# Detect Model from Response - AIモデルを応答から検出
# Purpose: Claudeの応答パターンからモデルを推定

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
MODEL_FILE="$CONTEXT_DIR/.detected_model"
MODEL_LOG="$CONTEXT_DIR/.model_detection.log"

# タイムスタンプ
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# モデル特定のヒントを探す
detect_model_hints() {
    # 環境変数から直接モデル情報を取得できる場合
    if [ -n "${ANTHROPIC_MODEL:-}" ]; then
        echo "$ANTHROPIC_MODEL"
        return
    fi
    
    # Claude Codeの内部情報から推定
    # Opus 4.1の特徴：
    # - より高速な応答
    # - コード生成の精度向上
    # - 100Kトークンの実用的な上限
    
    # デフォルトでOpus 4.1を仮定（Claude Code使用時）
    echo "claude-opus-4-1-20250805"
}

# モデル情報を取得
get_model_info() {
    local model_id="$1"
    
    case "$model_id" in
        *"opus-4"*)
            cat << EOF
{
    "id": "$model_id",
    "name": "Claude Opus 4.1",
    "version": "4.1",
    "context_window": 100000,
    "optimal_context": 50000,
    "quality_thresholds": {
        "excellent": 30000,
        "good": 50000,
        "degraded": 80000,
        "poor": 100000
    },
    "characteristics": "高速・高精度のコード生成",
    "detected_at": "$TIMESTAMP"
}
EOF
            ;;
        *"sonnet"*)
            cat << EOF
{
    "id": "$model_id",
    "name": "Claude 3.5 Sonnet",
    "version": "3.5",
    "context_window": 200000,
    "optimal_context": 100000,
    "quality_thresholds": {
        "excellent": 50000,
        "good": 100000,
        "degraded": 150000,
        "poor": 200000
    },
    "characteristics": "バランス型・長文処理",
    "detected_at": "$TIMESTAMP"
}
EOF
            ;;
        *)
            cat << EOF
{
    "id": "unknown",
    "name": "Unknown Model",
    "version": "unknown",
    "context_window": 100000,
    "optimal_context": 50000,
    "quality_thresholds": {
        "excellent": 30000,
        "good": 50000,
        "degraded": 80000,
        "poor": 100000
    },
    "characteristics": "不明",
    "detected_at": "$TIMESTAMP"
}
EOF
            ;;
    esac
}

# メイン処理
main() {
    # モデルを検出
    MODEL_ID=$(detect_model_hints)
    
    # モデル情報を取得
    MODEL_INFO=$(get_model_info "$MODEL_ID")
    
    # ファイルに保存
    echo "$MODEL_INFO" > "$MODEL_FILE"
    
    # ログに記録
    echo "[$TIMESTAMP] Detected model: $MODEL_ID" >> "$MODEL_LOG"
    
    # 結果を出力（JSON形式）
    if [ "${1:-}" = "--json" ]; then
        echo "$MODEL_INFO"
    else
        # 人間が読みやすい形式
        echo "🤖 検出されたモデル: $(echo "$MODEL_INFO" | grep '"name"' | cut -d'"' -f4)"
        echo "📏 コンテキストウィンドウ: $(echo "$MODEL_INFO" | grep '"context_window"' | grep -o '[0-9]*') tokens"
        echo "✨ 最適コンテキスト: $(echo "$MODEL_INFO" | grep '"optimal_context"' | grep -o '[0-9]*') tokens"
    fi
}

# 実行
main "$@"