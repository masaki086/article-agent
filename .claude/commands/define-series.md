# Series Definition Interactive Command (v2.0)
# Guard document: /internal/command-guards/define-series-guard.md

## Command Purpose
Guide users through creating optimized article series definitions with proper structure and unified persona selection. Creates series configuration files only - does NOT proceed to article creation.

## ⚠️ CRITICAL WORKFLOW SEPARATION
**MANDATORY STOP POINTS:**
1. **After Series Structure Confirmation** - User must approve before file creation
2. **After File Creation** - Command MUST END, no automatic article generation
3. **NEVER auto-proceed to article writing** - Requires separate /create-article command

**CONTEXT MANAGEMENT:**
- If context > 5000 tokens: Recommend /reset before starting
- After long conversations: Always suggest /reset
- Clean context ensures stable series definition

## Required Reading
Before series definition, this command references:
- `/articles/shared-templates/base/`: Base templates for personas and format
- `/articles/shared-templates/patterns/`: Article pattern templates
- `/articles/personas/individuals/`: Unified persona definitions
- `/articles/personas/roles/`: Role-specific behavior patterns

## File Storage Location
All series definition files are saved to:
`/articles/shared-templates/series/{SeriesName}/`

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
   - Suggest unified personas from `/articles/personas/individuals/` in reader role based on their topic
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
1. Show available unified personas from `/articles/personas/individuals/` that can serve as authors
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

### Step 6: Series Definition Files Generation

**⚠️ STOP POINT 1: Structure Confirmation**
```
✅ Series concept defined
✅ File structure planned
⚠️ STOP: Please review and confirm the series structure
User confirmation required: "Proceed with file creation? (yes/no)"
```

Create series definition files in `/articles/shared-templates/series/{SeriesName}/`:
1. **personas-roles.md**: Combined author/reviewer/reader persona definitions
2. **format.md**: Document format and creation workflow specifications
3. **README.md**: Series overview and article list

**⚠️ STOP POINT 2: Series Definition Complete**
```
✅ Files created in: /articles/shared-templates/series/{SeriesName}/
  - personas-roles.md
  - format.md
  - README.md
⚠️ STOP: Series definition complete
❌ DO NOT proceed to article creation
➡️ Next step: Run /create-article --series {SeriesName} when ready
```

### Step 7: Command Completion

**END OF DEFINE-SERIES COMMAND**

The series definition is now complete. Files have been created in:
- `/articles/shared-templates/series/{SeriesName}/`

**What happens next:**
1. Series definition files are ready for use
2. No articles have been created yet
3. Use `/create-article --series {SeriesName}` to create individual articles
4. Each article creation is a separate, focused task

**Why we stop here:**
- Prevents context contamination
- Ensures clean article creation
- Maintains quality and consistency
- Allows for review of series structure before content creation

## Example Usage

```bash
# Check context size first
/check-context  # If > 5000 tokens, run /reset

# Start series definition
/define-series

# Follow interactive prompts
# Confirm structure at STOP POINT 1
# Files created at STOP POINT 2
# Command ends

# Later, when ready to create articles:
/create-article --series MySeriesName
```

## Important Notes

1. **Context Management**: Always check context size before starting
2. **File Location**: All definitions saved to `/articles/shared-templates/series/{SeriesName}/`
3. **No Article Creation**: This command only creates series definitions
4. **Clean Separation**: Article creation is a separate command `/create-article`
5. **Quality Focus**: Clean context ensures consistent series definition

---
**END OF COMMAND DEFINITION**
