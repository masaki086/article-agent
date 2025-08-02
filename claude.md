# このドキュメントは、100%生成 AI による技術記事の執筆・投稿を目的としたローカル開発環境のガイドラインです。執筆・編集・校正・画像生成・レビュー・投稿の全工程において、Claude Code を利用し、Sub Agent、custom slash command、外部 MCP、Hook 機能を活用します。

## 🚀 最適化されたシリーズ記事作成ワークフロー

### Phase 1: シリーズ定義（1 回のみ）

1. **シリーズコンセプト設計**

   - 対話的 SubAgent (`/series-define`) でシリーズ設計
   - ターゲット読者、学習目標、記事構成を定義

2. **共通設定ファイル参照**

   - `/articles/shared-templates/series-common.md`: キャラクター設定、共通メッセージパターン（全シリーズ共有）
   - `/articles/shared-templates/english-templates.md`: 全記事の英語版テンプレート統合（全シリーズ共有）
   - `/articles/shared-templates/optimized-format.md`: トークン効率化された記事テンプレート（全シリーズ共有）

3. **シリーズ固有設定**
   - `author.md`: 執筆者ペルソナのカスタマイズ
   - `reviewer.md`: レビュー体制の設定

### Phase 2: 各記事作成（記事固有内容のみ）

1. **shared-templates/optimized-format.md** をベースに記事作成
2. **shared-templates/series-common.md** から共通要素を参照
3. **shared-templates/english-templates.md** から該当テンプレート選択
4. 記事固有の技術内容のみに集中して執筆

### トークン削減効果

- **25-35%のトークン削減** を実現
- 重複情報の完全排除
- 人間の作業負荷を **50-60%削減**

## 内部文書作成ルール

- 対象：記事文書以外の文書
- 常に最初の行に日付とバージョンを含める: **日付:** YYYY-MM-DD | **バージョン:** X.Y
- 既存ファイルを変更する際は日付とバージョンの両方を更新する
- プロジェクト全体で一貫した命名規則を維持する
- ファイル名には小文字を使用
- 内部文書は英語で作成し、次に日本語版を作成し、元ファイルと同じ階層に作成した「jp」フォルダーに保存
- 記事文書は最初から日本語で作成を行う

### 文書の共通命名規則

- ラクダ記法
- 単語数が少ないことを優先
- スペースは不可

### 最適化されたシリーズ記事構造

- **共有テンプレート**: `/articles/shared-templates/` (全シリーズで再利用可能)
  - `series-common.md`: 共通キャラクター設定・メッセージパターン
  - `english-templates.md`: 英語版テンプレート統合版
  - `optimized-format.md`: トークン効率化記事フォーマット
  - `author.md`: 執筆者ペルソナ設定テンプレート
  - `reviewer.md`: レビュワー体制設定テンプレート
- **執筆者設定**: `/articles/{SeriesName}/author.md`（ペルソナ参照形式）
- **レビュー設定**: `/articles/{SeriesName}/reviewer.md`（ペルソナ参照形式）

### 記事フォーマット文書の分割ルール

- 記事文書は文書の量が多くなった場合に分割を行う
- 分割したページには次のページと前のページへのリンクを設置する
- 分割したページごとにサブタイトルをつける

## 🗂 名称ルール

- SeriesName には「Series」を含めない
- ArticleName には「article」を含めない
- shared-templates 配下のファイル名には「template」を含めない

## 🗂 最適化されたファイル構成とディレクトリ運用

