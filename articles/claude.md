**日付:** 2025-08-06 | **バージョン:** 3.0

# 記事作成専用ガイドライン

このドキュメントは、技術記事作成に特化した詳細ルールを定義します。
**注意**: 全体ルールは `/CLAUDE.md` を参照してください。

## 🚀 最適化記事作成ワークフロー

### Phase 1: シリーズ定義（1回のみ）

#### ⚠️ コンテキスト管理
/fix: シリーズ定義前の必須処理
- コンテキストが5K token以上の場合 → `/reset` 実行
- 長い会話の後では必ず `/reset` を実行
- 前の会話の影響を排除してクリーンな状態で開始

/todo: シリーズ作成時のタスク
- [ ] コンテキストサイズを確認（5K token超なら `/reset`）
- [ ] `/define-series` コマンドを実行
- [ ] 対話的にシリーズ設計を完了
- [ ] **必須ファイルの作成を確認** ⚠️
  - [ ] author.md が作成されている
  - [ ] reviewer.md が作成されている
  - [ ] series-common.md が作成されている
  - [ ] README.md が作成されている
- [ ] 共有テンプレートの確認
- [ ] ペルソナ設定の完了
- [ ] **ここで必ず停止** - 記事執筆には進まない

#### 共有テンプレート参照
- `/articles/shared-templates/series-common.md`: 共通キャラクター設定
- `/articles/shared-templates/english-templates.md`: 英語版テンプレート統合
- `/articles/shared-templates/optimized-format.md`: トークン効率化フォーマット
- `/articles/shared-templates/workflows/`: 生成ワークフロー定義

#### シリーズ固有設定（必須作成）
- `author.md`: 執筆者ペルソナ（/articles/personas/individuals/参照）✅ 必須
- `reviewer.md`: レビュー体制設定 ✅ 必須
- `series-common.md`: シリーズ共通設定 ✅ 必須
- `README.md`: シリーズ概要 ✅ 必須
- `format.md`: シリーズ固有の文体調整（オプション）

#### ワークフロー分離ルール（v2.0 - 2025-08-06更新）
```yaml
workflow-separation:
  phase1-definition:
    command: /define-series
    saves_to: /articles/shared-templates/series/{SeriesName}/
    creates:
      - personas-roles.md  # 統合人格定義
      - format.md         # フォーマット定義
      - README.md         # シリーズ概要
    stops_after: ファイル作成完了
    
  phase2-article:
    command: /create-article --series {SeriesName}
    references: /articles/shared-templates/series/{SeriesName}/
    options:
      - template: technical/tutorial/discussion
      - custom-format: true/false
      - custom-persona: {persona_id}
      - workflow: ai-persona/human-dialogue/hybrid
    saves_to: /articles/series/{SeriesName}/{ArticleName}/
```

### Phase 2: 記事作成フェーズ

#### ワークフロー選択
/fix: 記事作成時のワークフロー自動判定
- シリーズ定義がある場合 → ai-persona
- 人間の知見をベースにする場合 → human-dialogue
- 両方を組み合わせる場合 → hybrid
- 詳細: `/articles/shared-templates/workflows/generation-methods.md`

#### A. 記事構成設計

/fix: 記事構成時の必須処理
- optimized-format.mdをベースに構造作成
- series-common.mdから共通要素を自動参照
- シリーズ進捗を反映した目次生成
- 各セクションの内容案を提示

/todo: 構成設計チェックリスト
- [ ] 目次が論理的な流れになっているか
- [ ] 前後記事との関連性が明確か
- [ ] 読者の学習曲線を考慮しているか

#### B. 記事執筆

/fix: 執筆時の自動最適化
- 記事固有の技術内容のみを記述
- 共通パターンは参照形式で効率化
- english-templates.mdから適切なテンプレート選択
- セクション完成時は自動保存

/todo: 執筆時チェック
- [ ] コード例にコメントを追加
- [ ] エラー処理を記載
- [ ] バージョン情報を明記
- [ ] 実行環境を明記

#### C. レビューフェーズ

/fix: 自動レビュー実行
- reviewer.mdのペルソナによる評価
- 校正者・レビュワー・読者の段階的チェック
- レビュー結果をreviews/フォルダに保存
- シリーズ全体の一貫性確認

/todo: レビュー確認項目
- [ ] 技術的正確性の確認
- [ ] 文法・誤字脱字チェック
- [ ] 読みやすさの評価
- [ ] 学習効果の検証

#### D. 画像生成フェーズ

/fix: 画像生成の自動処理
- Mermaid図: .mmdファイル → PNG自動変換
- AI画像: プロンプト生成 → 自動タグ付け
- Altテキスト: アクセシビリティ対応で自動生成
- 保存先: images/またはdiagrams/に自動分類

#### E. 記事公開フェーズ

