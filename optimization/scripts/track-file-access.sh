#!/bin/bash

# Track File Access Script - ファイルアクセスの追跡
# PostToolUseフックで実行される（Read, Edit, Write等）
# 利用可能な環境変数: tool_name, tool_input, tool_response, session_id

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONTEXT_DIR="$PROJECT_ROOT/optimization/context"
LOG_DIR="$PROJECT_ROOT/optimization/logs"

# ディレクトリ作成
mkdir -p "$CONTEXT_DIR" "$LOG_DIR"

# タイムスタンプ
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
TIMESTAMP_SHORT=$(date "+%H:%M:%S")

# ツール名を確認
TOOL_NAME="${tool_name:-unknown}"

# デバッグモード
if [ "$DEBUG" = "1" ]; then
    echo "🔧 PostToolUse Hook Triggered" >&2
    echo "  Tool: $TOOL_NAME" >&2
    echo "  Input length: ${#tool_input}" >&2
    echo "  Response length: ${#tool_response}" >&2
fi

# Readツールの場合
if [ "$TOOL_NAME" = "Read" ]; then
    # tool_inputからファイルパスを抽出（JSON形式の場合）
    # 例: {"file_path": "/path/to/file"}
    FILE_PATH=$(echo "$tool_input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*: *"\([^"]*\)".*/\1/')
    
    if [ -z "$FILE_PATH" ]; then
        # 単純な文字列の場合
        FILE_PATH="$tool_input"
    fi
    
    # tool_responseの文字数をカウント（実際に読み込まれた内容）
    RESPONSE_CHARS=$(echo -n "$tool_response" | wc -c | tr -d ' ')
    RESPONSE_TOKENS=$((RESPONSE_CHARS / 3))  # トークン推定
    
    # ファイルアクセスログに記録
    echo "${TIMESTAMP}|READ|${FILE_PATH}|chars:${RESPONSE_CHARS}|tokens:${RESPONSE_TOKENS}" >> "$LOG_DIR/file-access.log"
    
    # 簡易版のファイルアクセスログ（ダッシュボード用）
    echo "${TIMESTAMP_SHORT}|${FILE_PATH}|read|${RESPONSE_TOKENS}" >> "$CONTEXT_DIR/.file_access.log"
    
    # 累積ファイルトークンを更新
    if [ -f "$CONTEXT_DIR/.file_tokens_stats" ]; then
        source "$CONTEXT_DIR/.file_tokens_stats"
        TOTAL_FILE_TOKENS=$((TOTAL_FILE_TOKENS + RESPONSE_TOKENS))
        FILE_READ_COUNT=$((FILE_READ_COUNT + 1))
    else
        TOTAL_FILE_TOKENS=$RESPONSE_TOKENS
        FILE_READ_COUNT=1
    fi
    
    cat > "$CONTEXT_DIR/.file_tokens_stats" << EOF
TOTAL_FILE_TOKENS=$TOTAL_FILE_TOKENS
FILE_READ_COUNT=$FILE_READ_COUNT
LAST_FILE_PATH="$FILE_PATH"
LAST_FILE_TOKENS=$RESPONSE_TOKENS
LAST_READ_TIME="$TIMESTAMP"
EOF
    
    # ファイル数をインクリメント
    if [ -f "$CONTEXT_DIR/.file_count" ]; then
        CURRENT_COUNT=$(cat "$CONTEXT_DIR/.file_count" 2>/dev/null || echo 0)
        echo $((CURRENT_COUNT + 1)) > "$CONTEXT_DIR/.file_count"
    else
        echo "1" > "$CONTEXT_DIR/.file_count"
    fi
    
    if [ "$DEBUG" = "1" ]; then
        echo "📄 File Read Tracked:" >&2
        echo "  Path: $FILE_PATH" >&2
        echo "  Characters: $RESPONSE_CHARS" >&2
        echo "  Est. Tokens: $RESPONSE_TOKENS" >&2
        echo "  Total File Tokens: $TOTAL_FILE_TOKENS" >&2
    fi

# Editツールの場合
elif [ "$TOOL_NAME" = "Edit" ]; then
    # ファイルパスを抽出
    FILE_PATH=$(echo "$tool_input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*: *"\([^"]*\)".*/\1/')
    
    # 編集内容のサイズ
    INPUT_CHARS=$(echo -n "$tool_input" | wc -c | tr -d ' ')
    INPUT_TOKENS=$((INPUT_CHARS / 3))
    
    echo "${TIMESTAMP}|EDIT|${FILE_PATH}|chars:${INPUT_CHARS}|tokens:${INPUT_TOKENS}" >> "$LOG_DIR/file-access.log"
    echo "${TIMESTAMP_SHORT}|${FILE_PATH}|edit|${INPUT_TOKENS}" >> "$CONTEXT_DIR/.file_access.log"

# Writeツールの場合
elif [ "$TOOL_NAME" = "Write" ]; then
    # ファイルパスを抽出
    FILE_PATH=$(echo "$tool_input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*: *"\([^"]*\)".*/\1/')
    
    # 書き込み内容のサイズ
    CONTENT=$(echo "$tool_input" | grep -o '"content"[[:space:]]*:[[:space:]]*".*"' | sed 's/.*: *"\(.*\)".*/\1/')
    CONTENT_CHARS=$(echo -n "$CONTENT" | wc -c | tr -d ' ')
    CONTENT_TOKENS=$((CONTENT_CHARS / 3))
    
    echo "${TIMESTAMP}|WRITE|${FILE_PATH}|chars:${CONTENT_CHARS}|tokens:${CONTENT_TOKENS}" >> "$LOG_DIR/file-access.log"
    echo "${TIMESTAMP_SHORT}|${FILE_PATH}|write|${CONTENT_TOKENS}" >> "$CONTEXT_DIR/.file_access.log"

# その他のツール
else
    if [ "$DEBUG" = "1" ]; then
        echo "⚙️  Tool: $TOOL_NAME (not tracked)" >&2
    fi
fi

# リアルタイムダッシュボード更新トリガー（別スクリプトで実装予定）
# bash "$PROJECT_ROOT/optimization/scripts/update-dashboard-v2.sh" &