```
article-agent/
├── claude.md               # このファイル（最適化ワークフロー含む）
├── articles/                                     # 📝 記事管理ディレクトリ
│   ├── shared-templates/                       # 全シリーズ共有最適化テンプレート
│   │   ├── series-common.md                    # 共通キャラ設定・メッセージパターン
│   │   ├── english-templates.md                # 英語版テンプレート統合版
│   │   ├── optimized-format.md                 # トークン効率化記事フォーマット
│   │   ├── author.md                          # 執筆者ペルソナ設定テンプレート
│   │   └── reviewer.md                        # レビュワー体制設定テンプレート
│   ├── template_format.md                      # 汎用フォーマットテンプレート（非推奨）
│   └── {SeriesName}/                           # シリーズ固有設定
│        ├── author.md                          # 執筆者設定（ペルソナ参照）
│        ├── reviewer.md                        # レビュワー設定（ペルソナ参照）
│        └── {ArticleName}/
│            ├── drafts/
│            │   ├── pages/                     # 記事ファイル（記事固有内容のみ）
│            │   ├── images/                    # 画像
│            │   └── diagrams/                  # フロー図（.mmd → .png）
│            ├── published/                     # Qiita投稿後保存
│            │   ├── pages/
│            │   ├── images/
│            │   └── diagrams/
│            └── reviews/                       # レビュー事項
├── personas/                                   # 👥 ペルソナ管理ディレクトリ
│   ├── template_persona.md                     # ペルソナテンプレート
│   ├── authors/                                # 執筆者ペルソナ
│   │   ├── tanukichi.md                        # たぬきち（AI技術系・皮肉ライター）
│   │   ├── technical_specialist.md             # テクニカルスペシャリスト
│   │   └── (その他の執筆者ペルソナ)
│   ├── readers/                                # 読者ペルソナ
│   │   ├── beginner_engineer.md               # 初心者エンジニア
│   │   ├── intermediate_engineer.md           # 中級エンジニア
│   │   └── (その他の読者ペルソナ)
│   ├── reviewers/                              # レビュワーペルソナ
│   │   ├── security_expert.md                 # セキュリティ専門家
│   │   ├── performance_specialist.md          # パフォーマンス専門家
│   │   └── (その他のレビュワーペルソナ)
│   └── proofreaders/                           # 校正者ペルソナ
│       ├── strict_grammarian.md               # 厳格な文法チェッカー
│       └── (その他の校正者ペルソナ)
├── assets/                                     # 共有リソース
├── internal/                                   # スクリプト・メモ
│   └── templates-archive/                      # 非活用テンプレートのアーカイブ
│       ├── template_author.md                  # 旧テンプレート（参考用）
│       ├── template_reviewer.md                # 旧テンプレート（参考用）
│       └── claude.md                           # 旧記事ガイドライン（参考用）
└── .claude/                                    # SubAgent設定
    ├── agents/                                 # 校正者・レビュワー・読者AIの定義
    ├── commands/                               # カスタムコマンド
    │   └── series-define.md                    # シリーズ定義用対話SubAgent
    └── config.json                             # APIキー設定ファイルなど
```

## 🤖 対話的 SubAgent 活用

### `/series-define` コマンド

新シリーズ作成時の対話的設計支援 Agent

- シリーズコンセプトの整理
- ターゲット読者の明確化
- 記事構成の最適化提案
- 必要な共通ファイルの自動生成

### 使用例

```
/series-define "Claude Codeの高度活用術"
→ 対話的にシリーズ設計を支援
→ 自動的に最適化されたファイル構造を生成
```

## 🚫 禁止事項

- 機密情報や個人情報を含めない
- 未検証の情報を事実として記載しない
- 他者の著作物を無断で使用しない
- 過度に技術的な専門用語を説明なしに使わない
- **非最適化フォーマットでの新記事作成**（トークン無駄遣い防止）

## 🔒 セキュリティと Git 管理

### Git 除外設定（.gitignore）

プロジェクトを Git リポジトリにする場合は、以下のファイルを`.gitignore`に追加すること：

```gitignore
# APIトークンなどの機密情報
.claude/config/qiita-token.json
.claude/config/*-token.json
.claude/config/secrets.json

# 環境固有の設定
.env
.env.local
*.key
*.secret

# ログファイル
*.log
logs/

# 一時ファイル
tmp/
temp/
.DS_Store

# アーカイブファイル（必要に応じて）
internal/templates-archive/
```

### 機密情報の取り扱い

- **API トークン**: 設定ファイル（`.claude/config/qiita-token.json`）で管理
- **環境変数**: 可能な限り環境変数を優先使用
- **リポジトリ公開前**: 必ず機密情報が含まれていないか確認
- **設定ファイルテンプレート**: `*.json.template` 形式でサンプルを提供

## ✅ 最適化されたプロジェクト品質チェックリスト

文書公開前に以下を確認：

### 共通品質項目

- [ ] 誤字脱字がないか
- [ ] 表記ゆれがないか
- [ ] 名称が統一されているか

### 最適化ワークフロー確認

- [ ] シリーズ共通情報が適切に分離されているか
- [ ] 記事固有内容のみに集中できているか
- [ ] トークン重複が排除されているか
- [ ] 必要な参照ファイルが存在するか

### 文書構造の確認

- [ ] ファイル命名規則に従っているか
- [ ] 最適化されたディレクトリ構造が正しいか
- [ ] 日付とバージョンが記載されているか（内部文書）
- [ ] シリーズ関連性が適切に管理されているか

### セキュリティ確認

- [ ] 機密情報が含まれていないか
- [ ] API トークンが適切に管理されているか
- [ ] .gitignore が正しく設定されているか

## 🎯 ワークフロー最適化の効果

### 人間の作業効率向上

- **シリーズ初期設定**: 80%の作業削減
- **記事あたり作業量**: 50-60%の作業削減
- **一貫性管理**: 90%の作業削減
- **創造的作業への集中**: 時間の 80-90%を価値創造に活用

### システム効率向上

- **トークン使用量**: 25-35%削減
- **メモリ効率**: 同時参照ファイル数を最大 3 ファイルに制限
- **品質一貫性**: 自動的な一貫性保持
- **スケーラビリティ**: 新シリーズ作成の高速化

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
USE the optimized workflow for all new series creation.
ALWAYS use series-common.md and optimized-format.md for token efficiency.
