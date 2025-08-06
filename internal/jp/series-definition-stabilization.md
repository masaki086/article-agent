**日付:** 2025-08-06 | **バージョン:** 1.0

# シリーズ定義コマンド安定化ガイド

## 問題分析

### /define-seriesコマンドの現在の問題点

1. **コンテキスト汚染**
   - 長い会話がコマンドの動作に影響
   - 以前の議論がシリーズ定義に影響
   - 会話履歴によってコマンド出力が変化

2. **ファイル作成の不整合**
   - 定義ファイルの作成をスキップすることがある
   - 予測不能に記事執筆に直接進む
   - ファイル作成がコンテキスト量に依存

3. **自動実行チェーン**
   - シリーズ定義→記事作成が自動的に発生
   - フェーズ間に明確な区切りがない
   - ワークフロー進行の制御が困難

## 解決策とベストプラクティス

### 1. コンテキスト分離戦略

#### 実行前のリセット
```bash
# /define-series実行前に検討:
/reset  # 会話コンテキストをクリア
```

#### 明示的なフェーズ分離
```markdown
## フェーズ1: シリーズ定義のみ
- /define-seriesを実行
- シリーズ構造ファイルを作成
- 定義フェーズ後に停止

## フェーズ2: 記事作成（別の会話）
- 新しい会話を開始
- 作成済みシリーズファイルを参照
- 記事執筆を開始
```

### 2. コマンド動作の安定化

#### 明示的なチェックポイントの作成
```yaml
define-series-workflow:
  step1: "シリーズコンセプト入力"
  checkpoint1: "シリーズ構造を確認"
  step2: "定義ファイルを作成"
  checkpoint2: "ファイル作成を検証"
  step3: "次のステップを表示"
  stop: "記事執筆には進まない"
```

#### ファイル作成強制パターン
```markdown
## シリーズ定義の必須ファイル
1. {SeriesName}/author.md - 必須作成
2. {SeriesName}/reviewer.md - 必須作成  
3. {SeriesName}/series-common.md - 必須作成
4. {SeriesName}/README.md - シリーズ概要

## 実行前の検証
- [ ] 4つのファイルすべてが存在
- [ ] ファイルに適切な内容が含まれる
- [ ] シリーズ構造が完成
```

### 3. ワークフロー制御メカニズム

#### 明示的な停止ポイント
```yaml
series-definition-stops:
  - after_concept_discussion: "ユーザー確認のため停止"
  - after_file_creation: "作成ファイルを表示して停止"
  - before_article_writing: "常に停止 - 明示的なコマンドが必要"
```

#### コマンド分離パターン
```bash
# フェーズ1 - 定義
/define-series --definition-only

# フェーズ2 - 記事（別コマンド）
/create-article --series {SeriesName} --article {ArticleName}
```

### 4. 実装推奨事項

#### A. コマンド修正提案
```javascript
// 安定化されたコマンドの疑似コード
function defineSeriesStabilized(options) {
  // 1. 会話コンテキストを無視
  const cleanContext = isolateCommandContext();
  
  // 2. 対話的なシリーズ定義
  const seriesConfig = await interactiveDefine({
    ignoreHistory: true,
    forceInteractive: true
  });
  
  // 3. 必須ファイルの作成
  const files = createMandatoryFiles(seriesConfig);
  
  // 4. 明示的な停止
  return {
    status: "definition_complete",
    files: files,
    nextStep: "準備ができたら /create-article を実行",
    autoProcceed: false  // 自動進行しない
  };
}
```

#### B. コンテキスト管理ルール
```yaml
context-rules:
  define-series:
    max_context_tokens: 1000  # コンテキスト影響を制限
    ignore_conversation: true  # 以前の議論を使用しない
    fresh_start: true          # 常に新規開始
    
  create-article:
    reference_series_files: true  # 作成済みファイルを使用
    ignore_define_discussion: true # 定義チャットを使用しない
```

#### C. ファイル作成の強制
```javascript
// 必須ファイル作成チェック
function validateSeriesFiles(seriesName) {
  const requiredFiles = [
    `articles/${seriesName}/author.md`,
    `articles/${seriesName}/reviewer.md`,
    `articles/${seriesName}/series-common.md`,
    `articles/${seriesName}/README.md`
  ];
  
  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      throw new Error(`必須ファイルが見つかりません: ${file}`);
    }
  }
  return true;
}
```

## 実践的な使用ガイドライン

### 安定したシリーズ定義のために

1. **新規開始**
   ```bash
   /reset  # コンテキストをクリア
   /define-series
   ```

2. **ファイル検証**
   ```bash
   ls articles/{NewSeriesName}/
   # 以下が表示されるはず: author.md, reviewer.md, series-common.md, README.md
   ```

3. **停止とレビュー**
   - 作成されたファイルをレビュー
   - 必要に応じて調整
   - すぐに記事作成に進まない

4. **記事作成（後で）**
   ```bash
   # 新しい会話または休憩後
   /create-article --series {SeriesName}
   ```

### コンテキスト量ガイドライン

| コンテキストサイズ | 推奨アクション |
|-------------------|---------------|
| < 5K トークン | 通常通り進行可能 |
| 5K-10K トークン | /reset を検討 |
| > 10K トークン | /define-series前に必ず /reset |

### ワークフロー分離パターン

```mermaid
graph TD
    A[開始] --> B[必要に応じて /reset]
    B --> C[/define-series]
    C --> D[ファイル作成]
    D --> E[停止]
    E --> F[ファイルレビュー]
    F --> G{ファイルOK?}
    G -->|いいえ| H[手動編集]
    G -->|はい| I[新セッション]
    I --> J[/create-article]
```

## 解決策のまとめ

1. **コンテキスト分離**: /define-series前に /reset を使用
2. **ファイル作成**: 必須ファイルの作成を強制
3. **ワークフロー制御**: フェーズ間に明示的な停止
4. **コマンド分離**: 定義と作成を分離
5. **検証**: 進行前にファイルをチェック

## 実装優先度

1. **即時**: ワークフロー分離の文書化
2. **短期**: 検証チェックの追加
3. **長期**: コマンド動作の修正

このアプローチにより、会話のコンテキストや長さに関係なく、一貫した予測可能な動作が保証されます。