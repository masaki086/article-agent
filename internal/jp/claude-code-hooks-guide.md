**日付:** 2025-08-06 | **バージョン:** 1.0

# Claude Code Hooks ガイド

## 🪝 概要

Claude CodeのHooks機能は、特定のイベントに応答して自動的にシェルコマンドを実行する仕組みで、開発プロセス全体のワークフロー自動化と品質管理を実現します。

## 📋 Hooksの仕組み

### 基本的な動作フロー

1. **イベントトリガー**: ツール実行、ファイル変更、ユーザーアクション
2. **Hook検出**: 設定されたHookがイベントに反応
3. **コマンド実行**: 定義されたシェルコマンドが自動実行
4. **フィードバック**: 実行結果がユーザーに報告

## 🎯 利用可能なHookタイプ

### 1. **user-prompt-submit-hook**
- **トリガー**: ユーザーがプロンプトを送信した時
- **用途**: 入力検証、前処理
- **例**:
  ```json
  {
    "user-prompt-submit": {
      "command": "echo 'Processing: ${user_input}' >> activity.log"
    }
  }
  ```

### 2. **tool-call-hook**
- **トリガー**: 任意のツール呼び出しの前後
- **用途**: ツール監視、ログ記録
- **例**:
  ```json
  {
    "tool-call": {
      "command": "echo 'Tool called: ${tool_name}' | tee -a tools.log"
    }
  }
  ```

### 3. **file-change-hook**
- **トリガー**: ファイルが変更された時
- **用途**: 自動フォーマット、構文チェック
- **例**:
  ```json
  {
    "file-change": {
      "pattern": "*.ts",
      "command": "prettier --write ${file_path}"
    }
  }
  ```

### 4. **pre-commit-hook**
- **トリガー**: Gitコミット前
- **用途**: コード品質チェック、テスト実行
- **例**:
  ```json
  {
    "pre-commit": {
      "command": "npm run lint && npm test",
      "blocking": true
    }
  }
  ```

### 5. **post-article-hook**
- **トリガー**: 記事作成後
- **用途**: 品質チェック、タグ生成
- **例**:
  ```json
  {
    "post-article": {
      "command": "/quality-check ${article_path}",
      "blocking": false
    }
  }
  ```

## 📝 設定方法

### 設定ファイルの構造

Hooksは`.claude/settings.json`または`settings.local.json`で設定します：

```json
{
  "hooks": {
    "hook-name": {
      "command": "実行するシェルコマンド",
      "blocking": true,
      "timeout": 30000,
      "pattern": "*.js",
      "error_message": "カスタムエラーメッセージ",
      "success_message": "カスタム成功メッセージ"
    }
  }
}
```

### 環境変数

Hookコマンド内で使用可能な変数：

| 変数 | 説明 | 例 |
|------|------|-----|
| `${file_path}` | 変更されたファイルのパス | `/path/to/file.js` |
| `${article_path}` | 作成された記事のパス | `/articles/series/article.md` |
| `${tool_name}` | 実行されたツール名 | `Write`, `Edit`, `Bash` |
| `${user_input}` | ユーザーの入力内容 | ユーザープロンプトテキスト |
| `${project_root}` | プロジェクトルートディレクトリ | `/Users/name/project` |
| `${timestamp}` | 現在のタイムスタンプ | `2025-08-06T10:30:45` |

## ⚙️ 設定オプション

| オプション | 説明 | デフォルト | 必須 |
|-----------|------|-----------|------|
| `command` | 実行するシェルコマンド | - | Yes |
| `blocking` | 完了まで待機 | `false` | No |
| `timeout` | タイムアウト（ミリ秒） | `10000` | No |
| `pattern` | ファイルglobパターン | `*` | No |
| `error_message` | カスタムエラーメッセージ | - | No |
| `success_message` | カスタム成功メッセージ | - | No |
| `condition` | 実行条件 | - | No |
| `retry` | リトライ回数 | `0` | No |

## 🚀 実践的な例

