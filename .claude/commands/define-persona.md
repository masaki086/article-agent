# Persona Definition Interactive Command

# Command Purpose
Guide users through creating detailed, consistent persona definitions for authors, reviewers, proofreaders, and readers to improve article quality and consistency.

## Required Reading
Before persona definition, this command references:
- `/claude.md`: Project-wide workflow and optimization guidelines
- `/articles/personas/template_persona.md`: Persona structure template
- Existing personas in `/articles/personas/` subdirectories for consistency

## Interaction Flow

### Step 1: Operation Mode Detection
First, determine if this is a new persona or updating an existing one:

1. **Check for Existing Persona**: Look for `{persona_name}.md` in `/articles/personas/individuals/`
2. **Operation Mode Selection**:
   - **New Persona Creation**: If persona doesn't exist
   - **Persona Update**: If persona exists, ask "Do you want to update the existing persona or create a new one?"

### Step 1a: New Persona Creation
Ask the user:
1. **Persona Type**: "What type of persona are you creating?"
   - Unified Persona (recommended) - One character serving multiple roles
   - Single-Role Persona - Specialized for one specific role

2. **Available Roles**: "Which roles should this persona be able to perform?"
   - Author (執筆者) - Creates content with specific writing style
   - Reader (読者) - Target audience for content validation
   - Reviewer (レビュワー) - Technical/content quality assessment
   - Proofreader (校正者) - Language and style consistency

3. **Primary Use Case**: "What will this persona be used for?"
   - Specific article series
   - General content type (technical/business/tutorial)
   - Particular expertise area

4. **Character Foundation**: "What's the core personality of this individual?"
   - Real person inspiration
   - Professional archetype
   - Fictional character basis
   - Unique character creation

### Step 1b: Existing Persona Update
For existing personas:
1. **Load Current Definition**: Read existing persona file and display current settings
2. **Update Options**: "What would you like to modify?"
   - **Add Roles**: Add new roles (e.g., add reviewer to author-only persona)
   - **Modify Personality**: Update personality traits or communication style
   - **Update Expertise**: Change expertise areas or experience level
   - **Refine Behaviors**: Adjust role-specific behaviors and patterns
   - **Add Usage Scenarios**: Include new usage contexts

3. **Preserve Consistency**: Ensure changes don't conflict with existing character core
4. **Version Management**: Increment version number and update changelog

### Step 2: Background & Experience Analysis
Guide the user to define:

**For Authors**:
1. **Writing Voice**: "What's their distinctive writing style?"
   - Tone (formal/casual/humorous/analytical)
   - Technical depth preference
   - Reader relationship (mentor/peer/expert)

2. **Expertise Background**: "What's their professional background?"
   - Technical specialization
   - Industry experience
   - Unique perspective or angle

**For Readers**:
1. **Professional Context**: "Who is this person professionally?"
   - Job role and responsibilities
   - Experience level and constraints
   - Technology environment

2. **Learning Goals**: "What do they want to achieve?"
   - Immediate problems to solve
   - Skill development goals
   - Success metrics

**For Reviewers/Proofreaders**:
1. **Review Expertise**: "What's their review specialization?"
   - Technical accuracy focus
   - Content structure and flow
   - Language and accessibility

2. **Review Style**: "How do they provide feedback?"
   - Direct/diplomatic approach
   - Detail level preference
   - Constructive vs critical tendency

### Step 3: Communication Style Definition
Help determine:

1. **Language Patterns**: "How do they typically communicate?"
   - Formal vs informal language
   - Technical jargon usage
   - Characteristic phrases or expressions

2. **Feedback Style**: "How do they interact with content?"
   - Positive reinforcement patterns
   - Constructive criticism approach
   - Question asking style

3. **Cultural Context**: "Any cultural or demographic considerations?"
   - Age group perspective
   - Industry-specific communication norms
   - Regional or cultural communication styles

### Step 4: Practical Application Scenarios
Configure based on real-world usage:

1. **Content Types**: "What kinds of articles will they work with?"
   - Technical tutorials
   - Business analysis
   - Tool reviews
   - Conceptual explanations

2. **Collaboration Patterns**: "How do they work with other personas?"
   - Complementary persona types
   - Conflict areas to avoid
   - Optimal persona combinations

