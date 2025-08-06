# Series Definition Interactive Command

## Command Purpose
Guide users through creating optimized article series with proper structure, unified persona selection, and token-efficient configuration.

## ⚠️ ABSOLUTE PROHIBITION RULE - NO AUTO-PUBLISH
**CRITICAL SAFETY CONSTRAINT:**
- This command MUST NEVER automatically execute post-qiita or any publishing commands
- This command MUST STOP after article creation and file generation
- NO automatic Qiita publishing, NO automatic post-qiita execution
- Articles are created in DRAFT state only and remain in drafts/ folders
- Publishing requires separate manual /post-qiita command execution
- CLEAR SEPARATION between "series creation" and "series publishing" phases

## Required Reading
Before series definition, this command references:
- `/claude.md`: Project-wide workflow and optimization guidelines
- `/articles/shared-templates/`: Reusable optimization templates
- `/personas/individuals/`: Unified persona definitions
- `/personas/roles/`: Role-specific behavior patterns

## Interaction Flow

### Step 1: Series Concept Discovery
Ask the user:
1. **Series Topic**: "What is the main topic/technology you want to cover?"
2. **Series Goal**: "What should readers achieve after completing this series?"
3. **Complexity Level**: "Is this beginner, intermediate, advanced, or mixed-level content?"

**CRITICAL NAMING VALIDATION:**
- All series names MUST be in English only (no Japanese, no Romaji)
- All article names MUST be in English only (no Japanese, no Romaji)
- Article names MUST start with numbering (1-, 2-, 3-, etc.)
- Validate names using character detection and provide English alternatives when validation fails

### Step 2: Target Audience Analysis
Guide the user to define:
1. **Primary Readers**: "Who is your main target audience?"
   - Suggest unified personas from `/personas/individuals/` in reader role based on their topic
2. **Reader Problems**: "What specific problems are they trying to solve?"
3. **Expected Outcomes**: "What should they be able to do after reading?"

### Step 3: Series Structure Planning
Help determine:
1. **Number of Articles**: Recommend 3-6 articles for token efficiency
2. **Learning Progression**: Map out step-by-step skill building
3. **Article Relationships**: Define how articles connect and build on each other

**NAMING VALIDATION ENFORCEMENT:**
Before accepting any series or article names, perform these validation checks:

1. **Character Detection**: Scan for Hiragana (ひらがな), Katakana (カタカナ), Kanji (漢字), or common Romaji patterns
2. **Series Name Validation**: 
   - Must contain only English letters, numbers, and basic punctuation
   - No spaces allowed (use CamelCase: "AIPersonaRoundtable")
   - No Japanese characters detected
3. **Article Name Validation**:
   - Must start with number prefix (1-, 2-, 3-, etc.)
   - Must be in English only after the number prefix
   - Use CamelCase or dash-separated format: "1-AIHumanDistanceDependencyVsCollaboration"
4. **Error Handling**: If validation fails, show specific error and suggest English alternatives

**Example Validation Errors:**
- ❌ "AI人格座談会" → ✅ "AIPersonaRoundtable"
- ❌ "AIと人類の距離感" → ✅ "1-AIHumanDistanceDependencyVsCollaboration"
- ❌ "AI時代の人類の成長" → ✅ "2-HumanGrowthInAIEraChallengeVsComfort"

### Step 4: Unified Persona Selection
Present options:
1. Show available unified personas from `/personas/individuals/` that can serve as authors
2. Explain which persona fits their content style and reader needs
3. Suggest role configurations (author + reviewer/reader roles from same persona)
4. Option for multi-persona collaboration (different unified personas for different roles)

### Step 5: Content Format Optimization
Configure based on `/articles/claude.md` guidelines:
1. **Technical Depth**: How detailed should explanations be?
2. **Code Examples**: What types and how many?
3. **Visual Elements**: Diagrams, flowcharts, screenshots needed?
4. **Token Efficiency**: Ensure 25-35% reduction through shared template usage
5. **Workflow Alignment**: Match Phase 1 (Definition) → Phase 2 (Creation) process

