# Create Article Command (v1.0)

## Command Purpose
Create individual articles for an existing series with template selection, custom format options, and optimized context management.

## ⚠️ PREREQUISITE
**Series must already exist**: Run `/define-series` first to create series definition files in `/articles/shared-templates/series/{SeriesName}/`

## Context Optimization Strategy

### Before Starting
1. **Check context size**: If > 5000 tokens, recommend `/reset`
2. **After reset**: Load `/articles/shared-templates/optimization/english-base.md`
3. **Load series files**: Only what's needed for the specific article

### Token Budget
```yaml
token_allocation:
  definitions: 3500      # Templates and personas
  article_content: 40000 # Main content creation
  review: 5000          # Quality checking
  buffer: 1500          # Unexpected needs
  total: 50000          # Stay under limit
```

## Command Parameters

```bash
/create-article --series {SeriesName} [options]

Required:
  --series          Series name (must exist in shared-templates/series/)

Optional:
  --article         Article name (default: interactive selection)
  --template        Pattern template (technical/tutorial/discussion)
  --custom-format   Create article-specific format (true/false)
  --custom-persona  Use different persona for this article
  --workflow        Creation workflow (interactive/automatic/resource-based)
  --resource        Source file for resource-based creation
```

## Interaction Flow

### Step 1: Series Validation
```yaml
validation:
  - Check series exists: /articles/shared-templates/series/{SeriesName}/
  - Load series definitions:
    - personas-roles.md
    - format.md
    - README.md
  - Verify series structure
```

### Step 2: Article Selection
If not specified via --article parameter:
```
📚 Series: {SeriesName}

Available articles to create:
1. Article1Name - [Not created]
2. Article2Name - [Created]
3. Article3Name - [Not created]

Which article would you like to create? (Enter number):
```

### Step 3: Template Selection
```
🎨 Template Selection for {ArticleName}

1. **Use series default** - From series format.md
2. **Technical pattern** - Deep implementation focus
3. **Tutorial pattern** - Step-by-step guide
4. **Discussion pattern** - Analysis and perspectives
5. **Custom format** - Create article-specific format

Your choice:
```

### Step 4: Persona Configuration
```
👤 Author Configuration

Series default: {default_persona}

Options:
1. Use series default persona
2. Override with different persona for this article
3. Multi-persona collaboration

Your choice:
```

### Step 5: Workflow Selection
```
⚙️ Creation Workflow

1. **Interactive** - Checkpoints for review
2. **Automatic** - Generate complete article
3. **Resource-based** - Adapt from existing content

Your choice:
```

### Step 6: Custom File Creation (if needed)
If custom format or persona selected:
```yaml
create_custom_files:
  location: /articles/series/{SeriesName}/{ArticleName}/custom/
  files:
    - format.md      # If custom format selected
    - personas-roles.md  # If custom persona selected
```

### Step 7: Article Generation

#### Interactive Workflow
```yaml
interactive_checkpoints:
  1_structure:
    action: "Generate article outline"
    review: "Approve structure? (yes/no/edit)"
    
  2_introduction:
    action: "Write introduction section"
    review: "Continue with main content? (yes/no/edit)"
    
  3_main_content:
    action: "Generate main content"
    review: "Proceed to conclusion? (yes/no/edit)"
    
  4_conclusion:
    action: "Write conclusion"
    review: "Ready for quality check? (yes/no/edit)"
```

#### Automatic Workflow
```yaml
automatic_generation:
  phases:
    - Load all templates and definitions
    - Generate complete article structure
    - Write all sections sequentially
    - Apply quality checks
    - Save to drafts/pages/article.md
```

#### Resource-Based Workflow
```yaml
resource_based:
  source: /articles/resources/{filename}.md
  transformation:
    - translate: Convert language
    - adapt: Modify for context
    - expand: Add detail
    - summarize: Condense content
```

