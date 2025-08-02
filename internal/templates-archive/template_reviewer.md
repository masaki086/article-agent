**日付:** YYYY-MM-DD | **バージョン:** X.Y

# レビュワーテンプレート（ペルソナ参照形式）

このテンプレートは記事のレビューを行う AI 人格を、事前定義されたペルソナから選択・組み合わせして設定します。

## 使用方法

このテンプレートを以下のディレクトリにコピーして使用してください：

- `/articles/{ArticleName}/reviewer.md`
- `/articles/{SeriesName}/{ArticleName}/reviewer.md`

### reviewer ファイルの優先順位

- `/articles/{SeriesName}/{ArticleName}/reviewer.md`が存在しない場合は、`/articles/{ArticleName}/reviewer.md`を参照してください
- `/articles/{SeriesName}/{ArticleName}/reviewer.md`と`/articles/{ArticleName}/reviewer.md`の両方が存在する場合は`/articles/{ArticleName}/reviewer.md`のみを有効にしてください

## 🎭 ペルソナ参照設定

### 校正者（Proofreader）

```markdown
# 校正者ペルソナ: [ペルソナ ID]

参照ファイル: /personas/proofreaders/[ペルソナ ID].md

## カスタマイズ（必要に応じて）

- **この記事での重点項目**: [記事固有の重点項目]
- **特別な注意事項**: [この記事特有の注意点]
```

#### 利用可能な校正者ペルソナ

- `strict_grammarian` - 厳格な文法チェッカー
- `readability_expert` - 可読性専門家
- `technical_accuracy` - 技術精度チェッカー
- `consistency_checker` - 表記統一チェッカー

### レビュワー（Content Reviewer）

```markdown
# レビュワーペルソナ: [ペルソナ ID]

参照ファイル: /personas/reviewers/[ペルソナ ID].md

## カスタマイズ（必要に応じて）

- **この記事での評価観点**: [記事固有の評価観点]
- **特別な確認事項**: [この記事特有の確認事項]
```

#### 利用可能なレビュワーペルソナ

- `security_expert` - セキュリティ専門家
- `performance_specialist` - パフォーマンス専門家
- `code_reviewer` - コードレビュアー
- `technical_writer` - テクニカルライター
- `beginner_friendly` - 初心者視点レビュワー

### 読者ペルソナ（Reader Personas）

```markdown
# 読者ペルソナ 1: [ペルソナ ID]

参照ファイル: /personas/readers/[ペルソナ ID].md

# 読者ペルソナ 2: [ペルソナ ID]

参照ファイル: /personas/readers/[ペルソナ ID].md

# 読者ペルソナ 3: [ペルソナ ID]

参照ファイル: /personas/readers/[ペルソナ ID].md
```

#### 利用可能な読者ペルソナ

- `beginner_engineer` - 初心者エンジニア
- `intermediate_engineer` - 中級エンジニア
- `senior_engineer` - 上級エンジニア
- `non_technical` - 非技術職
- `manager` - 技術管理職
- `designer` - デザイナー
- `startup_founder` - スタートアップ創業者

## 📋 レビュー設定テンプレート

### 基本設定（コピー用）

```markdown
## レビュワー設定

### 校正者

ペルソナ ID: [選択したペルソナ ID]
参照ファイル: /personas/proofreaders/[ペルソナ ID].md

### レビュワー

ペルソナ ID: [選択したペルソナ ID]
参照ファイル: /personas/reviewers/[ペルソナ ID].md

### 読者ペルソナ

1. ペルソナ ID: [選択したペルソナ ID]
   参照ファイル: /personas/readers/[ペルソナ ID].md
2. ペルソナ ID: [選択したペルソナ ID]
   参照ファイル: /personas/readers/[ペルソナ ID].md
3. ペルソナ ID: [選択したペルソナ ID]
   参照ファイル: /personas/readers/[ペルソナ ID].md
```

## 🎯 記事タイプ別推奨組み合わせ

### 初心者向けチュートリアル

```markdown
校正者: readability_expert
レビュワー: beginner_friendly  
読者: beginner_engineer, non_technical, intermediate_engineer
```

### セキュリティガイド

```markdown
校正者: technical_accuracy
レビュワー: security_expert
読者: intermediate_engineer, senior_engineer, manager
```

### パフォーマンス最適化記事

```markdown
校正者: technical_accuracy
レビュワー: performance_specialist
読者: intermediate_engineer, senior_engineer
```

### コードレビュー解説

```markdown
校正者: consistency_checker  
レビュワー: code_reviewer
読者: beginner_engineer, intermediate_engineer
```

## 🔧 カスタマイズガイド

### 記事固有の調整

各ペルソナは汎用的に設計されていますが、記事の特性に応じて以下をカスタマイズできます：

#### 校正者のカスタマイズ

- **重点項目**: この記事で特に注意すべき言語的側面
- **専門用語**: 記事固有の専門用語の扱い方
- **表記規則**: 記事で使用する特別な表記規則

#### レビュワーのカスタマイズ

- **評価観点**: この記事で特に重視すべき技術的観点
- **確認事項**: 記事固有の技術的確認事項
- **代替案**: 記事で紹介する手法の代替案検討

#### 読者ペルソナのカスタマイズ

- **前提知識**: この記事を読む読者の想定前提知識
- **到達目標**: 記事を読んだ後の読者の到達目標
- **実践環境**: 読者が実際に試す環境の想定

## 📝 レビュー実施時の参照方法

### ペルソナファイルの確認手順

1. 指定されたペルソナファイルを開く
2. そのペルソナの特性・観点を理解する
3. 記事固有のカスタマイズ項目を確認する
4. ペルソナの視点で記事をレビューする

### フィードバック記録形式

```markdown
## レビュー結果

### 校正者: [ペルソナ名]（[ペルソナ ID]）

[ペルソナファイルの特性に基づいた校正結果]

### レビュワー: [ペルソナ名]（[ペルソナ ID]）

[ペルソナファイルの観点に基づいたレビュー結果]

### 読者視点

#### [読者ペルソナ 1 名]（[ペルソナ ID]）

[ペルソナファイルの読書傾向に基づいたコメント]

#### [読者ペルソナ 2 名]（[ペルソナ ID]）

[ペルソナファイルの読書傾向に基づいたコメント]

#### [読者ペルソナ 3 名]（[ペルソナ ID]）

[ペルソナファイルの読書傾向に基づいたコメント]
```

## 💡 ペルソナ管理のメリット

### 再利用性

- 一度作成したペルソナを複数の記事で再利用
- 組み合わせを変えることで多様なレビュー体制を構築

### 一貫性

- ペルソナの特性が明確に定義されているため一貫したレビュー
- 複数の記事間でレビュー品質の標準化

### 効率性

- ペルソナファイルを参照するだけで詳細な設定が完了
- 新しいペルソナの追加・既存ペルソナの改善が容易

### 拡張性

- 新しい専門分野や読者層に応じてペルソナを追加
- プロジェクトの成長に合わせてペルソナライブラリを拡充