### Step 6: Series Generation
Automatically create:
1. **Series Directory**: `/articles/{SeriesName}/`
2. **author.md**: Unified persona configuration in author role (references shared templates)
3. **reviewer.md**: Review setup using same or different unified personas
4. **Article directories**: Individual article folders with draft structure

### Step 7: Task Management Setup
Before proceeding to content generation:

1. **Todo Creation**: Use Claude Code's built-in todo system
   - `/todo: Setting up series structure for [SeriesName]`
   - `/todo: Configuring unified persona [persona_name] in author role`
   - `/todo: Generating Article 1 of N: [ArticleName]`
   - `/todo: Generating Article 2 of N: [ArticleName]` (repeat for each article)
   - `/todo: Quality checking completed articles`
   - `/todo: Final series review and completion`

2. **Progress Tracking**: Maintain visibility throughout process
   - "Setting up series structure for [SeriesName]"
   - "Configuring unified persona [persona_name] in author role"
   - "Generating Article 1 of N: [ArticleName]"
   - "Quality checking completed articles"

### Step 8: Article Content Generation
After series structure is created, automatically proceed to generate article content:
1. **Ask user confirmation**: "Shall I proceed to generate all {N} articles in this series?"
2. **If confirmed, generate each article sequentially**:
   - Reference `series-common.md` for consistent style
   - Use `optimized-format.md` for structure
   - Apply unified persona from `author.md` in author role
   - Generate full article content (6,000-10,000 words)
   - **Update todo**: Mark each article as "completed" when finished
3. **Progress updates**: "Article {N} of {Total} completed - Todo updated"
4. **User checkpoints**: Ask "Continue with next article?" between each generation
5. **Automatic Quality Check**: After each article completion, run comprehensive quality checks
   - `/fix: Remove duplicate metadata and timestamps`
   - `/fix: Standardize TypeScript code examples`
   - `/fix: Apply unified persona consistency`
   - Apply unified persona in reviewer/proofreader roles for quality assurance
6. **Final completion**: "Series complete! {N} articles generated and quality-checked. All todos completed."
   
⚠️ **MANDATORY COMPLETION MESSAGE:**
"Articles created successfully in DRAFT state in drafts/ folders. NO automatic publishing performed.
To publish articles to Qiita, use /post-qiita command separately for each article when ready.
This ensures you have full control over when your content goes live."

### Step 9: Diagram Generation
After all articles are generated, automatically create diagrams:
1. **Execute /generate-diagrams**: Scan all articles for diagram placeholders
2. **Create visuals**: Generate Mermaid diagrams with consistent styling
3. **Update articles**: Replace placeholders with image references
4. **Progress report**: "Generated [N] diagrams for series"

### Step 10: Automatic Quality Check (Enhanced with /fix)
After diagram generation, automatically perform:

**Format Consistency Checks:**
- Check for duplicate metadata (Generated Tags/timestamps)
- Verify markdown syntax correctness
- Ensure code block opening/closing tag correspondence
- Check directory structure display consistency

**Content Quality Checks:**
- Scan for typos and inconsistent terminology
- Verify logical flow and series consistency
- Check technical accuracy and version information
- Validate TypeScript code examples for type safety

**Automated Corrections (via Claude Code /fix):**
- `/fix: Remove duplicate Generated Tags/timestamps`
- `/fix: Fix TypeScript type safety issues`
- `/fix: Remove unnecessary consecutive ``` tags`
- `/fix: Standardize technical version notation`
- `/fix: Remove trailing whitespace in code blocks`
- `/fix: Apply unified persona consistency fixes`

**Quality Reporting & Todo Updates:**
- Generate quality score (target: 95+/100)
- Report fixed issues to user
- `/todo: Article N quality check completed - Score: X/100` (mark as completed)
- Highlight any remaining manual fixes needed
- Mark quality assurance todo as completed using Claude Code's todo system

Note: Shared optimization templates are available at `/articles/shared-templates/`:
- `series-common.md`: Character settings, common patterns
- `english-templates.md`: Integrated English templates  
- `optimized-format.md`: Token-efficient article template
- `author.md`: Reusable author persona template
- `reviewer.md`: Reusable reviewer setup template

## Interactive Prompts

### Opening Prompt
```
🚀 Welcome to Series Definition Assistant!

