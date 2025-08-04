# Series Definition Interactive Command

## Command Purpose
Guide users through creating optimized article series with proper structure, unified persona selection, and token-efficient configuration.

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

### Step 9: Automatic Quality Check (Enhanced with /fix)
After each article is completed, automatically perform:

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

I'll help you create an optimized article series with:
- Token-efficient structure (25-35% reduction via shared templates)
- Unified persona system (one character, multiple roles)
- Consistent character and style across all content
- Auto-generated templates (shared-templates/ utilization)

📋 **Task Management**: This process will automatically create and track todo items for each major step, including individual article generation.

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
```bash
mkdir -p articles/{SeriesName}
mkdir -p articles/{SeriesName}/1-{Article1Name}/drafts/pages
mkdir -p articles/{SeriesName}/2-{Article2Name}/drafts/pages
# ... for each article (numbered: 1-, 2-, 3-, etc.)
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

## Usage Instructions

To use this command:
```
/define-series "Your Series Topic Here"
```

The command will guide you through each step interactively, then automatically generate all necessary files for token-efficient series creation using unified personas.

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