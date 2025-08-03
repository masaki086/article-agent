# Qiita Article Batch Uploader

**Date:** 2025-01-03 | **Version:** 1.0

A secure TypeScript application for batch uploading article series to Qiita API.

## 🔒 Security Features

- API token loaded from secure config file (never hardcoded)
- Token file excluded from Git via .gitignore
- Sanitized logging (tokens are redacted)
- Secure HTTPS communication only

## 📋 Prerequisites

1. Node.js (v16 or higher)
2. Qiita API access token with `write_qiita` permission
3. Token configured in `/.claude/config/qiita-token.json`

## 🚀 Installation

```bash
cd post/qiita
npm install
```

## 📝 Usage

### Step 1: Upload a Series

```bash
npm run upload <seriesName>
```

Example:
```bash
npm run upload AIEraInfrastructure
```

### Step 2: Add Series Links (After Upload)

```bash
npm run update-links <seriesName>
```

This adds navigation links between all articles in the series.

### Development Mode

```bash
npm run dev <seriesName>              # Upload in dev mode
npm run dev:update <seriesName>        # Update links in dev mode
```

## 📁 Article Structure

The uploader expects articles to be organized as:

```
/articles/
  └── {SeriesName}/
      └── {ArticleName}/
          └── drafts/
              └── pages/
                  └── article.md  (or main.md)
```

## 🔄 Process Flow

### Upload Process
1. **Load** - Reads all articles from series directory
2. **Validate** - Extracts title and tags from markdown
3. **Upload** - Posts to Qiita API with rate limiting
4. **Archive** - Saves to `published/` directory with timestamp
5. **Track** - Stores article IDs and URLs for link updates

### Link Update Process
1. **Read** - Loads uploaded article information
2. **Generate** - Creates series navigation links
3. **Update** - Updates each article via Qiita API
4. **Save** - Archives updated versions

## ⚡ Features

- **Batch Processing**: Uploads multiple articles efficiently
- **Series Links**: Automatically adds navigation between articles
- **Rate Limiting**: Respects Qiita's 1000 requests/hour limit
- **Error Recovery**: Automatic retry with exponential backoff
- **Progress Tracking**: Real-time upload status
- **Logging**: Detailed logs saved to `logs/` directory
- **Article Tracking**: Stores article IDs/URLs in `data/` directory

## 📊 Output

After upload, articles are saved to:
```
/articles/{SeriesName}/{ArticleName}/published/article_YYYYMMDD.md
```

Each published file includes:
- Qiita URL as comment
- Timestamp
- Original content

## 🚨 Important Notes

1. **Never commit** `qiita-token.json` to Git
2. **Rate limits**: 1000 requests/hour for authenticated users
3. **Batch size**: Default 10 articles per batch
4. **Logs**: Check `logs/` directory for detailed operation logs

## 🛠️ Development

### Build
```bash
npm run build
```

### Clean
```bash
npm run clean
```

## 📈 Rate Limit Status

The application displays current rate limit status:
- Used requests
- Remaining requests
- Reset time

## 🐛 Troubleshooting

1. **Authentication Error**: Check token in config file
2. **Rate Limit**: Wait for reset or reduce batch size
3. **Article Not Found**: Verify file path structure
4. **No Title**: Ensure article has `# Title` heading