⚠️ **CRITICAL NOTICE - NO AUTO-PUBLISH:**
This command creates articles in DRAFT state only. NO automatic publishing to Qiita.
You must manually run /post-qiita if you want to publish articles later.

I'll help you create an optimized article series with:
- Token-efficient structure (25-35% reduction via shared templates)
- Unified persona system (one character, multiple roles)
- Consistent character and style across all content
- Auto-generated templates (shared-templates/ utilization)
- **ENGLISH-ONLY naming validation** (no Japanese/Romaji allowed)
- **Articles remain in drafts/ folder until manual publishing**

📋 **Task Management**: This process will automatically create and track todo items for each major step, including individual article generation.

🔤 **IMPORTANT NAMING RULES:**
- Series names: English only, CamelCase (e.g., "AIPersonaRoundtable")
- Article names: English only with number prefix (e.g., "1-AIHumanDistanceAnalysis")
- NO Japanese characters (ひらがな/カタカナ/漢字) or Romaji allowed
- Validation errors will show English alternatives

🚫 **PUBLISHING NOTICE:**
- This command STOPS after creating articles in drafts/
- NO automatic Qiita publishing
- Use /post-qiita separately if you want to publish

Let's start with your series concept:
**What topic or technology do you want to teach?**
```

### Follow-up Questions
```
📊 Great choice! Now let's understand your readers:

1. **Target Audience**: Who should read this series?
   - [ ] Complete beginners (never used this technology)
   - [ ] Some experience (used basics, want to go deeper)  
   - [ ] Experienced users (looking for advanced techniques)
   - [ ] Mixed audience (cover multiple levels)

2. **Reader's Current Problem**: What challenge are they facing?

3. **Success Outcome**: After reading your series, they should be able to:
```

### Persona Recommendation
```
🎭 Based on your topic "{topic}" and audience "{audience}", I recommend:

**Unified Persona Options:**
1. **tanukichi** - Perfect for practical, hands-on content with humor
   - ✅ Fits: AI/development tools, real-world examples
   - Roles: Author (witty, practical) + Reader (critical, realistic) + Reviewer (experience-focused)
   - Style: Practical, includes failure stories, engaging

2. **alexandra_sterling** - Great for comprehensive, systematic content
   - ✅ Fits: Architecture, advanced concepts, theoretical foundations
   - Roles: Author (academic, thorough) + Reader (theory-focused) + Reviewer (perfection-oriented)
   - Style: Systematic, complete, professional

3. **meijyab** - Excellent for practical, cost-conscious content
   - ✅ Fits: Resource-constrained solutions, international perspectives
   - Roles: Proofreader (cultural awareness) + Reader (budget-conscious) + Reviewer (practical focus)
   - Style: Realistic, culturally aware, cost-effective

Which persona best matches your vision? You can also use multiple personas for different perspectives.
```

### Structure Recommendation
```
📚 Recommended Series Structure for "{topic}":

**Option A: Progressive Skill Building (4 articles)**
1. Foundations - Core concepts and setup
2. Practical Application - Hands-on implementation  
3. Advanced Techniques - Professional-level skills
4. Real-world Integration - Production-ready solutions

**Option B: Problem-Solution Format (3 articles)**
1. Common Problems - What goes wrong and why
2. Solution Strategies - Step-by-step fixes
3. Prevention & Best Practices - Avoid future issues

Which approach resonates with your teaching style?
```

## Output Generation

After collecting all information, generate:

### 1. Series Directory Structure
**NAMING VALIDATION REQUIRED BEFORE CREATION:**
Before creating any directories, validate all names using these rules:

```bash
# VALIDATION STEPS:
# 1. Check SeriesName: English-only, CamelCase, no spaces
# 2. Check ArticleNames: English-only with number prefix (1-, 2-, 3-)
# 3. Reject if Japanese characters (ひらがな/カタカナ/漢字) detected
# 4. Reject if common Romaji patterns detected

# ONLY CREATE IF VALIDATION PASSES:
mkdir -p articles/{ValidatedSeriesName}
mkdir -p articles/{ValidatedSeriesName}/1-{ValidatedArticle1Name}/drafts/pages
mkdir -p articles/{ValidatedSeriesName}/2-{ValidatedArticle2Name}/drafts/pages
# ... for each article (numbered: 1-, 2-, 3-, etc.)

