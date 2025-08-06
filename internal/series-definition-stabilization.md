**Date:** 2025-08-06 | **Version:** 1.0

# Series Definition Command Stabilization Guide

## Problem Analysis

### Current Issues with /define-series Command

1. **Context Contamination**
   - Long conversations affect command behavior
   - Previous discussions influence series definition
   - Command outputs vary based on conversation history

2. **Inconsistent File Creation**
   - Sometimes skips creating definition files
   - Proceeds directly to article writing unpredictably
   - File creation depends on context volume

3. **Automatic Execution Chain**
   - Series definition → article creation happens automatically
   - No clear breakpoint between phases
   - Difficult to control workflow progression

## Solutions and Best Practices

### 1. Context Isolation Strategy

#### Pre-execution Reset
```bash
# Before running /define-series, consider:
/reset  # Clear conversation context
```

#### Explicit Phase Separation
```markdown
## Phase 1: Series Definition ONLY
- Execute /define-series
- Create series structure files
- STOP after definition phase

## Phase 2: Article Creation (separate conversation)
- Start fresh conversation
- Reference created series files
- Begin article writing
```

### 2. Command Behavior Stabilization

#### Create Explicit Checkpoints
```yaml
define-series-workflow:
  step1: "Series concept input"
  checkpoint1: "CONFIRM series structure"
  step2: "Create definition files"
  checkpoint2: "VERIFY files created"
  step3: "Display next steps"
  stop: "DO NOT proceed to article writing"
```

#### Force File Creation Pattern
```markdown
## Mandatory Files for Series Definition
1. {SeriesName}/author.md - MUST create
2. {SeriesName}/reviewer.md - MUST create  
3. {SeriesName}/series-common.md - MUST create
4. {SeriesName}/README.md - Series overview

## Validation Before Proceeding
- [ ] All 4 files exist
- [ ] Files contain proper content
- [ ] Series structure is complete
```

### 3. Workflow Control Mechanisms

#### Explicit Stop Points
```yaml
series-definition-stops:
  - after_concept_discussion: "STOP for user confirmation"
  - after_file_creation: "STOP and show created files"
  - before_article_writing: "ALWAYS STOP - require explicit command"
```

#### Command Separation Pattern
```bash
# Phase 1 - Definition
/define-series --definition-only

# Phase 2 - Article (separate command)
/create-article --series {SeriesName} --article {ArticleName}
```

### 4. Implementation Recommendations

#### A. Command Modification Proposal
```javascript
// Pseudo-code for stabilized command
function defineSeriesStabilized(options) {
  // 1. Ignore conversation context
  const cleanContext = isolateCommandContext();
  
  // 2. Interactive series definition
  const seriesConfig = await interactiveDefine({
    ignoreHistory: true,
    forceInteractive: true
  });
  
  // 3. Mandatory file creation
  const files = createMandatoryFiles(seriesConfig);
  
  // 4. Explicit stop
  return {
    status: "definition_complete",
    files: files,
    nextStep: "Run /create-article when ready",
    autoProcceed: false  // NEVER auto-proceed
  };
}
```

#### B. Context Management Rules
```yaml
context-rules:
  define-series:
    max_context_tokens: 1000  # Limit context influence
    ignore_conversation: true  # Don't use prior discussion
    fresh_start: true          # Always start fresh
    
  create-article:
    reference_series_files: true  # Use created files
    ignore_define_discussion: true # Don't use definition chat
```

#### C. File Creation Enforcement
```javascript
// Mandatory file creation check
function validateSeriesFiles(seriesName) {
  const requiredFiles = [
    `articles/${seriesName}/author.md`,
    `articles/${seriesName}/reviewer.md`,
    `articles/${seriesName}/series-common.md`,
    `articles/${seriesName}/README.md`
  ];
  
  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
  return true;
}
```

## Practical Usage Guidelines

### For Stable Series Definition

1. **Start Fresh**
   ```bash
   /reset  # Clear context
   /define-series
   ```

2. **Verify Files**
   ```bash
   ls articles/{NewSeriesName}/
   # Should see: author.md, reviewer.md, series-common.md, README.md
   ```

3. **Stop and Review**
   - Review created files
   - Adjust if needed
   - DO NOT proceed immediately to article creation

4. **Article Creation (Later)**
   ```bash
   # In new conversation or after break
   /create-article --series {SeriesName}
   ```

### Context Volume Guidelines

| Context Size | Recommended Action |
|-------------|-------------------|
| < 5K tokens | Can proceed normally |
| 5K-10K tokens | Consider /reset |
| > 10K tokens | MUST /reset before /define-series |

### Workflow Separation Pattern

```mermaid
graph TD
    A[Start] --> B[/reset if needed]
    B --> C[/define-series]
    C --> D[Create Files]
    D --> E[STOP]
    E --> F[Review Files]
    F --> G{Files OK?}
    G -->|No| H[Manual Edit]
    G -->|Yes| I[New Session]
    I --> J[/create-article]
```

## Summary of Solutions

1. **Context Isolation**: Use /reset before /define-series
2. **File Creation**: Enforce mandatory file creation
3. **Workflow Control**: Explicit stops between phases
4. **Command Separation**: Separate definition from creation
5. **Validation**: Check files before proceeding

## Implementation Priority

1. **Immediate**: Document workflow separation
2. **Short-term**: Add validation checks
3. **Long-term**: Modify command behavior

This approach ensures consistent, predictable behavior regardless of conversation context or length.