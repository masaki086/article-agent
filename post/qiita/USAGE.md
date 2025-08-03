# Qiita Upload - Quick Reference

**Date:** 2025-01-03 | **Version:** 1.0

## Commands
- `/post-qiita` - Interactive mode
- `/post-qiita <seriesName>` - Direct upload

## Process
1. Upload articles → 2. Add series links → 3. Rollback on failure

## Config
- Token: `/.claude/config/qiita-token.json`
- Rate: 1000/hour, keeps 100 buffer
- Batch: 10 articles max

## Rollback
- Any upload failure = delete all uploaded articles from series
- Ensures series consistency