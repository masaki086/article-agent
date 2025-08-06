# Optimization System - 精度劣化防止のためのファイルベース管理

## 概要
ClaudeCodeの回答精度が劣化する前に作業を完了させるための管理システムです。
メモリではなくファイルにコンテキストを保存し、作業の透明性と継続性を確保します。

## 目的
- **精度劣化の防止**: 長時間作業による精度低下を事前に防ぐ
- **作業単位の明確化**: 互いに影響しない範囲で作業を分割
- **コンテキストの永続化**: ファイルベースで情報を保存し、セッション間で引き継ぎ
- **透明性の確保**: 現在の状態と参照ファイルを人間に明示

## ディレクトリ構造
```
optimization/
├── README.md                    # このファイル
├── context/                     # コンテキスト永続化
│   ├── current-session.md      # 現在のセッション情報
│   ├── task-boundaries.md      # タスク境界の定義
│   └── reference-files.md      # 参照中のファイル一覧
└── limits/                      # 精度限界管理
    ├── indicators.md            # 劣化指標の定義
    └── thresholds.md            # 限界値の設定
```

## セットアップ方法

### 1. optimizationフォルダをプロジェクトにコピー
```bash
cp -r optimization /path/to/your/project/
```

### 2. settings.local.jsonを作成または編集
```json
{
  "hooks": {
    "user-prompt-submit": {
      "command": "bash optimization/scripts/detect-engine.sh > /dev/null 2>&1 && bash optimization/scripts/track-session.sh && bash optimization/scripts/update-dashboard.sh",
      "blocking": false,
      "timeout": 5000
    },
    "post-response": {
      "command": "bash optimization/scripts/update-indicators.sh && bash optimization/scripts/calculate-tokens.sh > /dev/null 2>&1",
      "blocking": false,
      "timeout": 5000
    },
    "file-change": {
      "command": "echo \"$(date '+%H:%M:%S')|${file_path}|edit|0\" >> optimization/context/.file_access.log",
      "blocking": false,
      "timeout": 1000
    }
  }
}
```

### 3. 完了！
**以上で自動的に動作開始します。** 手動操作は不要です。

## 自動実行される内容

### ユーザーが指示を入力するたびに（全自動）
- ✅ ターン数が自動カウント
- ✅ トークン使用量を計算
- ✅ AIエンジンを検出して閾値調整
- ✅ ダッシュボードが更新
- ✅ 限界接近時に警告表示

### 確認方法（必要な時のみ）
```bash
# 現在の状態を見る
cat optimization/context/session-dashboard.md

# 詳細なトークン使用量
bash optimization/scripts/calculate-tokens.sh

# 限界チェック
bash optimization/scripts/check-limits.sh
```

## 精度指標

| 指標 | 良好 🟢 | 注意 🟡 | 限界 🔴 |
|------|---------|---------|---------|
| ターン数 | < 10 | 10-15 | > 15 |
| トークン使用 | < 60% | 60-80% | > 80% |
| ファイル参照数 | < 5 | 5-10 | > 10 |
| エラー率 | < 5% | 5-15% | > 15% |

## 重要な原則

1. **予防優先**: 精度が落ちてからの対処ではなく、落ちる前に完了
2. **小さな単位**: 作業を小さく分割し、各単位で完結
3. **明確な境界**: タスク間の依存を最小化
4. **透明な状態**: 現在の状況を常に可視化

## 期待効果

- **精度維持**: 常に高精度な状態で作業
- **効率向上**: 無駄な修正作業の削減
- **継続性確保**: セッション間でのスムーズな引き継ぎ
- **信頼性向上**: 予測可能な品質の維持