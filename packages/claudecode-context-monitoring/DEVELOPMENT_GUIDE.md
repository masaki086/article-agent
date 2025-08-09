# Development Guide for Claude Code Context Monitoring

**Date:** 2025-01-09 | **Version:** 1.0  
**Purpose:** 統一された開発プロセスとルールの定義

## 📋 Overview

このドキュメントは、claudecode-context-monitoringプロジェクトの開発ガイドラインです。
品質、セキュリティ、一貫性を保つために、すべての開発はこのガイドに従ってください。

## 🔄 6-Phase Development Process

すべての新機能実装は、この6フェーズプロセスに従う必要があります。

### Phase 1: Requirements Definition (要件定義)

#### Purpose
機能の目的、スコープ、期待される成果を明確化する。

#### Activities
1. **Feature Overview**
   - 機能の目的と目標を定義
   - ターゲットユーザーと使用ケースを特定
   - 成功基準を確立

2. **Human Interaction**
   - 不明点をリストアップ
   - 人間とのQ&Aセッション実施
   - すべての決定と根拠を文書化

3. **Documentation**
   - 要件ドキュメントを`/docs/requirements/`に作成
   - 機能要件と非機能要件を含める
   - 実装前に人間の承認を得る

#### Deliverables
- 要件ドキュメント (`/docs/requirements/[feature-name]-req.md`)
- 人間からの承認確認

#### Checklist
```markdown
- [ ] 機能の目的と目標を定義
- [ ] ターゲットユーザーを特定
- [ ] 成功基準を確立
- [ ] 不明点をリストアップし解決
- [ ] 要件ドキュメントを作成
- [ ] 人間の承認を取得
```

### Phase 2: Detailed Design (詳細設計)

#### Purpose
技術的アーキテクチャと実装アプローチを設計する。

#### Activities
1. **Technical Architecture**
   - 技術スタックの選択
   - システムアーキテクチャの設計
   - コンポーネントインターフェースの定義

2. **Security Assessment**
   - セキュリティリスクの特定
   - 緩和戦略の定義
   - データ処理方法のレビュー

3. **Proof of Concept**
   - 必要に応じて最小限のPoCを作成
   - 技術的実現可能性を検証
   - 発見事項を文書化

#### Deliverables
- 設計ドキュメント (`/docs/design/[feature-name]-design.md`)
- PoCコード（該当する場合）
- 設計に対する人間の承認

### Phase 3: Test Design (テスト設計)

#### Purpose
実装前に包括的なテスト戦略を設計する。

#### Activities
1. **Test Case Design**
   - 要件からテストケースを導出
   - ポジティブテストシナリオの設計
   - ネガティブテストシナリオの設計
   - 境界値テストの定義

2. **Test Planning**
   - テストデータ要件の定義
   - テスト環境の仕様化
   - パフォーマンステストの計画（必要な場合）
   - セキュリティテストの計画（必要な場合）

#### Deliverables
- テスト設計ドキュメント (`/docs/test-design/[feature-name]-test.md`)
- テストケース仕様
- 受け入れ基準チェックリスト

### Phase 4: Task Breakdown (タスク分解)

#### Purpose
実装を管理可能なタスクに分解する。

#### Activities
1. **Task Decomposition**
   - 機能を小さなタスクに分解
   - テスト実装タスクを含める
   - 各タスクの工数を見積もる

2. **Priority Setting**
   - タスクの依存関係を定義
   - 実装順序を設定
   - クリティカルパスを特定

#### Deliverables
- 優先順位付きタスクリスト
- 実装スケジュール

### Phase 5: Implementation and Testing (実装とテスト)

#### Purpose
機能を開発し、テストによって品質を保証する。

#### Activities
1. **Implementation**
   - 機能コードの記述
   - コーディング標準に従う
   - エラー処理の実装

2. **Unit Testing**
   - ユニットテストの作成（80%以上のカバレッジ）
   - すべてのユニットテストを実行
   - 失敗したテストを修正

3. **Integration Testing**
   - コンポーネント間の相互作用をテスト
   - データフローの検証
   - エラーシナリオのテスト

#### Deliverables
- 機能の実装
- ユニットテスト (`/src/__tests__/`)
- 統合テスト (`/tests/integration/`)
- テスト実行レポート

### Phase 6: Verification and Documentation (検証とドキュメント化)

#### Purpose
機能が要件を満たすことを確認し、ドキュメントを更新する。

#### Activities
1. **Human Verification**
   - 人間に機能をデモンストレーション
   - 受け入れテストの実施
   - フィードバックの収集

