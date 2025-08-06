# 📝 記事作成ガイド（人間向け）

**最終更新:** 2025-08-06 | **バージョン:** 1.0

## 🎯 このガイドの目的

Claude Codeを使って効率的に技術記事を作成するための実践的なガイドです。
最新のワークフローに基づいて、トークン効率化を実現しながら高品質な記事を作成できます。

## 🚀 最新の改善点（2025-08-06）

### 1. ペルソナディレクトリの移動
- **旧:** `/personas/` → **新:** `/articles/personas/`
- より論理的な構造で記事作成に特化

### 2. コマンドの機能分離
- **`/define-series`**: シリーズ定義のみ（記事作成機能を削除）
- **`/create-article`**: 個別記事作成専用（新規作成）
- 各コマンドが単一責任を持つことで明確化

### 3. 英語テンプレートによるトークン圧縮
- シリーズ定義時に英語版テンプレートを自動生成
- 25-35%のトークン削減を実現
- `/articles/shared-templates/optimization/english-base.md`を活用

## 📖 基本的なワークフロー

### Step 1: 新しいシリーズを作成

```bash
# 1. コンテキストをクリーンにする
/reset

# 2. シリーズを定義（記事は作成しない）
/define-series "YourSeriesName"
```

**作成されるファイル:**
- `/articles/shared-templates/series/{SeriesName}/`
  - `personas-roles.md` - 統合人格定義
  - `format.md` - フォーマット定義
  - `README.md` - シリーズ概要

### Step 2: 個別記事を作成

```bash
# 1. 再度コンテキストをリセット（重要！）
/reset

# 2. 記事を作成
/create-article --series YourSeriesName
```

**対話的な選択肢:**
- 記事選択（シリーズ内のどの記事か）
- テンプレート選択（technical/tutorial/discussion）
- ペルソナ設定（デフォルトorカスタム）
- ワークフロー選択（interactive/automatic/resource-based）

## 🗂 ディレクトリ構造

```
article-agent/
├── CLAUDE.md                    # プロジェクト全体のルール
├── articles/
│   ├── claude.md               # 記事作成専用ルール
│   ├── personas/               # ペルソナ管理（新位置）
│   │   ├── individuals/       # 個別ペルソナ
│   │   ├── roles/             # 役割別パターン
│   │   └── contexts/          # 状況別パターン
│   ├── shared-templates/
│   │   ├── series/{Name}/     # シリーズ定義
│   │   ├── base/              # 基本テンプレート
│   │   ├── patterns/          # パターンテンプレート
│   │   └── optimization/      # 最適化ファイル
│   └── series/{Name}/         # 実際の記事
└── .claude/commands/          # カスタムコマンド定義
```

## 💡 実践的なヒント

### トークン効率化のコツ

1. **必ずリセットから始める**
   ```bash
   /reset  # 各作業の開始時に実行
   ```

2. **英語テンプレートを活用**
   - 自動的に生成される英語版を参照
   - 日本語記事でも内部処理は英語で効率化

3. **段階的な作成**
   - シリーズ定義と記事作成を分離
   - 一度に全部作らない

### 品質向上のポイント

1. **ペルソナの一貫性**
   - シリーズ全体で同じペルソナを使用
   - 記事ごとの声のトーンを統一

2. **テンプレート活用**
   - technical: 実装詳細重視
   - tutorial: ステップバイステップ
   - discussion: 分析と考察

3. **品質スコア確認**
   - 目標: 95/100以上
   - 自動チェックで品質保証

## 🔧 よくある使用例

### 例1: 技術解説シリーズ

```bash
# シリーズ作成
/reset
/define-series "DeepDiveTech"

# 記事1作成
/reset
/create-article --series DeepDiveTech --template technical

# 記事2作成
/reset
/create-article --series DeepDiveTech --template technical
```

### 例2: チュートリアルシリーズ

```bash
# シリーズ作成
/reset
/define-series "StepByStepGuide"

# 各記事を順番に作成
/reset
/create-article --series StepByStepGuide --template tutorial --article 1-GettingStarted

/reset
/create-article --series StepByStepGuide --template tutorial --article 2-BasicConcepts
```

### 例3: 既存リソースからの記事作成

```bash
# リソースベースの記事作成
/reset
/create-article --series YourSeries \
  --workflow resource-based \
  --resource /articles/resources/existing-content.md
```

## ⚠️ 注意事項

### 必須ルール

1. **コンテキスト管理**
   - 5000トークン超えたら必ず`/reset`
   - 新しい記事作成前も`/reset`

2. **シリーズ先行作成**
   - 必ず`/define-series`を先に実行
   - 記事作成は別コマンドで

3. **ファイル配置**
   - 自動生成されるパスを変更しない
   - カスタムファイルは指定の場所に

### トラブルシューティング

**Q: 記事作成がうまくいかない**
A: `/reset`してから再度実行

**Q: ペルソナが見つからない**
A: `/articles/personas/`配下を確認

**Q: テンプレートエラー**
A: `/articles/shared-templates/`の構造を確認

**Q: トークンオーバー**
A: 即座に`/reset`して分割作業

## 📊 効果測定

### 期待される改善効果

- **トークン使用量**: 25-35%削減
- **作業時間**: 50-60%削減
- **品質スコア**: 95/100以上維持
- **一貫性**: 90%以上達成

### 成功指標

- シリーズ内の記事の統一感
- 読者からの理解度向上
- 記事作成の再現性向上
- メンテナンスの容易さ

## 🎯 次のステップ

1. まず小さなシリーズから始める
2. テンプレートとペルソナに慣れる
3. 品質スコアを意識して改善
4. チームで共有して標準化

## 📚 参考資料

- `/CLAUDE.md` - プロジェクト全体ルール
- `/articles/claude.md` - 記事作成詳細ルール
- `/.claude/commands/` - コマンド定義
- `/articles/personas/` - ペルソナ設定

---

**このガイドはClaude Codeと共に進化します。最新の手法を反映して定期的に更新されます。**