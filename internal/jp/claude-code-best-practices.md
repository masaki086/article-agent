**日付:** 2025-08-06 | **バージョン:** 1.0

# Claude Code ベストプラクティスガイド

## 🎯 概要

このガイドは、Claude Codeを最大限活用して100%生成AIによる技術記事の執筆・投稿を効率的に行うための実践的なベストプラクティスをまとめたものです。

## 📋 目次

1. [プロジェクト構成の最適化](#プロジェクト構成の最適化)
2. [カスタムコマンドの活用](#カスタムコマンドの活用)
3. [SubAgentの効果的な使用](#subagentの効果的な使用)
4. [権限管理のベストプラクティス](#権限管理のベストプラクティス)
5. [記事作成ワークフローの自動化](#記事作成ワークフローの自動化)
6. [品質管理の自動化](#品質管理の自動化)
7. [トークン効率化戦略](#トークン効率化戦略)
8. [トラブルシューティング](#トラブルシューティング)

## 🗂 プロジェクト構成の最適化

### 推奨ディレクトリ構造

```
article-agent/
├── CLAUDE.md                           # プロジェクト全体のガイドライン
├── .claude/                            # Claude Code設定
│   ├── config.json                     # 基本設定
│   ├── settings.local.json             # ローカル権限設定
│   ├── commands/                       # カスタムコマンド定義
│   ├── agents/                         # SubAgent定義
│   └── config/                         # APIトークン等（.gitignore必須）
├── articles/                           # 記事管理
│   ├── shared-templates/               # 共有テンプレート（トークン削減）
│   └── {SeriesName}/                   # 各シリーズ
├── personas/                           # 統合ペルソナ管理
│   ├── individuals/                    # 個別ペルソナ定義
│   ├── roles/                          # 役割別行動パターン
│   └── contexts/                       # 状況別行動パターン
└── internal/                           # 内部ドキュメント
```

### ファイル命名規則

- **シリーズ名**: 英語のみ、CamelCase（例: `AIPersonaRoundtable`）
- **記事名**: 数字プレフィックス付き英語（例: `1-AIHumanDistanceAnalysis`）
- **内部文書**: 小文字、ハイフン区切り（例: `claude-code-best-practices.md`）

## 🚀 カスタムコマンドの活用

### 主要コマンド一覧

| コマンド | 用途 | 使用タイミング |
|---------|------|--------------|
| `/define-series` | シリーズ構造作成・記事生成 | 新シリーズ開始時 |
| `/update-series` | 既存シリーズの更新 | 記事改訂時 |
| `/generate-diagrams` | Mermaid図の一括生成 | 記事完成後 |
| `/post-qiita` | Qiitaへの投稿 | 記事公開時 |
| `/delete-qiita-series` | Qiita記事の削除 | 記事撤回時 |
| `/generate-tags` | タグ自動生成 | 記事完成後 |
| `/define-persona` | ペルソナ作成 | キャラクター追加時 |

### コマンド使用のベストプラクティス

#### 1. シリーズ作成の効率化

```bash
# ステップ1: シリーズ定義と記事自動生成
/define-series "Claude Code Advanced Techniques"
# → 対話的にシリーズ設計
# → 記事構造の自動生成
# → 全記事の自動執筆
# → 品質チェックの自動実行

# ステップ2: 図表の自動生成
/generate-diagrams
# → 全記事のMermaid図を一括生成

# ステップ3: 手動レビュー後に投稿
/post-qiita AIPersonaRoundtable
# → 各記事を個別に投稿
```

#### 2. 記事更新の自動化

```bash
# 既存記事の更新
/update-series NextJSRenderingBattle
# → シリーズ全体の一括更新
# → 品質チェックの再実行
```

## 🤖 SubAgentの効果的な使用

### SubAgent活用パターン

#### 品質チェックAgent（quality-checker）

**自動実行タイミング**:
- 記事生成完了後
- `/update-series`実行時
- 手動実行: `/quality-check "path/to/article.md"`

**主な機能**:
- 重複メタデータの自動削除
- TypeScript型定義の追加
- Markdown構文エラーの修正
- 品質スコア（95/100目標）の算出

#### コード品質チェックAgent（code-quality-checker）

**用途**:
- コード例の型安全性確認
- ベストプラクティス準拠チェック
- パフォーマンス問題の検出

### SubAgent設計のポイント

1. **単一責任原則**: 各Agentは1つの明確な役割を持つ
2. **自動トリガー**: 適切なタイミングで自動実行
3. **相互連携**: Agent間でデータを共有
4. **エラーハンドリング**: 失敗時の適切な処理

## 🔐 権限管理のベストプラクティス

### settings.local.json の最適化

```json
{
  "permissions": {
    "allow": [
      // 必須コマンド
      "Bash(mkdir:*)",      // ディレクトリ作成
      "Bash(python:*)",      // Python実行
      "Bash(npm run:*)",     // npm scripts
      "Bash(git:*)",         // Git操作
      "Bash(mmdc:*)",        // Mermaid図生成
      
      // カスタムコマンド
      "Bash(/post-qiita:*)", // Qiita投稿
      
      // MCP統合
      "mcp__ide__executeCode"
    ],
    "deny": [
      // 危険なコマンドを明示的に拒否
      "Bash(sudo:*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

### セキュリティ考慮事項

1. **最小権限の原則**: 必要最小限の権限のみ付与
2. **明示的な拒否**: 危険なコマンドは明示的にdenyリストに追加
3. **定期的な見直し**: 使用状況に応じて権限を調整

## 📝 記事作成ワークフローの自動化

### 効率的なワークフロー

```mermaid
graph TD
    A[シリーズコンセプト] --> B[/define-series実行]
    B --> C[対話的設計]
    C --> D[自動記事生成]
    D --> E[品質チェック]
    E --> F{スコア95+?}
    F -->|Yes| G[図表生成]
    F -->|No| H[自動修正]
    H --> E
    G --> I[最終レビュー]
    I --> J[/post-qiita実行]
```

### タスク管理の活用

```javascript
// Claude CodeのTodoWrite機能を活用
TodoWrite({
  todos: [
    { id: "1", content: "シリーズ構造作成", status: "completed" },
    { id: "2", content: "記事1執筆", status: "in_progress" },
    { id: "3", content: "記事2執筆", status: "pending" },
    { id: "4", content: "品質チェック", status: "pending" },
    { id: "5", content: "Qiita投稿", status: "pending" }
  ]
});
```

## ✅ 品質管理の自動化

### 品質チェックの自動化フロー

1. **記事生成後の自動チェック**
   - 重複メタデータの削除
   - TypeScript型定義の追加
   - Markdown構文エラーの修正

2. **品質スコアリング**
   - フォーマット一貫性: /100
   - コンテンツ品質: /100
   - 技術的正確性: /100
   - 総合スコア: 平均値（目標: 95+）

3. **自動修正カテゴリ**
   - `duplicate_metadata`: メタデータ重複
   - `typescript_types`: 型定義不足
   - `markdown_syntax`: 構文エラー
   - `version_notation`: バージョン表記
   - `trailing_whitespace`: 末尾空白

### 品質基準の設定

```json
{
  "quality_standards": {
    "target_score": 95,
    "critical_threshold": 80,
    "auto_fix_enabled": true,
    "auto_fix_categories": [
      "duplicate_metadata",
      "typescript_types",
      "markdown_syntax",
      "version_notation",
      "trailing_whitespace"
    ]
  }
}
```

## 💡 トークン効率化戦略

### 共有テンプレートの活用

**効果**: 25-35%のトークン削減

1. **series-common.md**: キャラクター設定・共通パターン
2. **optimized-format.md**: トークン効率化記事フォーマット
3. **english-templates.md**: 再利用可能な英語テンプレート

### 統合ペルソナシステム

**メリット**:
- 1つのペルソナで複数役割（執筆者・レビュワー・読者）
- キャラクター一貫性の自動維持
- 役割切り替えによる多角的評価

### 参照による重複削減

```markdown
# author.md の例
参照ファイル: /personas/individuals/tanukichi.md
テンプレート: /articles/shared-templates/author.md

## カスタマイズ（このシリーズ専用）
- **重点テーマ**: Claude Code活用術
- **特別な文体調整**: より実践的なアプローチ
```

## 🔧 トラブルシューティング

### よくある問題と解決策

#### 1. コマンドが実行できない

**原因**: 権限設定の不足
**解決策**: 
```bash
# settings.local.jsonに権限を追加
"allow": ["Bash(command:*)"]
```

#### 2. 品質スコアが低い

**原因**: テンプレート不整合
**解決策**:
```bash
# 品質チェックを手動実行
/quality-check "articles/SeriesName/1-ArticleName/drafts/pages/article.md"
# 自動修正を適用
```

#### 3. Qiita投稿エラー

**原因**: APIトークン設定ミス
**解決策**:
```bash
# トークンファイルの確認
cat .claude/config/qiita-token.json
# 正しい形式で設定
{"token": "your-api-token-here"}
```

#### 4. 図表生成失敗

**原因**: Mermaid記法エラー
**解決策**:
```bash
# 個別に図表を生成してエラー確認
mmdc -i diagram.mmd -o diagram.png -b white
```

### デバッグのヒント

1. **ログの確認**: エラーメッセージを詳細に読む
2. **段階的実行**: コマンドを小さく分割して実行
3. **権限チェック**: settings.local.jsonの設定確認
4. **ファイルパス**: 絶対パスを使用して問題を回避

## 📈 パフォーマンス最適化

### 並列処理の活用

```bash
# 複数記事の同時品質チェック
parallel /quality-check ::: article1.md article2.md article3.md
```

### キャッシュの活用

- 共有テンプレートをメモリに保持
- 生成済み図表の再利用
- ペルソナ設定のキャッシング

### バッチ処理

```bash
# シリーズ全体の一括処理
/update-series SeriesName --batch --no-prompt
```

## 🎓 高度な活用テクニック

### 1. Hook機能の活用

Hook設定と使用方法の詳細については、[Claude Code Hooks ガイド](./claude-code-hooks-guide.md)を参照してください。

```json
{
  "hooks": {
    "pre-commit": "npm run lint && npm test",
    "post-article": "/quality-check ${article_path}",
    "pre-publish": "/generate-tags ${article_path}"
  }
}
```

### 2. MCP（Model Context Protocol）統合

```json
{
  "mcp": {
    "ide": {
      "enabled": true,
      "features": ["diagnostics", "executeCode"]
    }
  }
}
```

### 3. カスタムワークフロー

```javascript
// 複雑なワークフローの自動化
async function customWorkflow() {
  await defineSeries("NewSeries");
  await generateDiagrams();
  await qualityCheck();
  if (score >= 95) {
    await postToQiita();
  }
}
```

## 📚 リファレンス

### 重要なファイル

- `/CLAUDE.md`: プロジェクトガイドライン
- `/.claude/config.json`: Claude Code設定
- `/.claude/settings.local.json`: ローカル権限設定
- `/articles/shared-templates/`: 共有テンプレート

### 関連ドキュメント

- [カスタムコマンド定義ガイド](.claude/commands/)
- [SubAgent設計パターン](.claude/agents/)
- [ペルソナ管理ガイド](personas/)

## 🚀 次のステップ

1. **基本設定の完了**: CLAUDE.mdとconfig.jsonの設定
2. **権限の最適化**: settings.local.jsonの調整
3. **テンプレート準備**: shared-templatesの作成
4. **ペルソナ設定**: 統合ペルソナの定義
5. **自動化の実装**: カスタムコマンドとSubAgentの活用

このガイドを参考に、Claude Codeを最大限活用して効率的な記事作成を実現してください。