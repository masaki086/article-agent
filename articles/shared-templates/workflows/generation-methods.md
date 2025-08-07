# Article Generation Methods
## 記事生成ワークフロー選択ガイド

### 概要
記事作成時に選択可能な3つのワークフローを定義します。
目的や素材に応じて最適な方法を選択してください。

## 生成方法の種類

### 1. AI Persona Generation（AI人格生成）
**特徴**: 設定したペルソナがAIとして記事を執筆
**用途**: 技術解説、チュートリアル、概念説明など

```yaml
workflow:
  type: ai-persona
  command: /create-article --workflow ai-persona
  requires:
    - series definition
    - persona settings (author.md, reviewer.md)
    - series-common.md
  process:
    - AI personas generate content
    - Multiple personas review
    - Quality scoring
```

### 2. Human Dialogue（人間対話形式）
**特徴**: 人間の経験・知見を対話で収集し、裏付け情報を追加
**用途**: 事例紹介、経験談、実践レポートなど

```yaml
workflow:
  type: human-dialogue
  command: /create-article --workflow human-dialogue
  requires:
    - topic selection
    - human insights (interactive collection)
  process:
    - Collect human experiences (/collect-human)
    - Research supporting data (/research-human)
    - Generate article (/generate-human)
  no-persona-required: true
```

### 3. Hybrid Generation（ハイブリッド生成）
**特徴**: 人間の知見にAIペルソナの分析を追加
**用途**: 深い分析が必要な技術記事、比較検討記事など

```yaml
workflow:
  type: hybrid
  command: /create-article --workflow hybrid
  requires:
    - human insights
    - ai personas for analysis
  process:
    - Collect human insights
    - AI personas analyze and enhance
    - Generate comprehensive article
```

## ワークフロー選択フロー

```mermaid
graph TD
    A[記事作成開始] --> B{素材の種類は？}
    B -->|技術概念・解説| C[AI Persona]
    B -->|経験・事例| D[Human Dialogue]
    B -->|経験＋深い分析| E[Hybrid]
    
    C --> F[/create-article --workflow ai-persona]
    D --> G[/create-article --workflow human-dialogue]
    E --> H[/create-article --workflow hybrid]
```

## 各ワークフローの詳細

### AI Persona Generation
参照: `/articles/claude.md`
- 複数のAIペルソナによる執筆
- 自動品質チェック
- シリーズ一貫性の維持

### Human Dialogue
参照: `/articles/shared-templates/workflows/human-dialogue.md`
- 対話的な情報収集
- 外部リサーチによる裏付け
- 人間の声を活かした記事

### Hybrid Generation
- 両方の良さを組み合わせ
- 人間の経験＋AIの分析力
- 最も包括的な記事生成

## コマンド使用例

```bash
# AI人格による記事生成（従来型）
/create-article --series "TechTutorial" --workflow ai-persona

# 人間対話形式での記事生成
/create-article --topic "クラウド選定基準" --workflow human-dialogue

# ハイブリッド生成
/create-article --topic "AI開発の実践" --workflow hybrid

# ワークフローを指定しない場合はインタラクティブに選択
/create-article
> Which workflow would you like to use?
> 1. AI Persona Generation
> 2. Human Dialogue
> 3. Hybrid Generation
```

## 選択基準

| 要素 | AI Persona | Human Dialogue | Hybrid |
|------|------------|----------------|--------|
| 執筆速度 | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| 実体験の反映 | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 技術的深さ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 一貫性 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| リサーチ量 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

## ディレクトリ構造

```
articles/
├── shared-templates/
│   └── workflows/
│       ├── generation-methods.md  # このファイル
│       └── human-dialogue.md      # 人間対話形式の詳細
├── series/                        # AI Persona生成の記事
├── human-driven/                  # Human Dialogue生成の記事
└── hybrid/                        # Hybrid生成の記事
```