### 1. 品質保証の自動化

```json
{
  "hooks": {
    "post-write": {
      "command": "eslint ${file_path} --fix && prettier --write ${file_path}",
      "pattern": "*.{js,ts,jsx,tsx}",
      "success_message": "コードのフォーマットとリントが完了しました"
    }
  }
}
```

### 2. 記事作成ワークフロー

```json
{
  "hooks": {
    "post-article-generation": {
      "command": "/quality-check ${article_path} && /generate-tags ${article_path}",
      "blocking": true,
      "timeout": 60000,
      "error_message": "記事の品質チェックに失敗しました"
    },
    "pre-qiita-post": {
      "command": "test $(cat ${article_path} | wc -w) -gt 1000",
      "blocking": true,
      "error_message": "記事が短すぎます（最低1000語必要）"
    }
  }
}
```

### 3. セキュリティチェック

```json
{
  "hooks": {
    "pre-commit": {
      "command": "git secrets --scan && npm audit",
      "blocking": true,
      "error_message": "セキュリティ脆弱性が検出されました"
    },
    "file-change": {
      "pattern": "*.env*",
      "command": "echo '警告: 環境ファイルが変更されました' >&2",
      "blocking": false
    }
  }
}
```

### 4. 開発ワークフローの強化

```json
{
  "hooks": {
    "post-npm-install": {
      "command": "npm ls --depth=0 > dependencies.txt",
      "success_message": "依存関係リストを更新しました"
    },
    "pre-build": {
      "command": "rm -rf dist && echo 'クリーンビルドを開始'",
      "blocking": true
    },
    "post-test": {
      "command": "[ -f coverage/lcov.info ] && echo 'カバレッジ: $(cat coverage/lcov.info | grep -o '[0-9]*%' | head -1)'",
      "blocking": false
    }
  }
}
```

## 💡 高度なテクニック

### 1. 条件付き実行

```json
{
  "hooks": {
    "pre-commit": {
      "command": "if [ -f package.json ]; then npm test; elif [ -f Makefile ]; then make test; fi",
      "blocking": true
    }
  }
}
```

### 2. コマンドチェーン

```json
{
  "hooks": {
    "post-article": {
      "command": "/quality-check ${article_path} && /generate-diagrams && echo '処理完了'",
      "timeout": 120000
    }
  }
}
```

### 3. エラーハンドリングとフォールバック

```json
{
  "hooks": {
    "pre-publish": {
      "command": "/validate-article ${article_path} || (echo '検証失敗、自動修正を試みます' && /auto-fix ${article_path})",
      "blocking": true,
      "retry": 2
    }
  }
}
```

### 4. 並列処理

```json
{
  "hooks": {
    "post-series-creation": {
      "command": "find articles/${series_name} -name '*.md' | xargs -P 4 -I {} /quality-check {}",
      "timeout": 300000
    }
  }
}
```

## 🔒 セキュリティと制限事項

### 制限事項

1. **実行権限**: `settings.local.json`で許可されたコマンドのみ
2. **タイムアウト制限**: デフォルト10秒、最大60秒
3. **並行実行**: 同じHookの並行実行は不可
4. **リソース制限**: CPUとメモリ使用量は監視される

### セキュリティベストプラクティス

1. **コマンド検証**
   - 信頼できるコマンドのみ使用
   - コマンドに直接ユーザー入力を渡さない
   - 環境変数を安全に使用

2. **権限管理**
   ```json
   {
     "permissions": {
       "allow": ["Bash(allowed-command:*)"],
       "deny": ["Bash(rm -rf:*)"]
     }
   }
   ```

3. **入力サニタイゼーション**
   ```json
   {
     "hooks": {
       "file-change": {
         "command": "basename '${file_path}' | grep -E '^[a-zA-Z0-9._-]+$' && process-file '${file_path}'"
       }
     }
   }
   ```

## 🎯 プロジェクト固有の実装

### Article Agentプロジェクト用Hooks

