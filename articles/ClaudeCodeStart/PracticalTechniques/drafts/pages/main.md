# 実践テクニック + 失敗回避の極意 - Claude Code入門ガイド #3

<!--
Generated Tags: Claude, AI, ドキュメント, ツール, プログラミング, セキュリティ, パフォーマンス, 開発効率, API
Generated at: 2025-08-04T08:33:10.309208
-->


## Tanukichiの小話

人類諸君、深夜2時の悲劇を聞いてほしい。完璧なCLAUDE.mdを作成したと思い込み、Claude Codeに「ユーザー認証を実装して」と依頼した。

結果、生成されたコードは確かに動作した。しかし翌朝テストしてみると、パスワードが平文で保存され、SQLインジェクション脆弱性まで含まれていた。ジョンソンでも危険だと分かるレベルのセキュリティホールだ。

原因は、CLAUDE.mdに「セキュリティ重視」と書いただけで、具体的な要件を書いていなかったこと。「bcryptでハッシュ化」「Prismaでクエリ実行」と具体的に書いていれば防げた事故だった。

今回は、そんな痛い失敗から学んだ実践テクニックと、よくある失敗パターンの回避方法を共有しよう。

## 📈 シリーズ進捗状況

### これまでに学んだこと
- ✅ CLAUDE.mdの基本概念と重要性（第1記事）
- ✅ 最小構成から実用版への拡張手順（第2記事）
- ✅ 開発ルール・Git運用・テスト方針の定義（第2記事）
- ✅ プロジェクトタイプ別のサンプル作成（第2記事）
- 🎯 高度な要件定義テクニック（今回学習）
- 🎯 失敗パターンの回避方法（今回学習）
- ⏳ 完全版テンプレート集（第4記事予定）

### 今回作成・拡張するファイル
前回までの実用版をベースに、より複雑で高度な要件に対応できる上級版を作成します。

## 🔄 前回からの継続

### 前記事で作成済みの実用版
TaskFlowプロジェクトの詳細版CLAUDE.md：
- プロジェクト概要（目的、ターゲット、技術スタック）
- 開発ルール（コーディング規約、Git運用、テスト方針）
- ファイル構造とプロジェクト構成

### 今回の拡張ポイント
実用版に以下の高度な要素を追加：
- **複雑な業務ロジック**の表現方法
- **セキュリティ要件**の具体的な定義
- **パフォーマンス基準**の数値化
- **例外処理**とエラーハンドリング方針
- **運用・監視**の要件

## はじめに

この記事では、前回までで学習した基本的なCLAUDE.md作成スキルを発展させ、より複雑で現実的なプロジェクト要件に対応する方法を学習します。

また、Tanukichiが実際に遭遇した失敗事例を通じて、よくある間違いパターンとその回避方法を習得できます。

読み終えた頃には、「Claude Codeがプロ級の提案をしてくれる」レベルのCLAUDE.mdを作成できるようになります。

## 高度な要件定義テクニック

### 1. 複雑な業務ロジックの表現

```markdown
# 業務ロジック詳細

## タスク管理のビジネスルール

### タスクの状態遷移
```
新規作成 → 進行中 → レビュー待ち → 完了
    ↓         ↓         ↓
  保留中    保留中    差し戻し → 進行中
```

### 状態変更の制約
- **新規→進行中**: 担当者設定必須、期限設定必須
- **進行中→レビュー待ち**: 作業時間記録必須（最低15分）
- **レビュー待ち→完了**: 管理者権限またはタスク作成者のみ
- **差し戻し**: 理由コメント必須（10文字以上）

### 自動処理ルール
- 期限超過タスク: 毎日9:00に自動通知
- 未完了タスク: 期限3日前から毎日リマインダー
- 長期保留: 30日間更新なしで自動アーカイブ

### 権限別の操作制限
```typescript
// 権限レベル定義
type UserRole = 'admin' | 'manager' | 'member' | 'viewer';
type UserPermission = 'create' | 'read' | 'update' | 'update_own' | 'delete' | 'archive';

