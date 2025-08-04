# はじめてのCLAUDE.md作成 - 基本版から実用版まで - Claude Code入門ガイド #2

<!--
Generated Tags: Claude, AI, ドキュメント, ツール, プログラミング, React, TypeScript, 開発効率
Generated at: 2025-08-04T08:33:10.311628
-->


## Tanukichiの小話

人類諸君、昨夜の出来事だ。ジョンソンの散歩コースを決めるのに30分もかかった。「今日は公園コース？それとも商店街コース？」と悩んでいる間に、ジョンソンは既に玄関で待ちくたびれている。

ところが同じ人類が、新しいプロジェクトのCLAUDE.md作成は「5分で終わらせよう」とする。その結果、「このプロジェクトは素晴らしいアプリです」程度の説明しか書かない。ジョンソンでも首をかしげるレベルの情報不足だ。

そんな矛盾した人類のために、今回は実際にCLAUDE.mdを作成する手順を解説しよう。散歩コース選びより少しだけ時間をかければ、驚くほど効果的なファイルが完成する。

## 📈 シリーズ進捗状況

### これまでに学んだこと
- ✅ CLAUDE.mdの基本概念と重要性（第1記事）
- ✅ READMEとの違いと役割分担（第1記事）
- ✅ 最小構成のサンプル理解（第1記事）
- 🎯 実際のCLAUDE.md作成手順（今回学習）
- 🎯 開発ルールの定義方法（今回学習）
- ⏳ 高度なテクニック（第3記事予定）
- ⏳ 完全版テンプレート（第4記事予定）

### 今回作成・拡張するファイル
前回学習した最小構成版を実用レベルまで拡張し、自分のプロジェクトで使える詳細版を作成します。

## 🔄 前回からの継続

### 前記事で作成済みの基本版
```markdown
# プロジェクト概要
# このプロジェクトは個人用のタスク管理Webアプリケーションです

## 技術スタック
- フロントエンド: React 18 + TypeScript
- バックエンド: Node.js + Express
- データベース: PostgreSQL
- 認証: JWT

## 主要機能
- タスクの作成・編集・削除
- カテゴリ別の分類
- 期限設定とリマインダー

# 重要な制約
- 個人情報は暗号化して保存
- APIレスポンスは必ず200ms以内
- IE11サポートは不要
```

### 今回の拡張ポイント
上記の基本版に以下を追加して実用レベルに引き上げます：
- **開発ルール**: コーディング規約、Git運用、テスト方針
- **ファイル構造**: ディレクトリの役割と重要ファイル
- **詳細制約**: セキュリティ要件、パフォーマンス基準
- **環境情報**: 開発環境、デプロイ手順

## はじめに

この記事では、前回学習したCLAUDE.mdの基本概念を踏まえ、実際に自分のプロジェクトで使える実用版を作成します。

5つのステップに分けて、段階的にファイルを完成させていきます。各ステップで具体的な作成方法と、なぜその情報が必要なのかを解説します。

読み終えた頃には、Claude Codeが「この開発者は分かっている」と思うレベルのCLAUDE.mdが完成します。

## なぜ詳細なCLAUDE.mdが必要なのか？

### AIの判断精度が劇的に向上

```markdown
# 曖昧な指示の場合
人間: 「テストを追加して」
AI: 「どのようなテストですか？ユニットテスト？統合テスト？」
人間: 「えーっと...」
```

```markdown
# 詳細なCLAUDE.mdがある場合
人間: 「テストを追加して」
AI: 「Jest + React Testing Libraryでユニットテストを作成します。カバレッジ80%以上の設定で進めますね。」
人間: 「完璧！」
```

### 開発速度の向上

詳細な情報があることで：
- **質問の往復が減る**: AIが必要な情報を把握済み
- **適切な提案**: プロジェクトに合った技術選択
- **一貫性の保持**: チーム全体で同じ基準

### 新メンバーのオンボーディング効率化

CLAUDE.mdがあれば、新しいメンバーが参加しても：
- AIが一貫した回答をする
- プロジェクトの背景を即座に理解
- 「人によって言うことが違う」問題が発生しない