2. **Documentation Update**
   - ユーザードキュメントの更新
   - 技術ドキュメントの更新
   - リリースノートの作成

#### Deliverables
- 受け入れテスト結果
- 更新されたドキュメント
- リリースノート

## 🔒 Security Requirements

### Data Privacy
- **メッセージ内容を保存しない**: 統計情報のみを記録
- **ローカル動作のみ**: 外部APIへのデータ送信禁止
- **自動削除**: 7日経過データの自動削除

### Access Control
- **ローカルホストのみ**: デフォルトでlocalhostからのみアクセス可能
- **認証不要**: ローカル使用のため（将来的にはオプション）
- **読み取り専用API**: データ変更は専用インターフェースのみ

## 📊 Quality Standards

### Code Quality
- **TypeScript**: 厳格な型チェック (`strict: true`)
- **Linting**: ESLintによるコード品質チェック
- **Formatting**: Prettierによる一貫したフォーマット
- **Comments**: 複雑なロジックには説明コメント

### Test Coverage
| Test Type | Coverage Target | Tool | Location |
|-----------|----------------|------|----------|
| Unit Tests | 80% minimum | Jest | `/src/__tests__/` |
| Integration Tests | Critical paths | Jest | `/tests/integration/` |
| E2E Tests | Main workflows | Jest | `/tests/e2e/` |

### Performance Requirements
- Token counting: < 10ms per operation
- Dashboard update: < 1 second latency
- Memory usage: < 50MB
- CPU overhead: < 2%

## 🚫 Prohibited Actions

### Security
- ❌ メッセージ内容の保存
- ❌ 外部サービスへのデータ送信
- ❌ APIキーやパスワードのハードコーディング
- ❌ 個人情報の記録

### Code Quality
- ❌ テストなしでのマージ
- ❌ 型安全性を無視した実装
- ❌ エラーハンドリングの省略
- ❌ ドキュメントなしの複雑な機能

## ✅ Approval Gates

以下のフェーズでは人間の承認が必要です：

1. **Phase 1**: 要件定義の承認
2. **Phase 2**: 設計の承認
3. **Phase 3**: テスト設計の承認
4. **Phase 6**: 最終リリースの承認

## 📁 Project Structure

```
claudecode-context-monitoring/
├── src/                    # Source code
│   ├── core/              # Core modules
│   ├── hooks/             # Claude Code hooks
│   ├── dashboard/         # Web dashboard
│   ├── utils/             # Utilities
│   └── __tests__/         # Unit tests
├── tests/                  # Test files
│   ├── integration/       # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                   # Documentation
│   ├── requirements/      # Requirements docs
│   ├── design/           # Design docs
│   └── test-design/      # Test design docs
├── bin/                    # CLI executables
├── lib/                    # Compiled JavaScript
└── .context-monitor/       # Runtime data (git ignored)
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Watch mode
npm run build        # Build TypeScript
npm run lint         # Run ESLint
npm run format       # Run Prettier

# Testing
npm test            # Run all tests
npm run test:unit   # Unit tests only
npm run test:coverage # With coverage report

# CLI
npm run cli -- test  # Test CLI command
npm run cli -- init  # Initialize monitoring
```

## 📝 Commit Message Convention

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Example:
```
feat(analyzer): add compact detection algorithm

Implemented automatic detection of context compression events
with configurable thresholds and minimum reduction size.

Closes #123
```

## 🚀 Release Process

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md
3. **Test**: Run full test suite
4. **Build**: Create production build
5. **Tag**: Create git tag
6. **Publish**: NPM publish (when ready)

## ⚠️ Important Notes

1. **セキュリティ最優先**: データプライバシーは妥協しない
2. **段階的実装**: 各フェーズを完了してから次へ
3. **人間の承認**: 重要な決定は必ず確認を取る
4. **ドキュメント**: すべての決定と変更を記録
5. **テストファースト**: 実装前にテストを設計

## 🔗 Related Documents

- [MIGRATION.md](./MIGRATION.md) - Migration guide from original project
- [README.md](./README.md) - Project overview and usage
- Original project: `/Users/akuzawatooru/dev3/article-agent`

## 📊 Current Status

### Completed ✅
- Core functionality implementation
- Basic CLI tool
- Security compliance (no content storage)
- Basic tests (90% passing)

### In Progress 🚧
- Web dashboard implementation
- Claude Code hook integration
- Documentation completion

### Pending ❌
- NPM package publication
- Performance optimization
- Security audit

---

**Version History**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-09 | Initial creation | Claude Code |