# VALIDATION EXAMPLES:
# ❌ INVALID: "AI人格座談会" (contains Japanese characters)
# ✅ VALID: "AIPersonaRoundtable"
# ❌ INVALID: "AIと人類の距離感" (contains Japanese characters)
# ✅ VALID: "1-AIHumanDistanceAnalysis"
```

### 2. Complete File Generation
Generates all optimized files:

**series-common.md**
```markdown
**Date:** {current_date} | **Version:** 1.0

# {SeriesName} Series Common Information

## Author Character: {selected_persona}
[Customize based on user preferences]

## Series Learning Flow
{generated_progression}

## Common Message Patterns
{persona_specific_patterns}

## Target Readers
{defined_audience}
```

**author.md** (統合ペルソナ使用)
```markdown
**Date:** {current_date} | **Version:** 1.0

# 執筆者設定: {selected_persona_id}

参照ファイル: /personas/individuals/{selected_persona_id}.md
テンプレート: /articles/shared-templates/author.md

## 役割設定
- **主要役割**: Author (執筆者として)
- **副次役割**: {additional_roles} (品質向上のため)
- **役割切り替え**: [ペルソナ名 as 執筆者] / [ペルソナ名 as 読者] など

## カスタマイズ（このシリーズ専用）
- **重点テーマ**: {series_theme}
- **特別な文体調整**: {style_customization}
- **読者層への配慮**: {target_audience_consideration}
- **役割間の一貫性**: {character_consistency_notes}

## 共有テンプレート参照
- **共通設定**: `/articles/shared-templates/series-common.md`
- **最適化フォーマット**: `/articles/shared-templates/optimized-format.md`
- **役割別行動**: `/personas/roles/author-behaviors.md`
```

**reviewer.md** (統合ペルソナ使用)
```markdown
**Date:** {current_date} | **Version:** 1.0

# {SeriesName} レビュワー設定

参照テンプレート: /articles/shared-templates/reviewer.md

## 統合ペルソナ設定
### 主要レビュワー
- **ペルソナ ID**: {primary_reviewer_persona}
- **レビュー役割**: {reviewer_roles} (reviewer/proofreader/reader)
- **参照ファイル**: /personas/individuals/{primary_reviewer_persona}.md

### 追加視点（必要に応じて）
- **対照ペルソナ**: {contrasting_persona} (異なる視点での評価)
- **専門特化ペルソナ**: {specialist_persona} (特定領域の深掘り)

## 役割別評価観点
- **[ペルソナ as レビュワー]**: {reviewer_focus}
- **[ペルソナ as 校正者]**: {proofreader_focus}
- **[ペルソナ as 読者]**: {reader_focus}

