# Post to Qiita Command

**Date:** 2025-08-05 | **Version:** 2.1

⚠️ **CRITICAL SAFETY NOTICE:**
This command PUBLISHES articles to Qiita, making them publicly available.
Always requires explicit user confirmation before publishing.

This command uploads a series of articles to Qiita and automatically adds navigation links between them.

## Usage

- `/post-qiita` - Interactive mode: shows series list and prompts for selection
- `/post-qiita <seriesName>` - Direct mode: uploads specified series immediately
- `/post-qiita <seriesName> --skip` - Skip already uploaded articles (default)
- `/post-qiita <seriesName> --update` - Update existing articles
- `/post-qiita <seriesName> --force` - Create duplicates (not recommended)

## Process Flow

1. **Series Selection**: Choose which series to upload
2. **Pre-upload Check**: Verify API token and article files
3. **Safety Confirmation**: MANDATORY user confirmation before publishing
4. **Article Processing**: Remove images and prepare text-only content
5. **Batch Upload**: Upload all articles with progress tracking
6. **Link Generation**: Automatically add series navigation links
7. **Summary Report**: Display upload results and URLs

## Features

- Interactive series selection
- **MANDATORY user confirmation before publishing**
- **Image removal for clean text-based articles**
- Real-time progress updates
- Automatic error recovery
- Series link management
- Detailed logging
- **Safety-first design prevents accidental publishing**

## Requirements

- Qiita API token configured in `/.claude/config/qiita-token.json`
- Articles in standard directory structure
- Node.js environment available

## Error Handling

- Token validation before upload
- Rate limit management
- Retry logic for failures
- Partial upload recovery

---

## Implementation

```bash
# Use the stable Python script for reliable execution
python3 .claude/commands/post-qiita.py "$1"
```