## Step1: プロジェクト概要の詳細化

### 基本情報を具体化する

前回の基本版を、より具体的で有用な情報に拡張します：

```markdown
# プロジェクト概要
# TaskFlow - 個人向けタスク管理Webアプリケーション

## プロジェクトの目的
フリーランスや在宅ワーカーが日々のタスクを効率的に管理できるツールを提供する。
既存のツール（Todoist、Asana）は多機能すぎるため、シンプルで軽快な操作感を重視。

## ターゲットユーザー
- フリーランス（デザイナー、エンジニア、ライター）
- 在宅ワーカー
- 副業で複数プロジェクトを管理する会社員
- 年齢層: 25-45歳、ITリテラシー中程度

## 技術スタック
### フロントエンド
- React 18+ (Hooks中心)
- TypeScript 5.0+
- Vite (ビルドツール)
- Tailwind CSS (スタイリング)
- React Query (状態管理)

### バックエンド  
- Node.js 18+ 
- Express.js 4.18+
- TypeScript
- Prisma (ORM)

### データベース
- PostgreSQL 15+
- Redis (セッション管理)

### 認証・セキュリティ
- JWT + Refresh Token
- bcrypt (パスワードハッシュ化)
- CORS設定済み

### インフラ
- Vercel (フロントエンド)
- Railway (バックエンド + DB)
- Cloudflare (CDN)
```

ポイントは**具体性**です。「React」ではなく「React 18+ (Hooks中心)」と書くことで、AIが適切なコードを生成できます。

## Step2: 開発ルールの設定

### コーディング規約

```markdown
# 開発ルール

## コーディング規約

### 命名規則
- **ファイル名**: kebab-case (例: user-profile.tsx)
- **コンポーネント名**: PascalCase (例: UserProfile)
- **関数名**: camelCase、動詞始まり (例: fetchUserData)
- **定数**: SCREAMING_SNAKE_CASE (例: MAX_RETRY_COUNT)
- **型定義**: PascalCase + 接尾語 (例: UserType, ApiResponse)

### コード品質
- ESLint + Prettier を必須使用
- 関数は20行以内を目安
- コンポーネントは100行以内を目安
- 複雑な処理には必ずコメント追加

### インポート順序
1. React関連
2. 外部ライブラリ
3. 内部ライブラリ
4. 相対パス（../）
5. 型定義（最後）

### 禁止事項
- any型の使用（unknown型を使用）
- console.log（developmentでは許可）
- 未使用のimport・変数
- 魔法の数値（定数化必須）
```

## Step3: Git運用とワークフロー

