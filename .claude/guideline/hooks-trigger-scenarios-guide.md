# Claude Code Hooks トリガーシナリオ詳細ガイド

## 🎯 各Hookイベントの発火タイミングとユースケース

### 1. PreToolUse - ツール実行前の介入ポイント

#### 発火タイミング
Claudeが以下のツールを実行する**直前**に発火：
- `Bash` - シェルコマンド実行前
- `Edit` - ファイル編集前
- `Write` - ファイル作成/上書き前
- `Read` - ファイル読み込み前（プロジェクト内文書も含む）
- `MultiEdit` - 複数編集前
- `Task` - サブエージェント起動前
- `Glob` - ファイルパターン検索前
- `Grep` - ファイル内容検索前
- `WebFetch` - Webサイトデータ取得前
- `WebSearch` - Web検索実行前

#### 具体的な発火シナリオ

**シナリオ1: 危険なコマンドの実行を防ぐ**
```
User: "Clean up all temporary files"
Claude: "I'll remove temporary files using rm command"
→ PreToolUse発火 (Bash: rm -rf /tmp/*)
→ Hook: 危険パターン検出 → ブロック
→ Claude: "This command was blocked for safety"
```

**シナリオ2: ファイル編集の事前チェック**
```
User: "Update the production config"
Claude: "I'll edit the production.config file"
→ PreToolUse発火 (Edit: production.config)
→ Hook: 本番環境ファイル検出 → 警告/確認要求
→ Claude: 編集を続行 or 中止
```

**シナリオ3: ローカルファイル読み込みの監視**
```
User: "Review the API documentation"
Claude: "I'll read the API documentation file"
→ PreToolUse発火 (Read: docs/api.md)
→ Hook: 機密情報を含む可能性のあるファイルチェック
→ 機密ファイルの場合はマスク処理 or ブロック
```

**シナリオ4: Web情報取得の制御**
```
User: "Check the latest React documentation"
Claude: "I'll fetch the React documentation from the official site"
→ PreToolUse発火 (WebFetch: https://react.dev/learn)
→ Hook: 
  - 許可されたドメインかチェック
  - レート制限の確認
  - キャッシュの有無確認
→ 取得を許可 or キャッシュから提供
```

**シナリオ5: Web検索の監視とフィルタリング**
```
User: "Search for best practices in authentication"
Claude: "I'll search for authentication best practices"
→ PreToolUse発火 (WebSearch: "authentication best practices")
→ Hook:
  - 検索クエリのログ記録
  - 不適切なキーワードのフィルタリング
  - 社内ナレッジベース優先検索の実行
→ 検索実行 or 代替ソース提供
```

**実装例: ブランチ保護**
```python
# .claude/hooks/branch_protection.py
if tool_name == "Edit" and current_branch == "main":
    return {"decision": "deny", "reason": "Direct edits to main branch are not allowed"}
```

### 2. PostToolUse - ツール実行後の後処理

#### 発火タイミング
ツールが**正常に完了した後**に発火（エラー時は発火しない）

#### 具体的な発火シナリオ

**シナリオ1: コード自動フォーマット**
```
User: "Create a new Python function for data processing"
Claude: Writes new Python file
→ ツール実行完了 (Write: data_processor.py)
→ PostToolUse発火
→ Hook: Black/Ruffでフォーマット実行
→ ファイルが自動整形される
```

**シナリオ2: 変更の自動ステージング**
```
User: "Fix the bug in authentication"
Claude: Edits auth.js file
→ ツール実行完了 (Edit: src/auth.js)
→ PostToolUse発火
→ Hook: git add src/auth.js 実行
→ 変更が自動的にステージングされる
```

**実装例: TypeScript型チェック**
```bash
# PostToolUse hook for *.ts files
if [[ "$CLAUDE_FILE_PATHS" == *.ts ]]; then
    npx tsc --noEmit $CLAUDE_FILE_PATHS
    if [ $? -ne 0 ]; then
        echo "Type errors detected in modified files"
    fi
fi
```

### 3. UserPromptSubmit - ユーザー入力時の介入

#### 発火タイミング
ユーザーがプロンプトを送信し、**Claudeが処理を開始する前**

#### 具体的な発火シナリオ

**シナリオ1: コンテキスト自動注入**
```
User: "Implement the new feature"
→ UserPromptSubmit発火
→ Hook: Git状態、最近のIssue、TODOリストを取得
→ Claudeに追加コンテキストが渡される
→ Claude: "Based on issue #123 and current branch feature-xyz..."
```

