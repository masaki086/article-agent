#!/bin/bash

# Log File Access Script
# Purpose: ファイルアクセスをログに記録

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FILE_LOG="$PROJECT_ROOT/optimization/context/.file_access.log"

# 使用方法: log-file-access.sh <filepath> <operation> <tokens>
FILE_PATH="${1:-}"
OPERATION="${2:-read}"
TOKENS="${3:-0}"

if [ -z "$FILE_PATH" ]; then
    echo "Usage: $0 <filepath> [operation] [tokens]" >&2
    exit 1
fi

# ファイル名を取得
FILE_NAME=$(basename "$FILE_PATH")

# タイムスタンプ
TIMESTAMP=$(date '+%H:%M:%S')

# トークン数を推定（未指定の場合）
if [ "$TOKENS" = "0" ] && [ -f "$FILE_PATH" ]; then
    # ファイルサイズから推定（簡易的に3文字=1トークン）
    FILE_SIZE=$(wc -c < "$FILE_PATH" 2>/dev/null || echo 0)
    TOKENS=$((FILE_SIZE / 3))
fi

# ログエントリを追加
echo "${TIMESTAMP}|${FILE_PATH}|${OPERATION}|${TOKENS}" >> "$FILE_LOG"

# 古いエントリを削除（最新10件のみ保持）
if [ $(wc -l < "$FILE_LOG" 2>/dev/null || echo 0) -gt 10 ]; then
    tail -10 "$FILE_LOG" > "${FILE_LOG}.tmp"
    mv "${FILE_LOG}.tmp" "$FILE_LOG"
fi

# ファイルカウントを更新（ユニークなファイル数）
FILE_COUNT_FILE="$PROJECT_ROOT/optimization/context/.file_count"
if [ -f "$FILE_LOG" ]; then
    # ユニークなファイルパスの数をカウント
    UNIQUE_FILES=$(awk -F'|' '{print $2}' "$FILE_LOG" | sort -u | wc -l)
    echo "$UNIQUE_FILES" > "$FILE_COUNT_FILE"
else
    echo "0" > "$FILE_COUNT_FILE"
fi

echo "✅ ファイルアクセスを記録: $FILE_NAME ($OPERATION, ${TOKENS} tokens)" >&2