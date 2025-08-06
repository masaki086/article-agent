#!/bin/bash

# Calculate Context Size Script - コンテキストサイズ計算
# Purpose: 現在のコンテキストウィンドウ内のトークン数を計測

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
TOKEN_FILE="$CONTEXT_DIR/.token_usage"
FILE_LOG="$CONTEXT_DIR/.file_access.log"
CONVERSATION_LOG="$CONTEXT_DIR/.conversation.log"

# トークン推定関数
estimate_tokens() {
    local file_or_text="$1"
    local type="${2:-text}"  # text or file
    
    if [ "$type" = "file" ] && [ -f "$file_or_text" ]; then
        # ファイルの場合
        local chars=$(wc -c < "$file_or_text")
        # 日本語多めのファイルは2文字/トークン、英語多めは4文字/トークン
        # 平均して3文字/トークンで計算
        echo $((chars / 3))
    else
        # テキストの場合
        local chars=$(echo -n "$file_or_text" | wc -c)
        echo $((chars / 3))
    fi
}

# システムルールのトークン計算
calculate_system_tokens() {
    local total=0
    
    # CLAUDE.md (常時参照)
    if [ -f "$PROJECT_ROOT/CLAUDE.md" ]; then
        local claude_tokens=$(estimate_tokens "$PROJECT_ROOT/CLAUDE.md" "file")
        total=$((total + claude_tokens))
        echo "CLAUDE.md: $claude_tokens tokens" >&2
    fi
    
    # optimization/README.md (常時参照)
    if [ -f "$PROJECT_ROOT/optimization/README.md" ]; then
        local opt_tokens=$(estimate_tokens "$PROJECT_ROOT/optimization/README.md" "file")
        total=$((total + opt_tokens))
        echo "optimization/README.md: $opt_tokens tokens" >&2
    fi
    
    echo $total
}

# 会話履歴のトークン計算（現在のセッション内のみ）
calculate_conversation_tokens() {
    local total=0
    
    # 現在のセッションマーカーを確認
    local session_start_line=1
    if [ -f "$CONTEXT_DIR/.session_start" ]; then
        session_start_line=$(cat "$CONTEXT_DIR/.session_start")
    fi
    
    if [ -f "$CONVERSATION_LOG" ]; then
        # 現在のセッション分のみ計測（実測値）
        local conv_chars=$(tail -n +"$session_start_line" "$CONVERSATION_LOG" 2>/dev/null | wc -c || echo 0)
        total=$((conv_chars / 3))
        echo "会話ログ実測: $total tokens (${conv_chars} chars)" >&2
    else
        echo "会話ログなし: 0 tokens" >&2
    fi
    
    # 実測値のみを返す（推定値は使用しない）
    echo $total
}

# 参照ファイルのトークン計算（現在参照中のファイルのみ）
calculate_file_tokens() {
    local total=0
    local current_session=$(date +%Y%m%d)
    
    if [ -f "$FILE_LOG" ]; then
        # 最近アクセスしたファイルのトークン合計（シンプルな実装）
        while IFS='|' read -r timestamp filepath operation tokens; do
            if [ -n "$tokens" ]; then
                # 最新20件のトークンを単純合計（簡易実装）
                total=$((total + tokens))
            fi
        done < <(tail -20 "$FILE_LOG" 2>/dev/null)
    fi
    
    # CLAUDE.mdなど常時参照ファイルは含まない（system_tokensで計測済み）
    
    echo $total
}

# 作業メモリのトークン計算（推定）
calculate_working_tokens() {
    # TodoList、一時変数、実行結果などの推定値
    local base_working=2000
    
    # ファイル数が多いほど作業メモリも増加
    if [ -f "$CONTEXT_DIR/.file_count" ]; then
        local file_count=$(cat "$CONTEXT_DIR/.file_count")
        base_working=$((base_working + file_count * 200))
    fi
    
    echo $base_working
}

# メイン処理
main() {
    echo "=== トークン使用量計算 ===" >&2
    
    # 各カテゴリのトークン計算
    SYSTEM_TOKENS=$(calculate_system_tokens)
    CONVERSATION_TOKENS=$(calculate_conversation_tokens)
    FILE_TOKENS=$(calculate_file_tokens)
    WORKING_TOKENS=$(calculate_working_tokens)
    
    # 合計計算
    TOTAL_TOKENS=$((SYSTEM_TOKENS + CONVERSATION_TOKENS + FILE_TOKENS + WORKING_TOKENS))
    
    # 結果を保存
    cat > "$TOKEN_FILE" << EOF
SYSTEM_TOKENS=$SYSTEM_TOKENS
CONVERSATION_TOKENS=$CONVERSATION_TOKENS
FILE_TOKENS=$FILE_TOKENS
WORKING_TOKENS=$WORKING_TOKENS
TOTAL_TOKENS=$TOTAL_TOKENS
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
EOF
    
    # 結果表示
    echo "" >&2
    echo "📊 現在のコンテキストサイズ" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "システムルール:  $(printf "%'6d" $SYSTEM_TOKENS) tokens" >&2
    echo "会話履歴:        $(printf "%'6d" $CONVERSATION_TOKENS) tokens" >&2
    echo "参照ファイル:    $(printf "%'6d" $FILE_TOKENS) tokens" >&2
    echo "作業メモリ:      $(printf "%'6d" $WORKING_TOKENS) tokens" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "コンテキスト計:  $(printf "%'6d" $TOTAL_TOKENS) tokens" >&2
    
    # コンテキストウィンドウに対する使用率
    # Claude Codeの実用的なコンテキストウィンドウは100K
    USAGE=$((TOTAL_TOKENS * 100 / 100000))
    echo "使用率:         ${USAGE}% (100K window)" >&2
    
    # 状態判定（回答品質の劣化指標）
    if [ $TOTAL_TOKENS -lt 30000 ]; then
        echo "状態:           🟢 良好 (最高品質)" >&2
    elif [ $TOTAL_TOKENS -lt 50000 ]; then
        echo "状態:           🟡 注意 (品質やや低下)" >&2
    elif [ $TOTAL_TOKENS -lt 80000 ]; then
        echo "状態:           🔴 警告 (品質低下)" >&2
    else
        echo "状態:           🛑 限界 (重大な品質低下)" >&2
        echo "推奨:           セッションリセットを検討" >&2
    fi
    
    # 戻り値として総トークン数を返す
    echo $TOTAL_TOKENS
}

# 引数処理
case "${1:-}" in
    --system)
        calculate_system_tokens
        ;;
    --conversation)
        calculate_conversation_tokens
        ;;
    --files)
        calculate_file_tokens
        ;;
    --working)
        calculate_working_tokens
        ;;
    *)
        main
        ;;
esac