```json
{
  "hooks": {
    "post-series-define": {
      "command": "echo 'シリーズ作成: $(ls -1 articles/ | tail -1)' && tree articles/$(ls -1 articles/ | tail -1) -L 2",
      "success_message": "シリーズ構造が正常に作成されました"
    },
    "pre-qiita-post": {
      "command": "grep -q '^**Generated Tags:**' ${article_path} && echo 'タグ発見' || echo '警告: タグが見つかりません'",
      "blocking": false
    },
    "post-diagram-generation": {
      "command": "find . -name '*.png' -mmin -1 | wc -l | xargs -I {} echo '{}個の図表を生成しました'",
      "pattern": "*.mmd"
    },
    "quality-threshold": {
      "command": "score=$(/quality-check ${article_path} | grep 'Score:' | grep -o '[0-9]+'); test $score -ge 95",
      "blocking": true,
      "error_message": "品質スコアが95/100未満です"
    }
  }
}
```

## ⚠️ トラブルシューティング

### よくある問題と解決策

#### 1. Hookが実行されない

**症状**: Hookコマンドが実行されない
**解決策**:
- `settings.local.json`の権限設定を確認
- ファイルベースHookのパターンマッチングを確認
- Hook名がイベントタイプと一致するか確認

#### 2. タイムアウトエラー

**症状**: Hookがタイムアウトで失敗
**解決策**:
```json
{
  "hooks": {
    "slow-process": {
      "command": "long-running-command",
      "timeout": 60000,
      "blocking": false
    }
  }
}
```

#### 3. ブロッキング問題

**症状**: Hook実行中にClaude Codeがフリーズ
**解決策**:
- 非重要Hookは`blocking: false`に設定
- 適切なエラーハンドリングを追加
- より短いタイムアウト値を使用

#### 4. 権限拒否

**症状**: コマンド実行が失敗
**解決策**:
- `settings.local.json`の許可リストにコマンドを追加
- ファイル権限を確認
- 実行可能ファイルにフルパスを使用

### デバッグモード

Hooksの詳細ログを有効化：

```json
{
  "hooks": {
    "debug-mode": true,
    "your-hook": {
      "command": "echo 'Debug: ${tool_name} called' >&2 && your-command"
    }
  }
}
```

## 📈 パフォーマンス最適化

### 1. ブロッキングHookの最小化

```json
{
  "hooks": {
    "async-processing": {
      "command": "nohup process-in-background ${file_path} &",
      "blocking": false
    }
  }
}
```

### 2. 結果のキャッシュ

```json
{
  "hooks": {
    "cached-check": {
      "command": "[ -f .cache/${file_path}.result ] && cat .cache/${file_path}.result || (check-file ${file_path} | tee .cache/${file_path}.result)"
    }
  }
}
```

### 3. バッチ処理

```json
{
  "hooks": {
    "batch-processor": {
      "command": "echo ${file_path} >> .batch-queue && [ $(wc -l < .batch-queue) -ge 10 ] && process-batch .batch-queue"
    }
  }
}
```

## 📚 ベストプラクティス

1. **コマンドをシンプルに**: 複雑なロジックはスクリプトに
2. **監視には非ブロッキング**: ログ/メトリクスでブロックしない
3. **タイムアウトを実装**: 常に適切なタイムアウトを設定
4. **エラーを優雅に処理**: ||演算子でフォールバック
5. **Hookの目的を文書化**: 設定にコメントを追加
6. **独立してHookをテスト**: Claude Code外でコマンドを検証
7. **パフォーマンス監視**: 実行時間とリソース使用量を追跡

## 🚀 次のステップ

1. 現在のワークフローで自動化の機会を確認
2. 品質管理用の基本Hookを実装
3. pre-commitにセキュリティチェックを追加
4. プロジェクト固有のカスタムHookを作成
5. Hookのパフォーマンスを監視・最適化

Hooksを活用して、Claude Codeのワークフローを自動化された品質保証付きの開発パイプラインに変革しましょう。