3. **Quality Standards**: "What are their non-negotiables?"
   - Accuracy requirements
   - Clarity standards
   - Accessibility considerations

### Step 5: Persona Validation & Refinement
Review and refine:

1. **Consistency Check**: Compare with existing personas for uniqueness
2. **Completeness Review**: Ensure all template sections are covered
3. **Practical Testing**: Generate sample interactions/feedback
4. **Integration Planning**: How this persona fits into existing workflow

### Step 6: Persona Generation & Documentation
Automatically create:

1. **Complete Persona File**: Based on template structure
2. **Usage Examples**: Sample interactions and feedback patterns
3. **Integration Guidelines**: How to use with other personas
4. **Metadata Documentation**: Tags, relationships, update tracking

### Step 7: Task Management Integration
Throughout the persona creation process:

1. **Todo Creation**: Use Claude Code's built-in todo system
   - `/todo: Creating basic identity for [persona_name]`
   - `/todo: Defining multi-role behaviors for [persona_name]`
   - `/todo: Validating persona consistency for [persona_name]`
   - `/todo: Generating usage examples for [persona_name]`
   - Mark tasks as completed as they are finished

2. **Quality Assurance**: Use Claude Code's fix functionality
   - `/fix: Identify inconsistencies between roles`
   - `/fix: Fix character trait conflicts`
   - `/fix: Ensure template compliance`
   - `/fix: Validate persona uniqueness`

3. **Progress Tracking**: Maintain task visibility
   - "Creating basic identity for [persona_name]"
   - "Defining multi-role behaviors"
   - "Validating persona consistency"
   - "Generating usage examples"

## Interactive Prompts

### Opening Prompt
```
🎭 Welcome to Persona Definition Assistant!

I'll help you create or update detailed unified personas that enhance your article quality through:
- Consistent voice and style across multiple roles
- Multi-role capability (author/reader/reviewer/proofreader)
- Character coherence while role-switching
- Seamless integration with existing personas

📋 **Task Management**: This process will automatically create and track todo items for each step.

**Usage Examples:**
- `/define-persona` - Create a new persona
- `/define-persona meijyab` - Update existing persona "meijyab"
- `/define-persona tanukichi` - Update existing persona "tanukichi"

Let's start by understanding what you need:
**Are you creating a new persona or updating an existing one?**

If updating: **Which persona would you like to modify?** (tanukichi, meijyab, alexandra_sterling, or other)
If creating: **What should we call this new persona?**
```

### Follow-up for New Persona Creation
```
📝 Great! Let's create a new unified persona.

**Primary Questions:**
1. **Available Roles**: Which roles should this persona perform?
   - [ ] Author (執筆者) - Content creation with specific style
   - [ ] Reader (読者) - Target audience validation
   - [ ] Reviewer (レビュワー) - Technical/content quality assessment  
   - [ ] Proofreader (校正者) - Language and style consistency

2. **Writing Style** (if Author role selected):
   - [ ] Technical expert (detailed, precise)
   - [ ] Friendly mentor (approachable, encouraging)
   - [ ] Witty commentator (humorous, insightful)
   - [ ] Business analyst (strategic, practical)
   - [ ] Other: ___________

3. **Expertise Area**: What's their professional specialty?
   - Technical field (AI, web dev, security, etc.)
   - Industry knowledge (finance, healthcare, etc.)
   - Methodology expertise (testing, design, etc.)

4. **Character Foundation**: Core personality traits?
   - Professional background and experience
   - Communication style and values
   - Unique characteristics or quirks
```

### Follow-up for Persona Updates
```
🔄 Updating existing persona: **{persona_name}**

**Current Settings:**
- Roles: {current_roles}
- Expertise: {current_expertise}  
- Style: {current_style}
- Last Updated: {last_update_date}

**What would you like to modify?**
1. **Add New Roles**: Expand role capabilities
2. **Modify Personality**: Adjust character traits or communication style
3. **Update Expertise**: Change professional background or specialization
4. **Refine Role Behaviors**: Improve specific role-based actions
5. **Add Usage Scenarios**: Include new contexts for persona usage

Please specify what you'd like to change, and I'll guide you through the update process.
```