**シナリオ2: プロンプト検証と拡張**
```
User: "Delete everything"  # 曖昧で危険な指示
→ UserPromptSubmit発火
→ Hook: 危険なキーワード検出
→ 確認メッセージ追加: "Please specify what to delete"
→ Claudeが明確化を求める
```

**実装例: プロジェクト状態の自動追加**
```python
# 現在の作業状態を自動的に含める
print(f"""
Current branch: {git_branch}
Modified files: {modified_count}
Last commit: {last_commit_message}
Open PRs: {open_prs}

Remember: Follow TDD practices
""")
```

### 4. Stop - セッション終了時の処理

#### 発火タイミング
Claudeがユーザーへの応答を**完了した時点**（全タスク終了後）

#### 具体的な発火シナリオ

**シナリオ1: 作業内容の自動保存**
```
User: "Implement authentication system"
Claude: 複数ファイルを作成・編集
Claude: "I've completed the authentication system implementation"
→ Stop発火
→ Hook: 全変更を自動コミット
→ セッションブランチ作成: claude-session-abc123
```

**シナリオ2: 品質チェック強制**
```
Claude: "Task completed successfully"
→ Stop発火
→ Hook: テスト実行
→ テスト失敗検出
→ return {"decision": "block", "reason": "Tests failing"}
→ Claudeが作業を継続
```

**実装例: セッションサマリー生成**
```python
# セッション終了時に作業内容をまとめる
def create_session_summary():
    files_changed = get_changed_files()
    duration = get_session_duration()
    
    summary = f"""
    Session Summary ({session_id}):
    - Duration: {duration}
    - Files modified: {len(files_changed)}
    - Lines added/removed: +{additions}/-{deletions}
    """
    
    save_to_log(summary)
    send_notification(summary)
```

### 5. SubagentStop - サブエージェント完了時

#### 発火タイミング
Taskツールで起動したサブエージェントが**タスクを完了した時**

#### 具体的な発火シナリオ

**シナリオ1: 検索タスクの結果検証**
```
Claude: "I'll use a specialized agent to search the codebase"
→ Task tool: general-purpose agent 起動
→ サブエージェントが検索完了
→ SubagentStop発火
→ Hook: 検索結果の妥当性チェック
→ 不十分な場合は再検索を要求
```

**シナリオ2: ドキュメント生成の品質確認**
```
Claude: "Using docs agent to update documentation"
→ Task tool: docs-restructure-polish agent
→ ドキュメント更新完了
→ SubagentStop発火
→ Hook: Markdownリンクチェック、スペルチェック実行
```

**実装例: サブエージェントのパフォーマンス追跡**
```python
# サブエージェントの実行時間と成功率を記録
def track_subagent_performance():
    end_time = time.time()
    duration = end_time - start_times.get(session_id, end_time)
    
    metrics = {
        "subagent_type": subagent_type,
        "duration": duration,
        "success": check_success_criteria(),
        "timestamp": datetime.now()
    }
    
    save_metrics(metrics)
```

### 6. SessionStart - セッション開始時の初期化

#### 発火タイミング
新しいClaude Codeセッションが**開始された直後**

#### 具体的な発火シナリオ

**シナリオ1: 開発環境の自動セットアップ**
```
$ claude "Let's work on the project"
→ SessionStart発火
→ Hook: 
  - npm install 実行
  - Python仮想環境activation
  - Docker containers起動
  - 環境変数チェック
→ Claude: "Environment is ready. How can I help?"
```

**シナリオ2: プロジェクトコンテキストの自動ロード**
```
新セッション開始
→ SessionStart発火
→ Hook: 
  - .claude/context.md 読み込み
  - 最近のIssues取得
  - TODOリスト表示
  - チームの規約リマインド
→ Claudeが完全なコンテキストを持った状態で開始
```

**実装例: セッション別ワークスペース作成**
```bash
#!/bin/bash
# セッション用の一時ブランチを作成
git checkout -b claude-temp-$CLAUDE_SESSION_ID

# セッションログディレクトリ作成
mkdir -p .claude/sessions/$CLAUDE_SESSION_ID

# 依存関係の確認
npm ci
python -m pip install -r requirements.txt

echo "Session $CLAUDE_SESSION_ID initialized"
```