// 操作権限マトリックス
const permissions: Record<UserRole, UserPermission[]> = {
  admin: ['create', 'read', 'update', 'delete', 'archive'],
  manager: ['create', 'read', 'update', 'archive'],
  member: ['create', 'read', 'update_own'],
  viewer: ['read']
};
```

### 2. セキュリティ要件の具体化

```markdown
# セキュリティ要件

## 認証・認可
### パスワードポリシー
- 最小8文字、最大128文字
- 英大文字・小文字・数字・記号を各1文字以上含む
- 過去5回分のパスワード履歴をチェック
- パスワードハッシュ化: bcrypt (saltRounds: 12)

### セッション管理
- JWT Access Token: 15分有効期限
- Refresh Token: 7日間有効期限
- 同時ログインセッション: 最大3つまで
- ログアウト時はサーバーサイドでトークン無効化

### API セキュリティ
- レート制限: 一般ユーザー 100req/min、管理者 1000req/min
- CORS: 本番環境では特定ドメインのみ許可
- CSP ヘッダー設定必須
- XSS 対策: すべての入力値をサニタイズ

## データ保護
### 個人情報の暗号化
- **保存時**: AES-256-GCM で暗号化
- **転送時**: TLS 1.3 以上必須
- **対象データ**: 氏名、メールアドレス、電話番号

### ログ管理
- 認証失敗: IPアドレスと試行回数を記録
- 機密データアクセス: ユーザーID、タイムスタンプ、操作内容
- ログローテーション: 30日間保持、その後自動削除
- ログ暗号化: 保存時は AES-256 で暗号化

### GDPR コンプライアンス
- データ削除権: ユーザーから要求があれば30日以内に削除
- データポータビリティ: JSON形式でのデータエクスポート機能
- 同意管理: Cookie使用、データ処理の明示的同意取得
```

### 3. パフォーマンス要件の数値化

```markdown
# パフォーマンス要件

## レスポンス時間目標
### API エンドポイント
- **認証API**: 平均200ms以下、95%タイル500ms以下
- **タスク一覧取得**: 平均150ms以下、95%タイル400ms以下
- **タスク作成・更新**: 平均100ms以下、95%タイル300ms以下
- **検索API**: 平均300ms以下、95%タイル800ms以下

### フロントエンド
- **初回ページロード**: 2秒以下（3G回線）
- **画面遷移**: 100ms以下
- **検索結果表示**: 500ms以下

## データベース最適化
### クエリパフォーマンス
- 全クエリ実行時間: 平均50ms以下
- N+1問題の禁止: include/join を適切に使用
- インデックス設計: 検索対象カラムには必ずインデックス

### 接続管理
- コネクションプール: 最小5、最大20接続
- 接続タイムアウト: 30秒
- アイドルタイムアウト: 10分

## メモリ・CPU使用量
- **メモリ使用量**: 512MB以下（本番環境）
- **CPU使用率**: 平常時70%以下、ピーク時90%以下
- **同時接続数**: 1000ユーザーまで対応

## 監視・アラート設定
- レスポンス時間が目標の2倍を超えた場合: 即座にアラート
- エラー率が5%を超えた場合: 5分以内にアラート
- メモリ使用率が80%を超えた場合: 即座にアラート
```

## よくある失敗パターン TOP10

### 失敗パターン1: 曖昧な技術指定

❌ **悪い例:**
```markdown
# 技術スタック
- データベース: SQL系
- 認証: 何かいい感じのライブラリ
- CSS: モダンな手法
```

✅ **良い例:**
```markdown
# 技術スタック
- データベース: PostgreSQL 15+ (Prisma ORM使用)
- 認証: JWT + bcrypt (Express-jwt v8.0+)
- CSS: Tailwind CSS v3.0+ (JIT mode有効)
```

**教訓**: 具体的なライブラリ名・バージョンを明記する

### 失敗パターン2: セキュリティの軽視

❌ **悪い例:**
```markdown
# 制約事項
- セキュリティに配慮する
- ユーザーデータは安全に管理
```

✅ **良い例:**
```markdown
# セキュリティ要件
- パスワード: bcrypt (saltRounds: 12) でハッシュ化
- SQL インジェクション対策: Prisma ORM 使用、生SQLクエリ禁止
- XSS 対策: DOMPurify でサニタイズ
- CSRF 対策: SameSite Cookie + CSRF Token
```

### 失敗パターン3: エラーハンドリングの未定義

❌ **悪い例:**
```markdown
# エラー処理
- エラーが起きたら適切に処理する
```

✅ **良い例:**
```markdown
# エラーハンドリング方針

