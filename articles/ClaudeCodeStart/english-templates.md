**日付:** 2025-08-02 | **バージョン:** 1.0

# 英語版テンプレート集（シリーズ統合版）

## Basic CLAUDE.md Template (Article #1)
```markdown
# Project Overview
# This project is a personal task management web application

## Tech Stack
- Frontend: React 18 + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT

# Development Rules
## Coding Standards
- Use ESLint + Prettier
- Function names start with verbs
- Component names use PascalCase

# Important Constraints
- Encrypt personal information before storage
- API responses must be under 200ms
- IE11 support not required
```

## Practical Template (Article #2)
```markdown
# TaskFlow - Personal Task Management Web Application

## Project Purpose
Provide efficient task management for freelancers and remote workers.
Focus on simplicity and fast operation.

## Tech Stack
### Frontend
- React 18.2+ (Hooks-centered)
- TypeScript 5.0+
- Vite (build tool)
- Tailwind CSS

### Backend
- Node.js 18+ + Express.js 4.18+
- PostgreSQL 15+ + Prisma ORM

# Development Rules
## Git Workflow
- main: Production sync
- develop: Development integration
- feature/[name]: Feature development

## Testing Policy
- Unit: Jest + React Testing Library
- Coverage: 80%+ overall
```

## Advanced Template (Article #3)
```markdown
# Advanced Requirements

## Security Requirements
### Password Policy
- Length: 8-128 characters
- Hashing: bcrypt (saltRounds: 12)

### Session Management
- JWT Access Token: 15min expiry
- Refresh Token: 7 days expiry

## Performance Requirements
- Authentication API: Avg 200ms, 95th percentile 500ms
- Task CRUD: Avg 100ms, 95th percentile 300ms

## Error Handling
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
  }
}
```
```

## Complete Templates (Article #4)
[プロジェクトタイプ別の全テンプレートをここに統合]