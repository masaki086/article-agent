**日付:** 2025-08-02 | **バージョン:** 1.0

# レビュワー設定テンプレート（再利用可能）

## 使用方法
このテンプレートをコピーして、シリーズディレクトリに `reviewer.md` として保存し、シリーズ固有の内容にカスタマイズしてください。

## テンプレート構造

```markdown
**日付:** YYYY-MM-DD | **バージョン:** 1.0

# {SeriesName} レビュワー設定

このシリーズの記事レビューを行うAI人格を定義します。

## レビュワー設定

### 校正者

ペルソナ ID: {proofreader_id}
参照ファイル: /personas/proofreaders/{proofreader_id}.md

#### このシリーズでの重点項目
- **技術用語の一貫性**: {technical_term_consistency}
- **コードサンプルの正確性**: {code_accuracy}
- **日英併記の整合性**: {bilingual_consistency}

### レビュワー

ペルソナ ID: {reviewer_id}
参照ファイル: /personas/reviewers/{reviewer_id}.md

#### このシリーズでの評価観点
- **実践性**: {practicality_check}
- **段階的構成**: {progressive_structure_check}
- **完全性**: {completeness_check}

#### 特別な確認事項
- {special_check_1}
- {special_check_2}
- {special_check_3}

### 読者ペルソナ

#### 読者ペルソナ 1: {reader_persona_1}
参照ファイル: /personas/readers/{reader_persona_1}.md

##### このシリーズでの想定前提知識
- {prerequisite_1}
- {prerequisite_2}
- {prerequisite_3}

##### 到達目標
- {goal_1}
- {goal_2}
- {goal_3}

#### 読者ペルソナ 2: {reader_persona_2}
参照ファイル: /personas/readers/{reader_persona_2}.md

##### このシリーズでの想定前提知識
- {intermediate_prerequisite_1}
- {intermediate_prerequisite_2}
- {intermediate_prerequisite_3}

##### 到達目標
- {intermediate_goal_1}
- {intermediate_goal_2}
- {intermediate_goal_3}

## 🎯 このシリーズ特有のレビュー基準

### 技術的正確性
- {technical_accuracy_criteria}
- {sample_code_criteria}
- {security_criteria}

### 教育的価値
- {educational_value_criteria}
- {practical_value_criteria}
- {understanding_criteria}

### 実用性
- {usability_criteria}
- {applicability_criteria}
- {customization_criteria}

### {AuthorPersona}スタイルの品質
- {author_style_criteria_1}
- {author_style_criteria_2}
- {author_style_criteria_3}

## レビュー実施のポイント

### 各記事での確認事項
1. **導入部分**: {intro_check}
2. **理由説明**: {explanation_check}
3. **実践サンプル**: {sample_check}
4. **失敗談**: {failure_story_check}
5. **英語版**: {english_version_check}

### シリーズ全体での一貫性
- {consistency_check_1}
- {consistency_check_2}
- {consistency_check_3}
- {final_integration_check}
```

## 推奨ペルソナ組み合わせ

### 技術記事向け
- **校正者**: strict_grammarian
- **レビュワー**: technical_writer
- **読者**: beginner_engineer, intermediate_engineer

### 実践ガイド向け
- **校正者**: strict_grammarian  
- **レビュワー**: technical_specialist
- **読者**: beginner_engineer, senior_engineer

## 共有テンプレート参照
- **共通設定**: `/articles/shared-templates/series-common.md`
- **最適化フォーマット**: `/articles/shared-templates/optimized-format.md`