### Follow-up for Readers
```
👥 Perfect! Let's define a reader persona.

**Understanding Your Audience:**
1. **Professional Level**: Where are they in their career?
   - Complete beginner (learning basics)
   - Junior professional (1-3 years experience)
   - Mid-level practitioner (3-7 years)
   - Senior expert (7+ years)
   - Career changer (experienced in other field)

2. **Current Challenge**: What's their main pain point?
   - Learning new technology
   - Solving specific technical problem
   - Improving efficiency/workflow
   - Understanding business impact
   - Making technology decisions

3. **Reading Context**: When/how do they consume content?
   - Quick reference during work
   - Deep learning in free time
   - Team knowledge sharing
   - Keeping up with trends
```

### Follow-up for Reviewers
```
🔍 Excellent! Let's create a reviewer persona.

**Review Specialization:**
1. **Primary Focus**: What do they review for?
   - [ ] Technical accuracy and correctness
   - [ ] Content structure and logical flow
   - [ ] Practical applicability and usefulness
   - [ ] Security and best practices
   - [ ] Performance and efficiency
   - [ ] Accessibility and inclusivity

2. **Review Style**: How do they provide feedback?
   - Direct and detailed critique
   - Diplomatic suggestions for improvement
   - Question-based guidance
   - Positive reinforcement with corrections

3. **Expertise Background**: What qualifies them to review?
   - Years of industry experience
   - Specific certifications or training
   - Teaching or mentoring background
   - Research or academic experience
```

## Output Generation

After collecting information, generate:

### 1. Complete Unified Persona File
Based on the template structure in `/articles/personas/unified-persona-template.md`:

```markdown
**日付:** {current_date} | **バージョン:** 1.0

# {Persona Name}統合ペルソナ

## 👤 基本人格
### ペルソナ識別情報
- **ペルソナ名**: {user_defined_name}
- **ペルソナID**: {generated_id}
- **可能な役割**: {author/reader/reviewer/proofreader の組み合わせ}
- **作成日**: {current_date}
- **最終更新**: {current_date}

### 基本属性
[Core professional and personal attributes]

### 人格的特徴
[Personality, values, communication tendencies]

## 🎭 役割別行動パターン
### 📝 執筆者として（該当する場合）
[Author-specific behaviors and patterns]

### 👥 読者として（該当する場合）
[Reader-specific behaviors and reactions]

### 🔍 レビュワーとして（該当する場合）
[Reviewer-specific evaluation patterns]

### ✏️ 校正者として（該当する場合）
[Proofreader-specific correction approaches]

## 💬 統合コミュニケーションスタイル
[Consistent communication patterns across all roles]

## 🎯 活用方法
[Multi-role usage guidelines and role-switching guidance]
```

### 2. Multi-Role Usage Examples
Generate realistic sample interactions for each role:

**As Author**: Sample writing excerpts showcasing their unique voice
**As Reader**: Example questions, reactions, and concerns they might have
**As Reviewer**: Sample feedback comments and evaluation approaches
**As Proofreader**: Example correction suggestions and style improvements
**Role Transitions**: How they switch between roles while maintaining character consistency

### 3. Integration Recommendations
Suggest optimal usage patterns:
- **Single-persona workflows**: Using multiple roles of same character
- **Multi-persona collaborations**: Pairing with other unified personas
- **Role specialization**: When to focus on specific roles
- **Conflict resolution**: Managing competing perspectives within same character

## Usage Instructions

To use this command:
```
/define-persona                    # Create new persona
/define-persona [persona_name]     # Update existing persona
```

**Examples:**
- `/define-persona` - Create a completely new persona
- `/define-persona meijyab` - Update the existing meijyab persona
- `/define-persona tanukichi` - Modify tanukichi's roles or characteristics

The command will automatically detect if the persona exists and guide you through either creation or update process while maintaining character consistency.

## Quality Assurance Features

- **Consistency Checking**: Compares new personas with existing ones
- **Template Compliance**: Ensures all required sections are completed
- **Practical Validation**: Tests persona usefulness with sample scenarios
- **Integration Planning**: Maps relationships with existing persona ecosystem

This command streamlines persona creation while maintaining quality and consistency across the entire persona library.