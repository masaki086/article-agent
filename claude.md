# Claude Code プロジェクトガイドライン

このドキュメントは、100%生成AIによる技術記事の執筆・投稿を目的としたプロジェクトの全体ルールを定義します。

## 📝 文書作成時の自動判定

/fix: 文書作成時は以下のルールを適用
- IF path.includes('/articles/') THEN 記事文書として扱う → 日本語で作成
- ELSE 内部文書として扱う → 英語版作成後、/internal/jp/に日本語版作成

/todo: 文書作成前のチェックリスト
- [ ] 文書タイプの判定（記事 or 内部文書）
- [ ] 適切な言語での作成
- [ ] 命名規則の確認
- [ ] 日付とバージョンの記載（内部文書のみ）

## 📖 記事作成ルール

/fix: 記事作成タスクの場合は必ず `/articles/claude.md` を参照
- Phase 1: シリーズ定義のルール
- Phase 2: 記事作成の詳細ワークフロー
- 品質チェックリスト
- 共有テンプレート活用によるトークン削減方法

/todo: 記事作成開始時のタスク
- [ ] /articles/claude.md を読み込む
- [ ] 共有テンプレート（/articles/shared-templates/）の確認
- [ ] ペルソナ設定（/articles/personas/）の確認
- [ ] シリーズ構造の確認

## 🗂 命名規則

### ファイル名
- **内部文書**: 小文字、ハイフン区切り（例: `claude-code-best-practices.md`）
- **記事関連**: `/articles/claude.md` を参照（シリーズ名、記事名、テンプレート）

/fix: 内部文書の命名規則違反を検出したら自動修正提案

### Gitブランチ
- `feature-{機能名}`: 新機能開発用
- `fix-{修正内容}`: バグ修正用
- `docs-{文書名}`: ドキュメント更新用
- `backup-{元ブランチ}-YYYYMMDD-{番号}`: バックアップ用

## 🗂 ディレクトリ構造

```
article-agent/
├── CLAUDE.md                    # このファイル（全体ルール）
├── articles/                    # 記事管理
│   ├── claude.md               # 記事作成専用ルール ⭐
│   ├── personas/               # ペルソナ管理
│   │   ├── individuals/       # 個別ペルソナ
│   │   ├── roles/             # 役割別パターン
│   │   └── contexts/          # 状況別パターン
│   ├── shared-templates/       # 共有テンプレート
│   └── {SeriesName}/          # 各シリーズ
├── internal/                    # 内部文書（英語版）
│   └── jp/                     # 内部文書（日本語版）
└── .claude/                     # Claude Code設定
    ├── agents/                  # SubAgent定義
    ├── commands/                # カスタムコマンド
    └── config/                  # APIトークン等
```

## 🔒 セキュリティとGit管理

### .gitignore必須項目
```gitignore
# APIトークン
.claude/config/*-token.json
.claude/config/secrets.json

# 環境設定
.env
.env.local
*.key
*.secret

# ログ・一時ファイル
*.log
logs/
tmp/
temp/
.DS_Store
```

/fix: 機密情報を検出したら即座に警告
- APIトークンの直接記載を防止
- 個人情報の記載を防止
- パスワードやシークレットキーの記載を防止

## 🚫 禁止事項

/fix: 以下の違反を検出したら自動停止
- 機密情報や個人情報の記載
- 未検証情報の事実としての記載
- 他者著作物の無断使用
- 過度な専門用語の説明なし使用

## ✅ 品質管理

/todo: 文書公開前の共通チェック
- [ ] 誤字脱字の確認
- [ ] 表記ゆれの確認
- [ ] 名称統一の確認
- [ ] セキュリティ確認

/fix: 品質スコア95/100未満の場合は自動修正
- 重複メタデータの削除
- 構文エラーの修正
- フォーマット不整合の修正

## 🤖 カスタムコマンド

主要コマンドと用途：
- `/define-series`: 新シリーズ定義の作成（記事作成は含まない）
- `/create-article`: 個別記事の作成（シリーズ定義必須）
- `/update-series`: 既存シリーズの更新
- `/generate-diagrams`: Mermaid図の一括生成
- `/post-qiita`: Qiitaへの記事投稿
- `/quality-check`: 品質チェック実行

## 📊 効率化指標

### 目標値と実現方法
- **トークン削減**: 25-35%
  - `/articles/shared-templates/` の共通要素を参照
  - 記事固有の内容のみを新規作成
  - 重複記述を避ける
- **作業時間削減**: 50-60%
  - カスタムコマンドによる自動化
  - 品質チェックの自動実行
- **品質スコア**: 95/100以上
  - `/quality-check` コマンドで自動評価
- **一貫性維持**: 90%以上
  - `/articles/personas/` のペルソナ設定を活用

# important-instruction-reminders

/fix: 以下のルールを常に適用
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files
- USE /articles/claude.md for ALL article creation tasks
- FOLLOW language rules: internal docs in English first, articles in Japanese
- CHECK /articles/claude.md before starting any article work
- MAINTAIN quality score above 95/100
- APPLY token optimization strategies from shared-templates

/todo: 各作業開始時の必須確認
- [ ] 不要なファイル作成をしていないか
- [ ] 既存ファイルの編集で対応できないか
- [ ] 正しい言語で文書を作成しているか
- [ ] 記事作成の場合は/articles/claude.mdを参照したか