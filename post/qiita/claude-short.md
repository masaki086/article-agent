# Qiita Upload - Core Rules

**Date:** 2025-01-03 | **Version:** 2.0

## Key Points
- Token: `/.claude/config/qiita-token.json`
- Rate: 1000/hr (keep 100 buffer)
- Rollback: fail any→delete all series uploads
- Commands: `/post-qiita [seriesName]`

## Error Handling
- 429: wait and retry
- 401: stop (auth fail)  
- 5xx: retry max 3x
- Series fail: rollback all

## Implementation
- Upload batch → Add links → Rollback on any failure
- Log structured, mask tokens
- Validate inputs before API calls