## API エラーレスポンス形式
```typescript
interface ErrorResponse {
  error: {
    code: string;           // "VALIDATION_ERROR"
    message: string;        // "ユーザーフレンドリーなメッセージ"
    details?: any;          // 詳細情報（開発環境のみ）
    timestamp: string;      // ISO 8601 format
    path: string;          // API パス
  }
}
```

## エラー分類とHTTPステータス
- 400: バリデーションエラー
- 401: 認証エラー  
- 403: 認可エラー
- 404: リソース未発見
- 429: レート制限超過
- 500: サーバー内部エラー
```

### 失敗パターン4: テストの曖昧な定義

❌ **悪い例:**
```markdown
# テスト
- しっかりテストを書く
- バグがないようにする
```

✅ **良い例:**
```markdown
# テスト戦略

## 必須テストケース
### ユニットテスト
- ユーティリティ関数: 全関数カバー率90%以上
- API エンドポイント: 正常系・異常系両方
- バリデーション: 境界値テスト必須

### 統合テスト  
- 認証フロー: ログイン→JWT生成→認証確認
- データベース操作: CRUD操作の整合性
- 外部API連携: モック使用＋実際のAPI両方

### E2Eテスト
- クリティカルパス: ユーザー登録→ログイン→タスク作成→削除
- エラーシナリオ: ネットワークエラー、サーバーエラー時の動作
```

## Tanukichiの痛い失敗事例集

### 事例1: 「セキュリティ重視」の落とし穴

冒頭で話した通りだが、「セキュリティ重視」と書いただけで、具体的な要件を書かなかった結果：

- パスワードが平文保存
- SQLインジェクション脆弱性
- XSS攻撃が可能
- セッション管理が不適切

**対策**: 具体的なライブラリと実装方法を明記

### 事例2: 「高速化」の罠

「パフォーマンス重視」とだけ書いたら、Claude Codeが以下を提案：

- 全データをメモリキャッシュ（メモリ爆発）
- インデックス未設定でのフルスキャン
- N+1クエリ問題が大量発生

**対策**: 数値目標と具体的な最適化手法を記載

### 事例3: 「使いやすいUI」の悪夢

UIについて「直感的で使いやすく」とだけ書いたら：

- 15色使った虹色デザイン
- フォントサイズがバラバラ
- モバイル対応なし
- アクセシビリティ無視

**対策**: デザインシステムとUI要件を具体化

## トラブルシューティング診断フロー

### AIが期待通りに動かない時の確認手順

```markdown
# CLAUDE.md品質診断チェックリスト

## Level 1: 基本情報チェック
□ プロジェクト名と目的が明確か？
□ 技術スタックにバージョン番号があるか？
□ ターゲットユーザーが具体的か？

## Level 2: 技術詳細チェック
□ ライブラリ名が具体的か？（「認証ライブラリ」→「JWT + bcrypt」）
□ 設定方法が明記されているか？
□ 禁止事項が明確か？

## Level 3: 業務ロジックチェック
□ データの関係性が説明されているか？
□ 状態遷移が定義されているか？
□ 権限・ロールが明確か？

## Level 4: 品質要件チェック
□ パフォーマンス目標が数値化されているか？
□ セキュリティ要件が具体的か？
□ エラーハンドリングが定義されているか？

## Level 5: 運用要件チェック
□ ログ要件が明確か？
□ 監視・アラート設定があるか？
□ デプロイ手順が記載されているか？
```

### 問題別対処法

| 問題 | 原因 | 対処法 |
|------|------|--------|
| 古い技術が提案される | バージョン未指定 | 「React 18+」など具体的バージョン記載 |
| セキュリティが甘い | 要件が曖昧 | 具体的なライブラリと設定方法を記載 |
| パフォーマンスが悪い | 数値目標なし | 「API応答200ms以下」など数値化 |
| UI・UXが微妙 | デザイン要件なし | カラーパレット、フォントサイズ等を明記 |

## このセクションのポイント

- **具体性が命**: 「セキュリティ重視」→「bcrypt + JWT + CSP」
- **数値化の重要性**: 「高速」→「API応答200ms以下」
- **失敗パターンの学習**: よくある10の失敗を事前に回避
- **診断フローの活用**: 5段階チェックで品質確保
- **継続的改善**: 問題発生時の対処法を体系化

## 英語版コピペ用

高度な要件定義の英語版テンプレート：

```markdown
# Advanced Requirements