### Step 8: Quality Assurance
```yaml
quality_checks:
  automatic:
    - Format validation
    - Code syntax check
    - Link verification
    - Markdown lint
    
  score_targets:
    - Technical accuracy: 100%
    - Completeness: 95%
    - Readability: 90%
    - Format consistency: 100%
```

### Step 9: File Save and Report
```
✅ Article Created Successfully

📁 Location: /articles/series/{SeriesName}/{ArticleName}/drafts/pages/article.md
📊 Quality Score: 96/100
📝 Word Count: 2,847
💾 Custom Files: {if any created}

Next steps:
- Review the article
- Run quality checks if needed
- Use /post-qiita when ready to publish
```

## Template Loading Hierarchy

```yaml
template_priority:
  1_article_custom:
    path: /articles/series/{SeriesName}/{ArticleName}/custom/
    when: Custom format/persona specified
    
  2_series_custom:
    path: /articles/series/{SeriesName}/custom/
    when: Series has custom overrides
    
  3_series_shared:
    path: /articles/shared-templates/series/{SeriesName}/
    when: Always (base series definition)
    
  4_pattern:
    path: /articles/shared-templates/patterns/{pattern}.md
    when: Pattern template selected
    
  5_base:
    path: /articles/shared-templates/base/
    when: Always (fallback defaults)
```

## Example Commands

### Basic Article Creation
```bash
/create-article --series AIOptimization
# Interactive prompts for article selection and options
```

### Specific Article with Pattern
```bash
/create-article --series AIOptimization --article 1-Introduction --template tutorial
```

### Custom Format and Persona
```bash
/create-article --series AIOptimization \
  --article 2-Advanced \
  --custom-format true \
  --custom-persona alexandra_sterling
```

### Resource-Based Creation
```bash
/create-article --series AIOptimization \
  --article 3-CaseStudy \
  --workflow resource-based \
  --resource /articles/resources/ml-optimization.md
```

## Directory Structure Created

```
/articles/series/{SeriesName}/{ArticleName}/
├── custom/                    # Only if custom options selected
│   ├── format.md             # Article-specific format
│   └── personas-roles.md     # Article-specific personas
├── drafts/
│   ├── pages/
│   │   └── article.md        # Main article content
│   ├── images/               # Article images
│   └── diagrams/             # Mermaid diagrams
├── published/                # Empty until publishing
└── reviews/                  # Review feedback
```

## Quality Features

### Token Optimization
- Load only required templates
- Reference shared content
- Avoid duplication
- Achieve 25-35% token reduction

### Consistency Maintenance
- Series patterns enforced
- Persona voice consistency
- Format standardization
- Cross-article references

### Error Prevention
- Template validation
- Path verification
- Format checking
- Dependency resolution

## Important Notes

1. **Series Must Exist**: Always run `/define-series` first
2. **Context Reset**: Recommended for optimal quality
3. **No Auto-Publish**: Articles stay in drafts/ until manual publishing
4. **Custom Options**: Use sparingly to maintain series consistency
5. **Quality Target**: Aim for 95/100 minimum score

## Workflow Recommendations

### For New Series
```bash
1. /reset                          # Clean context
2. /define-series                  # Create series structure
3. /reset                          # Clean for article creation
4. /create-article --series Name   # Create first article
5. Repeat 3-4 for each article
```

### For Existing Series
```bash
1. /reset                          # Start clean
2. /create-article --series Name   # Load minimal context
```

## Error Handling

### Series Not Found
```
❌ ERROR: Series "Name" not found
📁 Expected location: /articles/shared-templates/series/Name/
💡 Run /define-series first to create the series
```

### Template Not Found
```
❌ ERROR: Pattern template "name" not found
📁 Available patterns: technical, tutorial, discussion
💡 Use one of the available patterns or series default
```

### Context Overload
```
⚠️ WARNING: Context size exceeds 5000 tokens
💡 Recommendation: Run /reset before continuing
This ensures optimal article quality
```

---
**END OF COMMAND DEFINITION**