/fix: 公開前の自動処理
- 品質スコア95/100以上を確認
- Reader Reviewセクションを記事末尾に追加
- drafts/ → published/への移動
- 日付付きアーカイブ作成（例: article_20250806.md）

/todo: 公開前最終チェック
- [ ] 品質スコア95以上を達成
- [ ] 全画像が正しくリンク
- [ ] メタデータが正確
- [ ] AI生成の明記

## 📊 トークン効率化戦略

/fix: トークン削減の自動適用
- 共通要素の参照化で25-35%削減
- 必要な要素のみ読み込み
- 記事固有内容のみに集中
- 前後記事との関係性を効率管理

### 効率化のポイント
- **重複排除**: shared-templatesの活用
- **モジュラー設計**: 必要時のみ読み込み
- **段階的作成**: フェーズごとに必要な情報のみ
- **シリーズ連携**: 共通設定の一元管理

## ✅ 記事品質チェックリスト

### 技術記事の必須項目

/todo: 技術内容チェック
- [ ] タイトルが検索しやすく具体的
- [ ] 導入部で記事の価値が明確
- [ ] コード例にコメントが適切
- [ ] エラー処理やエッジケース記載
- [ ] 実行環境・バージョン情報明記
- [ ] 参考リンク・関連記事リンク

### AI生成記事の確認

/todo: AI記事特有チェック
- [ ] AI生成であることを明記
- [ ] 生成時の前提条件を記載
- [ ] 人間レビューの箇所を明確化

### Markdownコードブロックのルール

/fix: コードブロック記法の自動修正
- ネストしたコードブロックを検出 → インデント形式に変換
- 言語指定がない場合 → 自動推定して追加
- ファイル構造表示 → tree形式またはBash指定

/todo: コードブロック確認
- [ ] ネストなしを確認
- [ ] 言語指定を確認
- [ ] インデント統一を確認

## 📁 ディレクトリ構造と命名

### 記事関連の命名規則

/fix: 命名規則違反を検出したら自動修正提案
- **シリーズ名**: 英語のみ、CamelCase（例: `AIPersonaRoundtable`）
  - SeriesNameには「Series」を含めない
- **記事名**: 数字プレフィックス付き英語（例: `1-AIHumanDistanceAnalysis`）
  - ArticleNameには「article」を含めない
- **テンプレート**: shared-templates配下のファイル名には「template」を含めない

### 記事ファイル配置（v2.0構造）
```
articles/
├── shared-templates/
│   ├── series/{SeriesName}/    # シリーズ定義
│   │   ├── personas-roles.md   # 統合人格定義
│   │   ├── format.md           # フォーマット定義
│   │   └── README.md           # シリーズ概要
│   ├── base/                   # 基本テンプレート
│   ├── patterns/               # パターンテンプレート
│   └── optimization/           # 最適化ファイル
└── series/{SeriesName}/        # 実際の記事
    └── {N}-{ArticleName}/
        ├── custom/              # カスタム定義（オプション）
        ├── drafts/
        │   ├── pages/          # 記事本文
        │   ├── images/         # 画像ファイル
        │   └── diagrams/       # 図表ファイル
        ├── published/          # 公開済み
        └── reviews/            # レビュー結果
```

/fix: ディレクトリ構造の自動生成
- シリーズ作成時に全構造を生成
- 番号プレフィックスを自動付与
- 必要なサブディレクトリを作成

## 🎯 品質スコアリング

### 評価基準（各100点満点）

/fix: スコアリングの自動実行
- **フォーマット一貫性**: メタデータ、Markdown構文、コードブロック、表示一貫性
- **コンテンツ品質**: 文法、用語統一、論理フロー、シリーズ一貫性
- **技術的正確性**: コード正確性、型安全性、バージョン正確性、ベストプラクティス

### 目標スコア
- **95/100以上**: 公開可能
- **90-94**: 軽微な修正必要
- **80-89**: 要改善
- **80未満**: 大幅な修正必要

## 📝 Reader Reviewセクション例

```markdown
## Reader Review

**校正者評価**: 文法正確、誤字なし、読みやすい構成
**技術レビュー**: 実装可能、ベストプラクティス準拠
**初心者視点**: 段階的説明で理解しやすい
**実務者視点**: 実用的なコード例で即活用可能
```

# important-article-reminders

/fix: 記事作成時の必須ルール
- ALWAYS use shared-templates for token efficiency
- MAINTAIN series consistency through series-common.md
- ACHIEVE quality score 95/100 or higher
- FOLLOW the 5-phase workflow strictly
- USE personas for consistent voice
- APPLY Markdown rules correctly

/todo: 記事完成時の最終確認
- [ ] 品質スコア95以上
- [ ] 全フェーズ完了
- [ ] ペルソナ一貫性確認
- [ ] トークン最適化確認