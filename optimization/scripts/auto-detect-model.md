# AIモデル自動検出について

## 現状
現在、Claude Codeからは直接モデル情報を取得する方法がありません。

## 検出可能な方法

### 1. **手動設定** (推奨)
`.claude/config.json`または環境変数で設定:
```bash
export ANTHROPIC_MODEL="claude-opus-4-1-20250805"
```

### 2. **応答パターンからの推定**
- 応答速度
- トークン消費量
- エラーメッセージのパターン

### 3. **ユーザーからの情報**
初回起動時に確認:
```bash
echo "使用中のモデルを選択してください:"
echo "1) Claude Opus 4.1 (デフォルト)"
echo "2) Claude 3.5 Sonnet"
echo "3) その他"
```

## 実装済みの仕組み

`detect-model-from-response.sh`が以下を行います:
1. 環境変数`ANTHROPIC_MODEL`をチェック
2. なければデフォルトでOpus 4.1と仮定
3. モデルに応じた閾値を設定

## 将来的な改善案

1. **APIレスポンスヘッダー**
   - Claude APIが将来的にモデル情報を返す可能性

2. **プロンプトでの自己申告**
   - "What model are you?"への応答を解析

3. **特徴的な応答パターン**
   - 各モデル固有の応答傾向を学習

## 現在の対処法

1. **デフォルトはOpus 4.1**
   - Claude Code使用時の標準モデル
   - コンテキスト100K、最適50K

2. **手動切り替え可能**
   ```bash
   export ANTHROPIC_MODEL="claude-3-5-sonnet"
   bash optimization/scripts/detect-model-from-response.sh
   ```

3. **ダッシュボードに表示**
   - 推定モデル名を表示
   - 適切な閾値を自動設定