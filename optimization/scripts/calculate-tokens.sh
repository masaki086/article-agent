#!/bin/bash

# Calculate Tokens Script - トークン数計算
# Purpose: 各種要素のトークン数を推定計算

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

# 会話履歴のトークン計算
calculate_conversation_tokens() {
    local total=0
    
    if [ -f "$CONVERSATION_LOG" ]; then
        # 会話ログから推定
        local conv_chars=$(wc -c < "$CONVERSATION_LOG" 2>/dev/null || echo 0)
        total=$((conv_chars / 3))
    fi
    
    # ターン数からの推定値を加算（1ターンあたり平均1000トークンと仮定）
    if [ -f "$CONTEXT_DIR/.turn_count" ]; then
        local turns=$(cat "$CONTEXT_DIR/.turn_count")
        total=$((total + turns * 1000))
    fi
    
    echo $total
}

# 参照ファイルのトークン計算
calculate_file_tokens() {
    local total=0
    
    if [ -f "$FILE_LOG" ]; then
        # ファイルアクセスログから最近のファイルを取得
        while IFS='|' read -r timestamp filepath operation tokens; do
            if [ -n "$tokens" ]; then
                total=$((total + tokens))
            fi
        done < <(tail -10 "$FILE_LOG" 2>/dev/null)
    fi
    
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
    echo "📊 トークン使用状況" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "システムルール:  $(printf "%'6d" $SYSTEM_TOKENS) tokens" >&2
    echo "会話履歴:        $(printf "%'6d" $CONVERSATION_TOKENS) tokens" >&2
    echo "参照ファイル:    $(printf "%'6d" $FILE_TOKENS) tokens" >&2
    echo "作業メモリ:      $(printf "%'6d" $WORKING_TOKENS) tokens" >&2
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
    echo "合計:           $(printf "%'6d" $TOTAL_TOKENS) / 100,000" >&2
    
    # 使用率計算
    USAGE=$((TOTAL_TOKENS * 100 / 100000))
    echo "使用率:         ${USAGE}%" >&2
    
    # 状態判定
    if [ $TOTAL_TOKENS -lt 30000 ]; then
        echo "状態:           🟢 良好" >&2
    elif [ $TOTAL_TOKENS -lt 50000 ]; then
        echo "状態:           🟡 注意" >&2
    elif [ $TOTAL_TOKENS -lt 80000 ]; then
        echo "状態:           🔴 警告" >&2
    else
        echo "状態:           🛑 限界" >&2
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