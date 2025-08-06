**Date:** 2025-08-06 | **Version:** 1.0

# /define-series Command Guard Instructions

## Critical Execution Rules

### 1. Pre-Execution Checks
```yaml
before-define-series:
  check1: "Context size > 5K tokens?"
  action1: "If yes, execute /reset first"
  check2: "Previous conversation exists?"
  action2: "If yes, recommend /reset"
  check3: "User wants immediate article creation?"
  action3: "Explicitly deny - separate phases required"
```

### 2. Mandatory File Creation
```yaml
required-files:
  - path: "articles/{SeriesName}/author.md"
    content: "Persona reference from /articles/personas/individuals/"
    validation: "Must exist before proceeding"
    
  - path: "articles/{SeriesName}/reviewer.md"
    content: "Review configuration"
    validation: "Must exist before proceeding"
    
  - path: "articles/{SeriesName}/series-common.md"
    content: "Series-wide common settings"
    validation: "Must exist before proceeding"
    
  - path: "articles/{SeriesName}/README.md"
    content: "Series overview and structure"
    validation: "Must exist before proceeding"
```

### 3. Execution Boundaries
```yaml
execution-stops:
  after-concept: 
    action: "STOP for user confirmation"
    message: "Series concept defined. Confirm to proceed with file creation."
    
  after-files:
    action: "STOP completely"
    message: "Series definition complete. Files created at articles/{SeriesName}/"
    next: "To create articles, start a new session and use /create-article"
    
  prevent-auto-article:
    rule: "NEVER proceed to article writing automatically"
    enforcement: "Hard stop after file creation"
```

### 4. Context Isolation Rules
```yaml
context-management:
  define-series:
    max-context: 1000  # Limit tokens to consider
    ignore-history: true  # Don't use conversation history
    fresh-start: true  # Always start with clean slate
    
  validation:
    - "Check if all 4 required files exist"
    - "Verify file contents are non-empty"
    - "Confirm series structure is complete"
```

## Implementation Checklist

### Phase 1: Series Definition
- [ ] Check context size (> 5K tokens requires /reset)
- [ ] Execute /define-series
- [ ] Interactive series design
- [ ] Create ALL 4 mandatory files
- [ ] Verify files created
- [ ] STOP - Do not proceed to article

### Phase 2: Article Creation (Separate Session)
- [ ] Start new conversation
- [ ] Reference existing series files
- [ ] Use /create-article command
- [ ] Follow article workflow

## Error Prevention

### Common Mistakes to Avoid
1. **Skipping file creation** - All 4 files are mandatory
2. **Auto-proceeding to articles** - Must stop after definition
3. **Context contamination** - Use /reset when needed
4. **Missing validation** - Always verify files exist

### Validation Script
```bash
# Check if all required files exist
SERIES_NAME="YourSeriesName"
FILES=(
  "articles/$SERIES_NAME/author.md"
  "articles/$SERIES_NAME/reviewer.md"
  "articles/$SERIES_NAME/series-common.md"
  "articles/$SERIES_NAME/README.md"
)

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ERROR: Missing required file: $file"
    exit 1
  fi
done
echo "✅ All required files created successfully"
```

## Summary

The /define-series command MUST:
1. Create all 4 mandatory files
2. Stop after file creation
3. Never auto-proceed to article writing
4. Work in isolation from conversation context

This ensures consistent, predictable behavior regardless of context length or conversation history.