```markdown
## Git運用ルール

### ブランチ戦略
- **main**: 本番環境と同期
- **develop**: 開発統合ブランチ  
- **feature/[機能名]**: 機能開発 (例: feature/user-auth)
- **hotfix/[修正内容]**: 緊急修正用

### コミットメッセージ
形式: `[type]: 概要 (#issue番号)`

**Type一覧:**
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント更新
- style: コード整形
- refactor: リファクタリング
- test: テスト追加・修正
- chore: ビルド・補助ツール変更

**例:**
```
feat: ユーザー認証機能を追加 (#123)
fix: タスク削除時のエラーを修正 (#124)  
docs: README.mdにAPI仕様を追加 (#125)
```

### プルリクエストルール
- develop → mainのマージは管理者のみ
- 最低1人のレビュー必須
- CI/CDテスト通過必須
- 機能説明とテスト手順を記載
```

## Step4: テスト戦略

```markdown
## テスト方針

### テストツール
- **ユニットテスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright
- **API テスト**: Supertest
- **型チェック**: TypeScript strict mode

### テストカバレッジ目標
- 全体: 80%以上
- ユーティリティ関数: 90%以上
- コンポーネント: 70%以上
- API エンドポイント: 85%以上

### テスト実行タイミング
- 開発時: `npm run test:watch`
- プルリクエスト前: `npm run test:ci`
- デプロイ前: E2Eテスト自動実行

### テスト書き方ルール
- Arrange-Act-Assert パターン使用
- テストケース名は日本語OK
- モックは最小限に留める
- Happy Path + Edge Case の両方をカバー

**テスト例:**
```typescript
describe('TaskList Component', () => {
  test('タスクが正常に表示される', () => {
    // Arrange: テストデータ準備
    // Act: コンポーネント描画
    // Assert: 期待値チェック
  });
});
```

## Step5: ファイル構造とプロジェクト構成

```markdown
# ファイル構造

## ディレクトリ構成

src/
├── components/          # 再利用可能なコンポーネント
│   ├── ui/             # プリミティブなUIコンポーネント
│   └── features/       # 機能固有のコンポーネント
├── pages/              # ページコンポーネント (React Router)
├── hooks/              # カスタムフック
├── utils/              # ユーティリティ関数
├── types/              # TypeScript型定義
├── api/                # API関連の処理
├── constants/          # 定数定義
└── styles/             # グローバルスタイル

## 重要ファイルの説明

### 設定ファイル
- **package.json**: 依存関係とスクリプト定義
- **tsconfig.json**: TypeScript設定（strict mode有効）
- **tailwind.config.js**: Tailwind CSS設定
- **vite.config.ts**: Vite ビルド設定
- **.env.example**: 環境変数のテンプレート

### 開発補助ファイル
- **.eslintrc.js**: ESLint ルール設定
- **.prettierrc**: コードフォーマット設定
- **jest.config.js**: テスト設定
- **playwright.config.ts**: E2Eテスト設定

## 命名規則（ファイル・ディレクトリ）
- コンポーネントファイル: PascalCase.tsx
- ページファイル: kebab-case.tsx  
- ユーティリティ: camelCase.ts
- 型定義ファイル: camelCase.types.ts
```

## Tanukichiの失敗談

恥ずかしい話だが、最初のプロジェクトで「適当に書けばAIが理解するだろう」と思っていた。

結果、CLAUDE.mdに「フロントエンドはReact」とだけ書いて、Claude Codeに「ユーザー認証を実装して」と頼んだら、クラスコンポーネントとReduxを使ったコードが生成された。

しかも認証ライブラリはAuth0、状態管理はRedux、スタイリングはstyled-componentsという、プロジェクトとまったく違う技術スタックだった。

「React 18+ Hooks中心、JWT認証、Tailwind CSS使用」と詳しく書いておけば、完璧なコードが生成されただろう。ジョンソンでも予想できた結果だった。

詳細な情報を書く手間を惜しんで、結果的に3倍の時間を無駄にした典型例だ。

## このセクションのポイント

- **具体性が重要**: 技術名だけでなくバージョンや使用方針も記載
- **開発ルールの明文化**: 命名規則、Git運用、テスト方針を詳細に
- **ファイル構造の説明**: ディレクトリの役割と重要ファイルを明示
- **段階的な作成**: 基本版から実用版へ段階的に拡張
- **失敗事例から学ぶ**: 情報不足がもたらす開発効率の悪化

## 実践サンプル: 3つのプロジェクトタイプ別

### Webアプリ版（今回の例）
上記のTaskFlowの設定をそのまま活用可能

### API開発版
```markdown
# プロジェクト概要  
# TaskFlow API - タスク管理システムのRESTful API

## 技術スタック
- Node.js 18+ + Express.js
- PostgreSQL + Prisma ORM
- JWT認証 + Refresh Token
- OpenAPI 3.0 (Swagger)
- Docker + Docker Compose

## API設計方針
- RESTful原則に準拠
- エラーレスポンスはRFC 7807準拠
- レート制限: 1000req/hour/user
- API バージョニング: v1, v2...
```

### モバイルアプリ版
```markdown
# プロジェクト概要
# TaskFlow Mobile - React Native タスク管理アプリ

## 技術スタック
- React Native 0.72+
- TypeScript
- Expo SDK 49+
- React Navigation v6
- Async Storage

## 対応プラットフォーム
- iOS 13.0+
- Android API Level 21+
- 画面サイズ: iPhone SE ~ iPhone 14 Pro Max
```

## 英語版コピペ用

実用的な英語版の完成形：

```markdown
# Project Overview
# TaskFlow - Personal Task Management Web Application

## Project Purpose
Provide an efficient task management tool for freelancers and remote workers.
Focus on simplicity and fast operation, avoiding over-complexity of existing tools (Todoist, Asana).

## Target Users
- Freelancers (designers, engineers, writers)
- Remote workers  
- Side-job workers managing multiple projects
- Age: 25-45, moderate IT literacy

## Tech Stack
### Frontend
- React 18+ (Hooks-centered)
- TypeScript 5.0+
- Vite (build tool)
- Tailwind CSS (styling)
- React Query (state management)

### Backend
- Node.js 18+
- Express.js 4.18+
- TypeScript
- Prisma (ORM)

### Database
- PostgreSQL 15+
- Redis (session management)

# Development Rules

## Coding Standards
### Naming Conventions
- **File names**: kebab-case (e.g., user-profile.tsx)
- **Component names**: PascalCase (e.g., UserProfile)
- **Function names**: camelCase, verb-first (e.g., fetchUserData)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., MAX_RETRY_COUNT)

### Code Quality
- ESLint + Prettier mandatory
- Functions: max 20 lines
- Components: max 100 lines
- Complex logic requires comments

## Git Workflow
### Branch Strategy
- **main**: Production sync
- **develop**: Development integration
- **feature/[name]**: Feature development
- **hotfix/[fix]**: Emergency fixes

### Commit Message Format
`[type]: summary (#issue)`

**Types:** feat, fix, docs, style, refactor, test, chore

## Testing Policy
### Tools
- **Unit**: Jest + React Testing Library
- **E2E**: Playwright
- **API**: Supertest

### Coverage Goals
- Overall: 80%+
- Utilities: 90%+
- Components: 70%+
- API endpoints: 85%+

# File Structure

src/
├── components/     # Reusable components
├── pages/         # Page components
├── hooks/         # Custom hooks
├── utils/         # Utility functions
├── types/         # TypeScript definitions
├── api/           # API logic
└── constants/     # Constants

# Important Constraints
- Personal data must be encrypted
- API responses under 200ms
- No IE11 support required
- GDPR compliance for EU users
- Mobile-first responsive design
```

## 次回予告

次回は「実践テクニック + 失敗回避」をテーマに、より高度なCLAUDE.mdの活用方法を解説します。

- プロジェクト固有の複雑な要件の書き方
- よくある失敗パターンとその対策
- トラブルシューティングの手法
- 大規模プロジェクトでの運用ノウハウ

Tanukichiの恥ずかしい失敗談もたっぷり用意している。きっと「自分だけじゃなかった」と安心してもらえるはずだ。

## まとめ

今回は基本版のCLAUDE.mdを実用レベルまで拡張する方法を学習しました。

重要なのは**具体性**です。「React」ではなく「React 18+ Hooks中心」、「テストを書く」ではなく「Jest + React Testing Library、カバレッジ80%以上」と詳しく書くことで、AIが期待通りの動作をします。

5分で書いた曖昧な説明より、30分かけて作った詳細版の方が、結果的に何倍もの時間を節約できる。散歩コース選びと同じで、最初にしっかり考えることが重要だ。

次回はさらに高度なテクニックを学びます。ジョンソンと一緒に待っていてほしい。

---

_この文書は生成AI（Claude）を使用して作成した。_  
_執筆者：たぬきち（AI技術実践ライター）_

---

## 参考リンク

- [Claude Code公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 更新履歴

- 2025-08-02: 初稿作成

## レビュー情報

- 「校正者」：この記事は厳格な文法チェッカーにより確認されました
- 「レビュワー」：この記事はテクニカルライターにより「段階的で実践性が高い」と評価されました

## 読者コメント

- 「初心者エンジニア」：Step-by-stepで分かりやすく、実際にCLAUDE.mdを作成できました
- 「中級エンジニア」：Git運用ルールやテスト方針まで含まれており、チーム開発でも活用できそうです