### 7. PreCompact - コンテキスト圧縮前の保護

#### 発火タイミング
Claudeのコンテキストウィンドウが**満杯に近づき、圧縮が必要になった時**

#### 具体的な発火シナリオ

**シナリオ1: 重要情報の永続化**
```
長時間のセッション（多くのファイル編集）
→ コンテキスト使用率 > 80%
→ PreCompact発火
→ Hook:
  - 現在の変更内容を一時保存
  - 重要な変数値をファイルに書き出し
  - デバッグ情報の外部保存
→ コンテキスト圧縮実行
→ 重要情報は失われない
```

**シナリオ2: 作業チェックポイント作成**
```
複雑なリファクタリング作業中
→ メモリ制限に接近
→ PreCompact発火
→ Hook:
  - git stash作成
  - 現在の作業状態をスナップショット
  - 進行状況レポート生成
→ 圧縮後も作業継続可能
```

**実装例: コンテキスト最適化戦略**
```python
def optimize_before_compact():
    # 重要なコンテキストを外部保存
    important_context = {
        "current_task": get_current_task(),
        "modified_files": get_modified_files(),
        "test_results": get_latest_test_results(),
        "error_logs": get_recent_errors()
    }
    
    # セッションファイルに保存
    with open(f'.claude/sessions/{session_id}/context.json', 'w') as f:
        json.dump(important_context, f)
    
    # Claudeに要約を提供
    print("Context saved. Key points to remember after compaction:")
    print(f"- Working on: {important_context['current_task']}")
    print(f"- Modified: {', '.join(important_context['modified_files'])}")
```

### 8. Notification - 通知イベントの処理

#### 発火タイミング
Claudeが特定の**システム通知を生成した時**

#### 具体的な発火シナリオ

**シナリオ1: エラー通知の拡張処理**
```
Claude実行中にエラー発生
→ Notification発火 ("Error: Test failed")
→ Hook:
  - エラーログを詳細分析
  - 関連するStackOverflow記事を検索
  - チームのSlackに通知
→ より詳細な情報が利用可能に
```

**シナリオ2: 進行状況の外部通知**
```
Claude: "Completed 5 of 10 tasks"
→ Notification発火
→ Hook:
  - プログレスバー更新
  - 残り時間推定
  - デスクトップ通知表示
→ ユーザーが他の作業中でも進捗確認可能
```

**実装例: 通知の多段階処理**
```python
def handle_notification():
    notification = os.environ.get('CLAUDE_NOTIFICATION', '')
    
    # 通知タイプの判定
    if 'error' in notification.lower():
        # エラー通知の特別処理
        send_to_error_tracking(notification)
        create_github_issue(notification)
        
    elif 'completed' in notification.lower():
        # 完了通知
        play_sound('success.wav')
        update_dashboard(notification)
        
    elif 'warning' in notification.lower():
        # 警告通知
        log_warning(notification)
        if is_critical_warning(notification):
            send_email_alert(notification)
```

## 🔄 複合シナリオ例

### 完全自動化デプロイメントフロー
```
1. SessionStart → 環境確認、ブランチ作成
2. UserPromptSubmit → "Deploy new feature"にCI/CD状態を追加
3. PreToolUse → 本番ファイル編集時に承認要求
4. PostToolUse → 変更後に自動テスト実行
5. Notification → テスト結果を外部ダッシュボードに送信
6. Stop → 全テスト成功後に自動PR作成、デプロイトリガー
```

### TDD強制開発フロー
```
1. PreToolUse → テストファイルなしでの実装をブロック
2. PostToolUse → テスト実行、カバレッジチェック
3. Stop → カバレッジ < 80%の場合は完了をブロック
4. SubagentStop → テスト生成エージェントの結果を検証
```

## 📊 Hook発火頻度の目安

| Hook | 頻度 | 典型的なセッションでの回数 |
|------|------|--------------------------|
| PreToolUse | 非常に高 | 50-200回 |
| PostToolUse | 非常に高 | 50-200回 |
| UserPromptSubmit | 中 | 5-20回 |
| Stop | 低 | 1-3回 |
| SubagentStop | 低-中 | 0-10回 |
| SessionStart | 最低 | 1回 |
| PreCompact | 稀 | 0-2回 |
| Notification | 中 | 10-50回 |

この情報を使用して、パフォーマンスへの影響を考慮しながらHookを設計してください。