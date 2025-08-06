#!/bin/bash

# Detect Engine Script - 使用中のAIエンジンを検出
# Purpose: 現在のエンジンを特定し、適切な閾値を設定

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
ENGINE_FILE="$CONTEXT_DIR/.current_engine"
ENGINE_CONFIG="$PROJECT_ROOT/optimization/config/engine-thresholds.json"

# エンジン検出（環境変数やプロンプトから推定）
detect_current_engine() {
    # ClaudeCodeの環境変数をチェック（仮定）
    if [ -n "${CLAUDE_MODEL:-}" ]; then
        echo "$CLAUDE_MODEL"
        return
    fi
    
    # レスポンス特性から推定（文字数、速度など）
    # 実際はClaudeCodeのAPIレスポンスヘッダーから取得が理想
    
    # デフォルト値
    echo "opus-4.1"  # 現在使用中のモデル
}

# エンジン別の閾値設定
get_engine_thresholds() {
    local engine="$1"
    
    case "$engine" in
        "opus-4.1"|"claude-opus-4-1"*)
            cat << EOF
{
    "name": "Claude Opus 4.1",
    "max_tokens": 150000,
    "optimal_tokens": 50000,
    "warning_tokens": 80000,
    "max_turns": 25,
    "warning_turns": 20,
    "max_files": 15,
    "characteristics": "複雑な推論・長文処理に最適",
    "performance_score": 95
}
EOF
            ;;
        "sonnet-3.5"|"claude-3-5-sonnet"*)
            cat << EOF
{
    "name": "Claude 3.5 Sonnet",
    "max_tokens": 100000,
    "optimal_tokens": 30000,
    "warning_tokens": 50000,
    "max_turns": 20,
    "warning_turns": 15,
    "max_files": 10,
    "characteristics": "バランス型・高速処理",
    "performance_score": 85
}
EOF
            ;;
        "haiku"|"claude-3-haiku"*)
            cat << EOF
{
    "name": "Claude 3 Haiku",
    "max_tokens": 50000,
    "optimal_tokens": 15000,
    "warning_tokens": 25000,
    "max_turns": 15,
    "warning_turns": 10,
    "max_files": 5,
    "characteristics": "超高速・シンプルタスク向け",
    "performance_score": 70
}
EOF
            ;;
        *)
            cat << EOF
{
    "name": "Unknown Model",
    "max_tokens": 100000,
    "optimal_tokens": 30000,
    "warning_tokens": 50000,
    "max_turns": 20,
    "warning_turns": 15,
    "max_files": 10,
    "characteristics": "標準設定",
    "performance_score": 80
}
EOF
            ;;
    esac
}

# エンジン情報をダッシュボードに表示
update_engine_display() {
    local engine="$1"
    local thresholds=$(get_engine_thresholds "$engine")
    
    # エンジン名抽出
    local engine_name=$(echo "$thresholds" | grep '"name"' | cut -d'"' -f4)
    local characteristics=$(echo "$thresholds" | grep '"characteristics"' | cut -d'"' -f4)
    local max_tokens=$(echo "$thresholds" | grep '"max_tokens"' | cut -d':' -f2 | tr -d ' ,')
    local performance=$(echo "$thresholds" | grep '"performance_score"' | cut -d':' -f2 | tr -d ' ,}')
    
    # ダッシュボードに追記
    cat << EOF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 使用中のAIエンジン
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
モデル: $engine_name
特性: $characteristics
性能スコア: ${performance}/100
トークン上限: $(printf "%'d" $max_tokens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
}

# メイン処理
main() {
    # 現在のエンジンを検出
    CURRENT_ENGINE=$(detect_current_engine)
    
    # ファイルに保存
    echo "$CURRENT_ENGINE" > "$ENGINE_FILE"
    
    # 閾値を取得して保存
    get_engine_thresholds "$CURRENT_ENGINE" > "$ENGINE_CONFIG"
    
    # 表示
    update_engine_display "$CURRENT_ENGINE"
    
    # 前回と異なる場合は警告
    if [ -f "$ENGINE_FILE.prev" ]; then
        PREV_ENGINE=$(cat "$ENGINE_FILE.prev")
        if [ "$PREV_ENGINE" != "$CURRENT_ENGINE" ]; then
            echo "" >&2
            echo "⚠️ エンジンが変更されました: $PREV_ENGINE → $CURRENT_ENGINE" >&2
            echo "閾値が自動調整されました" >&2
        fi
    fi
    
    # 現在のエンジンを前回として保存
    cp "$ENGINE_FILE" "$ENGINE_FILE.prev"
}

# 実行
main "$@"