## 共有テンプレート参照
- **共通設定**: `/articles/shared-templates/series-common.md`
- **最適化フォーマット**: `/articles/shared-templates/optimized-format.md`
- **役割別行動**: `/personas/roles/{role}-behaviors.md`
```

Note: The series will reference shared optimization templates and unified personas:
- `/articles/shared-templates/series-common.md`: Common character settings
- `/articles/shared-templates/english-templates.md`: Reusable English code templates
- `/articles/shared-templates/optimized-format.md`: Token-efficient article template
- `/personas/individuals/{persona_id}.md`: Unified persona with multiple roles
- `/personas/roles/{role}-behaviors.md`: Role-specific behavior patterns
- 25-35% token reduction through shared references and persona consistency

### 3. Article Content Generation Process
After series structure creation, the command will:
1. **Confirm article generation**: Ask user "Shall I proceed to generate all {N} articles?"
2. **Sequential article creation**:
   - Load series-common.md for consistent style
   - Apply unified persona in author role and reviewer settings
   - Generate full article content (6,000-10,000 words)
   - Save to `/articles/{SeriesName}/{N}-{ArticleName}/drafts/pages/article.md`
   - **Automatically invoke quality-checker agent**
   - Apply automatic corrections and generate quality report
3. **User checkpoints**: Ask "Continue with next article?" between generations
4. **Progress tracking**: "Article {N} of {Total} completed - Quality Score: {score}/100"
5. **Series completion**: Generate all articles in sequence until complete with quality assurance

⚠️ **PUBLISHING PROHIBITION ENFORCEMENT:**
- Command MUST STOP after article generation and quality checks
- NO automatic /post-qiita execution
- NO automatic Qiita API calls
- Articles remain in drafts/ state only
- User must manually execute /post-qiita for publishing

## Detailed Naming Validation Logic

### Character Detection Algorithm
```javascript
// Validation function to implement in the command
function validateNaming(input) {
  // Japanese character ranges
  const hiragana = /[\u3040-\u309F]/;
  const katakana = /[\u30A0-\u30FF]/;
  const kanji = /[\u4E00-\u9FAF]/;
  const japaneseFullWidth = /[\uFF00-\uFFEF]/;
  
  // Common Romaji patterns that suggest Japanese origin
  const romaji = /\b(nihon|nippon|wakaru|arigatou|sayonara|konnichiwa|genki|desu|masu|senpai|kouhai|otaku)\b/i;
  
  if (hiragana.test(input) || katakana.test(input) || kanji.test(input) || japaneseFullWidth.test(input)) {
    return { valid: false, reason: "Contains Japanese characters", type: "japanese" };
  }
  
  if (romaji.test(input)) {
    return { valid: false, reason: "Contains Romaji patterns", type: "romaji" };
  }
  
  return { valid: true };
}

// Series name validation
function validateSeriesName(name) {
  const baseValidation = validateNaming(name);
  if (!baseValidation.valid) return baseValidation;
  
  // English-only, CamelCase, no spaces
  if (/\s/.test(name)) {
    return { valid: false, reason: "Series names cannot contain spaces. Use CamelCase instead.", type: "format" };
  }
  
  if (!/^[A-Za-z0-9]+$/.test(name)) {
    return { valid: false, reason: "Series names must contain only English letters and numbers", type: "format" };
  }
  
  return { valid: true };
}

// Article name validation
function validateArticleName(name) {
  const baseValidation = validateNaming(name);
  if (!baseValidation.valid) return baseValidation;
  
  // Must start with number prefix
  if (!/^\d+-/.test(name)) {
    return { valid: false, reason: "Article names must start with number prefix (1-, 2-, 3-, etc.)", type: "format" };
  }
  
  // Check the part after the number prefix
  const afterPrefix = name.replace(/^\d+-/, '');
  if (!/^[A-Za-z0-9-]+$/.test(afterPrefix)) {
    return { valid: false, reason: "Article names must use only English letters, numbers, and dashes after the number prefix", type: "format" };
  }
  
  return { valid: true };
}
```

### Error Messages and Suggestions
When validation fails, provide these specific error messages and alternatives:

**For Japanese Characters:**
```
❌ ERROR: "{input}" contains Japanese characters
🔤 SUGGESTION: Translate to English and use CamelCase
📝 Example: "AI人格座談会" → "AIPersonaRoundtable"
```

**For Romaji Patterns:**
```
❌ ERROR: "{input}" appears to use Romaji (romanized Japanese)
🔤 SUGGESTION: Use proper English terminology instead
📝 Example: "nihon-tech" → "JapanTech" or "japanese-technology"
```

**For Format Issues:**
```
❌ ERROR: "{input}" format is incorrect
🔤 SUGGESTION: Follow naming rules:
- Series: CamelCase, no spaces (e.g., "AIPersonaRoundtable")
- Articles: Number prefix + English (e.g., "1-AIHumanDistanceAnalysis")
```

## Usage Instructions

To use this command:
```
/define-series "Your Series Topic Here"
```

**VALIDATION ENFORCEMENT:**
The command will now:
1. **Reject any Japanese/Romaji names** with specific error messages
2. **Suggest English alternatives** for invalid names
3. **Enforce numbering** for article names (1-, 2-, 3-, etc.)
4. **Only proceed** once all names pass validation

The command will guide you through each step interactively, then automatically generate all necessary files for token-efficient series creation using unified personas with **English-only naming**.

## Token Efficiency Features

- **No Duplication**: Common elements stored once in series-common.md
- **Smart References**: Articles reference shared templates instead of duplicating
- **Modular Design**: Only load necessary components for each article
- **Progress Tracking**: Efficient inter-article relationship management

## Complete Workflow Features

### Automatic Article Generation
- **Full series creation**: From concept to complete articles in one session
- **User control**: Checkpoints between each article generation
- **Consistent quality**: Shared templates ensure uniform style and structure
- **Progress visibility**: Clear progress updates throughout generation

### Quality Assurance
- **Persona consistency**: Unified personas with role-specific behaviors applied consistently
- **Series coherence**: Each article builds on previous content
- **Token optimization**: 25-35% reduction through template reuse
- **Checkpoint validation**: User approval before proceeding to next article

This command reduces series creation time by 80% and ensures optimal token usage while maintaining complete control over the generation process through unified persona consistency.

## CRITICAL ENFORCEMENT RULES

### Validation Checkpoints
The command MUST enforce these validation checkpoints at every stage:

1. **Initial Input Validation**: When user provides series topic
2. **Series Name Validation**: Before creating series directory
3. **Article Name Validation**: Before creating each article directory
4. **Pre-Generation Validation**: Final check before file generation

### Rejection Protocol
If any name fails validation:
1. **IMMEDIATELY STOP** the process
2. **SHOW SPECIFIC ERROR** with the problematic name
3. **PROVIDE ENGLISH ALTERNATIVE** suggestion
4. **REQUEST NEW INPUT** that passes validation
5. **DO NOT PROCEED** until all names are English-only

### Example Validation Flow
```
User: "Create series about AI人格座談会"
Command: ❌ ERROR: "AI人格座談会" contains Japanese characters
Command: 🔤 SUGGESTION: "AIPersonaRoundtable"
Command: Please provide an English series name:

