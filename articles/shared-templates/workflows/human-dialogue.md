# Human-Driven Article Format
## 人間主導型記事作成フォーマット

### 概要
このフォーマットは、人間の経験・主張・知見を中心とした記事作成方法です。
AIは対話を通じて人間の考えを引き出し、それを裏付ける情報を追加して、読みやすい記事に仕上げます。

### 3段階のプロセス

#### Phase 1: 対話型リソース収集
**目的**: 人間の主張・経験・知見を構造化して保存

**収集する情報**:
- 主張（Main Claim）
- 背景・コンテキスト
- 具体的な経験・事例
- 課題と解決策
- 学んだこと・気づき
- 読者に伝えたいメッセージ

**保存形式**: `/articles/resources/{topic}/human-insights.json`

```json
{
  "topic": "記事のトピック",
  "mainClaim": "中心となる主張",
  "background": "背景情報",
  "experiences": [
    {
      "situation": "状況",
      "challenge": "課題",
      "solution": "解決策",
      "result": "結果",
      "learning": "学び"
    }
  ],
  "keyInsights": ["重要な気づき1", "重要な気づき2"],
  "targetAudience": "想定読者",
  "message": "読者へのメッセージ"
}
```

#### Phase 2: リサーチと補完
**目的**: 主張を裏付ける外部情報の収集と整理

**リサーチ内容**:
- 関連する統計データ
- 業界トレンド
- 専門家の意見
- 類似事例
- 学術的な裏付け

**保存形式**: `/articles/resources/{topic}/research-data.json`

```json
{
  "supportingData": [
    {
      "type": "statistics|trend|expert|case|academic",
      "source": "情報源のURL",
      "title": "タイトル",
      "relevantQuote": "関連する引用",
      "summary": "要約",
      "credibility": "high|medium|low",
      "relevanceToMain": "主張との関連性"
    }
  ],
  "contradictingViews": [
    {
      "source": "URL",
      "viewpoint": "異なる視点",
      "response": "それに対する考察"
    }
  ]
}
```

#### Phase 3: 記事生成
**目的**: リソースを基に読みやすい記事を生成

**記事構成**:
```markdown
# {タイトル}

## はじめに
- フック（読者の興味を引く導入）
- 記事の概要

## 私の経験から
- 具体的なエピソード
- 直面した課題
- 試行錯誤のプロセス

## データが示すもの
- 外部情報による裏付け
- [統計データ](URL)
- [専門家の見解](URL)

## 実践的なアプローチ
- 具体的な手法
- ステップバイステップガイド
- 注意点

## 異なる視点
- 別のアプローチ
- 批判的な意見への対応

## まとめ
- 主要なポイントの再確認
- 読者へのアクションアイテム
- 今後の展望
```

### カスタムコマンド仕様

#### 1. `/collect-human-insights`
対話形式で人間の知見を収集し、構造化してリソースファイルに保存

**フロー**:
1. トピックの確認
2. 質問による情報収集
3. 内容の確認と修正
4. JSONファイルとして保存

#### 2. `/research-and-enhance`
保存されたリソースを基に、関連情報をリサーチして補完

**フロー**:
1. human-insights.jsonの読み込み
2. 主張に関連するキーワード抽出
3. WebSearchによる情報収集
4. 信頼性の評価
5. research-data.jsonとして保存

#### 3. `/generate-from-resources`
リソースファイルを基に記事を生成

**フロー**:
1. 両リソースファイルの読み込み
2. 記事構成の決定
3. セクションごとの執筆
4. リンクの適切な配置
5. 最終記事の生成

#### 4. `/create-human-driven-article`
上記3つのコマンドを統合した完全なワークフロー

### 既存システムとの統合

**共通点**:
- Markdownフォーマット
- 品質チェック機能
- Qiita投稿機能

**相違点**:
- AIではなく人間が主体
- 事前のシリーズ定義不要
- 外部リンクを積極活用
- 対話型のプロセス

### ディレクトリ構造
```
articles/
├── human-driven-format.md  # このファイル
├── resources/              # 人間主導型記事のリソース
│   └── {topic}/
│       ├── human-insights.json
│       └── research-data.json
└── human-driven/          # 生成された記事
    └── {topic}/
        └── article.md
```

### 品質基準

**必須要件**:
- 人間の主張が明確に伝わる
- 外部情報による適切な裏付け
- 読みやすい構成
- 実践的な内容

**評価指標**:
- 主張の明確さ: 30点
- 裏付けの充実度: 25点
- 構成の論理性: 25点
- 実用性: 20点

### 使用例

```bash
# 完全なワークフローの実行
/create-human-driven-article

# 個別ステップの実行
/collect-human-insights --topic "効率的なコードレビューの実践"
/research-and-enhance --topic "効率的なコードレビューの実践"
/generate-from-resources --topic "効率的なコードレビューの実践"
```