## Business Logic Details
### Task State Transitions
```
New → In Progress → Under Review → Completed
 ↓        ↓           ↓
Pending  Pending   Rejected → In Progress
```

### State Change Constraints
- **New→In Progress**: Assignee required, Due date required
- **In Progress→Under Review**: Time tracking required (min 15min)
- **Under Review→Completed**: Admin role or task creator only
- **Rejected**: Reason comment required (min 10 chars)

## Security Requirements
### Password Policy
- Length: 8-128 characters
- Complexity: Uppercase + lowercase + digits + symbols
- History check: Last 5 passwords
- Hashing: bcrypt (saltRounds: 12)

### Session Management
- JWT Access Token: 15min expiry
- Refresh Token: 7 days expiry
- Concurrent sessions: Max 3
- Server-side token invalidation on logout

## Performance Requirements
### API Response Time Targets
- **Authentication API**: Avg 200ms, 95th percentile 500ms
- **Task List API**: Avg 150ms, 95th percentile 400ms
- **Task CRUD**: Avg 100ms, 95th percentile 300ms
- **Search API**: Avg 300ms, 95th percentile 800ms

### Database Optimization
- Query execution time: Avg 50ms max
- No N+1 queries: Use include/join appropriately
- Index design: All searchable columns indexed

## Error Handling Policy
### API Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;        // "VALIDATION_ERROR"
    message: string;     // User-friendly message
    details?: any;       // Detailed info (dev only)
    timestamp: string;   // ISO 8601 format
    path: string;       // API path
  }
}
```

### Error Classification
- 400: Validation errors
- 401: Authentication errors
- 403: Authorization errors
- 404: Resource not found
- 429: Rate limit exceeded
- 500: Internal server errors

# Monitoring & Alerts
- Response time > 2x target: Immediate alert
- Error rate > 5%: Alert within 5min
- Memory usage > 80%: Immediate alert
```

## 次回予告

最終回となる次回は「完全版テンプレート集」をテーマに、あらゆるプロジェクトタイプに対応できる完成版を提供します。

- スタートアップMVP版
- エンタープライズ開発版  
- オープンソース版
- 業界特化版（金融、医療、ゲーム、IoT）
- CLAUDE.md自動生成ツール（簡易版）

これまで学習した全ての知識を統合し、「Claude Codeマスター」レベルに到達できる内容になっています。ジョンソンも驚くような完璧なテンプレートを用意する予定です。

## まとめ

今回は実用版からさらに一歩進んだ、プロ級のCLAUDE.md作成テクニックを学習しました。

最も重要なのは「具体性」と「数値化」です。「セキュリティ重視」ではなく「bcrypt + JWT + CSP」、「高速化」ではなく「API応答200ms以下」と明確に記載することで、AIが期待通りの提案をしてくれます。

Tanukichiの痛い失敗事例も、皆さんには笑い話として楽しんでもらえたでしょうか。同じ失敗を繰り返さないよう、診断チェックリストを活用してください。

次回で完結となる本シリーズ、最後まで楽しんでいただければ幸いです。

---

_この文書は生成AI（Claude）を使用して作成した。_  
_執筆者：たぬきち（AI技術実践ライター）_

---

## 参考リンク

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web.dev Performance](https://web.dev/performance/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

## 更新履歴

- 2025-08-02: 初稿作成

## レビュー情報

- 「校正者」：この記事は厳格な文法チェッカーにより確認されました
- 「レビュワー」：この記事はテクニカルライターにより「実践的で失敗事例が参考になる」と評価されました

## 読者コメント

- 「初心者エンジニア」：失敗パターンが具体的で、自分の書き方を見直すことができました
- 「中級エンジニア」：セキュリティ要件の書き方が特に参考になり、チームでも導入予定です