User: "Articles should be AIと人類の距離感 and AI時代の人類の成長"
Command: ❌ ERROR: Both article names contain Japanese characters
Command: 🔤 SUGGESTIONS: 
  - "1-AIHumanDistanceDependencyVsCollaboration"
  - "2-HumanGrowthInAIEraChallengeVsComfort"
Command: Please provide English article names with number prefixes:

User: "1-AIHumanDistanceAnalysis and 2-HumanGrowthInAIEra"
Command: ✅ VALIDATION PASSED: Proceeding with series creation...
```

### Zero Tolerance Policy
**NO EXCEPTIONS** - The command must enforce English-only naming with complete validation before any file or directory creation occurs.

## ⚠️ FINAL SAFETY ENFORCEMENT - PUBLISHING PROHIBITION

### Absolute Command Termination Rules
This command MUST implement these termination safeguards:

1. **HARD STOP after article creation**: Command execution ENDS after all articles are generated and quality-checked
2. **NO post-qiita invocation**: Under NO circumstances should this command call /post-qiita or similar publishing commands
3. **NO Qiita API calls**: Zero automatic API interactions with Qiita platform
4. **EXPLICIT user notification**: Always end with clear message that articles are in DRAFT state only
5. **MANUAL publishing requirement**: User must separately execute /post-qiita for each article they want to publish

### Prohibited Actions
The define-series command is FORBIDDEN from:
- Executing any publishing commands (/post-qiita, /update-qiita, etc.)
- Making any Qiita API calls
- Moving articles from drafts/ to published/ folders
- Any automatic publishing workflows

### Required Final Message
Command MUST end with this exact safety message:
```
✅ SERIES CREATION COMPLETE - DRAFT STATE ONLY

📁 Articles Location: /articles/{SeriesName}/*/drafts/pages/article.md
⚠️ DRAFT STATUS: Articles are NOT published and remain in local drafts/ folders
🚫 NO AUTO-PUBLISH: This command did not publish anything to Qiita
📝 NEXT STEPS: Use /post-qiita command manually for each article you want to publish

Your articles are ready for review but require manual publishing action.
```

### Command Behavior Verification
To ensure compliance, the command implementation must:
1. Never reference publishing workflows in execution logic
2. Never call external Qiita APIs during series creation
3. Always terminate after local file generation and quality checks
4. Provide explicit instruction for manual publishing workflow