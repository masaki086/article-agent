# Claude Code Context Monitoring - 移行ドキュメント

**作成日:** 2025-01-09  
**目的:** 新レポジトリでの作業継続のための完全ガイド

## 📦 プロジェクト概要

### 製品名
`claudecode-context-monitoring`

### 目的
Claude Codeセッションのトークン使用量を監視し、日本語/英語の使用比率を分析して、英語使用を促すことでトークン効率を改善する独立したNPMパッケージ。

### 主要機能
1. **ハイブリッドトークンカウント**: tiktoken + Claude調整係数（1.1x）
2. **言語分析**: 日本語/英語の自動識別と節約提案
3. **Compact検出**: コンテキスト圧縮の自動検出
4. **セキュアなデータ管理**: メッセージ内容を保存せず統計のみ記録
5. **自動データクリーンアップ**: 7日経過データの自動削除

## 🚀 新レポジトリでのセットアップ

### 1. レポジトリ作成
```bash
# GitHubで新規レポジトリ作成
# 名前: claudecode-context-monitoring

# ローカルにクローン
git clone https://github.com/[username]/claudecode-context-monitoring.git
cd claudecode-context-monitoring
```

### 2. ファイルコピー
```bash
# 現在のパッケージディレクトリから全ファイルをコピー
cp -r /Users/akuzawatooru/dev3/article-agent/packages/claudecode-context-monitoring/* .
cp -r /Users/akuzawatooru/dev3/article-agent/packages/claudecode-context-monitoring/.* . 2>/dev/null || true

# node_modulesは除外
rm -rf node_modules

# 依存関係インストール
npm install
```

### 3. ビルドとテスト
```bash
# TypeScriptビルド
npm run build

# テスト実行
npm test

# CLIテスト
chmod +x bin/context-monitor.js
node bin/context-monitor.js test
```

## 📋 現在の実装状況

### ✅ 完了済み
- [x] コア機能実装
  - HybridTokenCounter
  - LanguageAnalyzer
  - CompactDetector
  - ContextAnalyzer
  - Database (SQLite)
- [x] セキュリティ対応
  - メッセージ内容非保存
  - ローカルのみ動作
  - 7日自動削除
- [x] 基本CLIツール
- [x] 基本テスト（90%成功）

### 🚧 作業中
- [ ] Webダッシュボード実装
- [ ] Claude Codeフック統合
- [ ] 完全なテストカバレッジ

### ❌ 未実装
- [ ] NPM公開準備
- [ ] ドキュメント完成
- [ ] セキュリティ監査
- [ ] パフォーマンス最適化

## 🔧 技術仕様

### 依存関係
- **tiktoken**: トークンカウント（Claude用に1.1倍調整）
- **sqlite3**: ローカルデータベース
- **express/ws**: ダッシュボード用（未実装）
- **commander**: CLI
- **TypeScript**: 型安全性

### データベース設計
- SQLite（`.context-monitor/data.db`）
- メッセージ内容は保存しない
- 統計情報のみ記録
- 7日後自動削除

### セキュリティ要件
1. **データプライバシー**: メッセージ内容を一切保存しない
2. **ローカル動作**: 外部API呼び出しなし
3. **自動クリーンアップ**: 起動時に古いデータ削除

## 📝 残タスク詳細

### 1. Webダッシュボード実装
```typescript
// src/dashboard/server.ts
// - Express + WebSocketサーバー
// - localhost:3000でホスト
// - リアルタイム更新
// - Chart.jsで可視化
```

### 2. Claude Codeフック統合
```typescript
// src/hooks/index.ts
// - SessionStartHook
// - UserInputHook  
// - ToolCallHook
// - ResponseHook
```

### 3. NPM公開準備
```bash
# package.json更新
# - description
# - keywords
# - repository
# - author
# - license

# .npmignore作成
# READMEとLICENSE追加
# npm publish --dry-run でテスト
```

### 4. ドキュメント作成
- README.md（インストール、使用方法）
- API.md（プログラマティック使用）
- CONTRIBUTING.md（開発ガイド）

## 🎯 推奨実装順序

1. **Week 1**: ダッシュボード実装
2. **Week 2**: フック統合とテスト
3. **Week 3**: ドキュメントとNPM公開準備
4. **Week 4**: セキュリティ監査と最終調整

## 💡 重要な設計判断

### 言語検出ロジック
- 10%以上の日本語文字で「日本語コンテンツ」と判定
- 和文中の英単語は日本語としてカウント
- トークン計算: 日本語1.5文字/トークン、英語4文字/トークン

### アラートレベル
- 🚨 **高**: 日本語50%以上（40-50%節約可能）
- ⚠️ **中**: 日本語30-50%（約30%節約可能）  
- 📊 **低**: 日本語10-30%（効率的）

### Claude調整係数
- tiktokenの結果に1.1倍を適用
- 実際のAPI使用量との比較で調整可能

## 🐛 既知の問題

1. **テストの一部失敗**: 
   - `LanguageAnalyzer`の英語節約計算で誤差
   - `CompactDetector`の閾値テストで境界値問題

2. **CLIタイムアウト**:
   - `test`コマンド実行後にプロセスが終了しない
   - Ctrl+Cで手動終了が必要

## 📞 連絡事項

### セキュリティ確認済み
- メッセージ内容の非保存
- 外部通信なし
- ローカル動作のみ

### 品質基準
- TypeScriptビルド成功
- 基本機能動作確認済み
- テストカバレッジ80%目標

### 今後の方針
- 独立NPMパッケージとして開発継続
- 品質確認後に公開検討
- 既存の`/optimization`ディレクトリは後日削除

## 🔗 参考リンク

- 元プロジェクト: `/Users/akuzawatooru/dev3/article-agent`
- 設計書: `/internal/design/context-monitoring-design.md`
- 要件定義: `/internal/requirements/context-monitoring-req.md`
- テスト設計: `/internal/test-design/context-monitoring-test.md`

---

**このドキュメントを新レポジトリのルートに配置して作業を継続してください。**