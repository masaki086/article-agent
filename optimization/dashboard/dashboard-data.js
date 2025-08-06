// Dashboard Data - Auto-generated at 2025-08-06 15:28:34
// このファイルは自動生成されます。手動で編集しないでください。

window.dashboardData = {
  "timestamp": "2025-08-06 15:28:34",
  "model": {
    "name": "",
    "type": "",
    "score": "95/100"
  },
  "tokens": {
    "total": 46209,
    "limit": 100000,
    "breakdown": {
      "システムルール": 3064,
      "会話履歴": 30000,
      "参照ファイル": 11145,
      "作業メモリ": 2000
    }
  },
  "session": {
    "startTime": "15:28:34",
    "turns": 15,
    "maxTurns": 20,
    "fileCount": 0,
    "currentTask": "未設定",
    "nextGoal": "未設定"
  },
  "status": {
    "overall": "warning",
    "level": "🟡",
    "message": "注意"
  },
  "files": [
  {
    "name": "CLAUDE.md",
    "lastAccess": "15:22:00",
    "tokens": 1845,
    "operation": "read"
  },
  {
    "name": "claude.md",
    "lastAccess": "15:22:15",
    "tokens": 2500,
    "operation": "read"
  },
  {
    "name": "define-series.md",
    "lastAccess": "15:22:30",
    "tokens": 1800,
    "operation": "edit"
  },
  {
    "name": "dashboard.html",
    "lastAccess": "15:22:45",
    "tokens": 5000,
    "operation": "edit"
  },
  {
    "name": "update-dashboard-js.sh",
    "lastAccess": "15:23:00",
    "tokens": 1200,
    "operation": "edit"
  }
],
  "warnings": {
    "30000": {
      "level": "🟡",
      "label": "注意",
      "action": "タスク完了を意識"
    },
    "50000": {
      "level": "🔴",
      "label": "警告",
      "action": "重要作業のみ"
    },
    "80000": {
      "level": "🛑",
      "label": "限界",
      "action": "即座にセッション終了"
    }
  }
};

// データ更新通知用イベント
if (typeof window.onDashboardDataLoaded === 'function') {
  window.onDashboardDataLoaded(window.dashboardData);
}
