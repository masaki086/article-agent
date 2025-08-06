**Date:** 2025-08-06 | **Version:** 1.0

# Document Format and Creation Workflow Template

This template defines document formatting standards and creation workflows for articles.

## 📄 Document Structure

```yaml
format:
  # Basic document structure
  structure:
    type: standard  # standard/tutorial/technical/discussion
    sections:
      - introduction:
          style: engaging_story  # engaging_story/direct/question_based
          length: 200-300_words
      - main_content:
          organization: hierarchical  # hierarchical/sequential/modular
          subsections: auto_generate
      - conclusion:
          style: summary_with_action  # summary/action_items/reflection
          length: 150-200_words
  
  # Style and tone configuration
  style:
    tone: casual  # casual/formal/technical/conversational
    language: japanese  # japanese/english/bilingual
    technical_level: intermediate  # beginner/intermediate/advanced/expert
    personality_visible: true  # Show author personality
```

## 🔄 Creation Workflow Options

### 1. Interactive Mode
```yaml
workflow:
  type: interactive
  checkpoints:
    - name: structure_review
      description: "Review and approve article structure"
      user_input: required
    
    - name: content_draft
      description: "Review initial content draft"
      user_input: optional
    
    - name: final_review
      description: "Final review before completion"
      user_input: required
  
  options:
    allow_revision: true
    save_drafts: true
    preview_enabled: true
```

### 2. Automatic Mode
```yaml
workflow:
  type: automatic
  settings:
    stop_on_error: true
    quality_threshold: 95
    auto_review: true
  
  phases:
    - structure_generation
    - content_creation
    - self_review
    - formatting
    - completion
```

### 3. Resource-Based Mode
```yaml
workflow:
  type: resource_based
  source:
    path: /articles/resources/{original_article}.md
    type: reference  # reference/translation/adaptation
  
  transformation:
    method: adapt  # translate/adapt/expand/summarize
    preserve:
      - technical_accuracy
      - core_concepts
    modify:
      - examples_to_local_context
      - cultural_references
    add:
      - japanese_specific_considerations
      - local_tool_alternatives
```

## 📝 Content Guidelines

### Code Examples
```yaml
code_examples:
  style: commented  # minimal/commented/detailed
  languages: [javascript, python, bash]
  formatting:
    syntax_highlighting: true
    line_numbers: when_needed
    max_lines_per_block: 50
  requirements:
    - Include error handling
    - Show expected output
    - Provide context
```

### Visual Elements
```yaml
visual_elements:
  diagrams:
    tool: mermaid
    style: clean_simple
    max_complexity: medium
  
  images:
    ai_generated: true
    style_prompt_template: "Technical diagram, clean design, {content_specific}"
    alt_text: required
  
  tables:
    format: markdown
    max_columns: 5
    alignment: auto
```

## 🎯 Format Patterns

### Technical Article Pattern
```yaml
technical_pattern:
  introduction:
    - Problem statement
    - Solution overview
    - Prerequisites
  
  body:
    - Technical background
    - Implementation details
    - Code examples with explanation
    - Performance considerations
  
  conclusion:
    - Summary of implementation
    - Best practices
    - Further reading
```

### Tutorial Pattern
```yaml
tutorial_pattern:
  introduction:
    - What you'll learn
    - Prerequisites
    - Setup requirements
  
  body:
    - Step-by-step instructions
    - Code snippets for each step
    - Common pitfalls
    - Checkpoint validations
  
  conclusion:
    - What you've accomplished
    - Next steps
    - Additional resources
```

### Discussion Pattern
```yaml
discussion_pattern:
  introduction:
    - Topic context
    - Why it matters
    - Different perspectives
  
  body:
    - Analysis of approaches
    - Pros and cons comparison
    - Real-world examples
    - Industry trends
  
  conclusion:
    - Balanced summary
    - Recommendations
    - Open questions
```

## 🔄 Override Hierarchy

1. **Article-level format** (highest priority)
   - Path: `/articles/series/{SeriesName}/{ArticleName}/custom/format.md`
   
2. **Series-level custom**
   - Path: `/articles/series/{SeriesName}/custom/format.md`
   
3. **Series-level shared**
   - Path: `/articles/shared-templates/series/{SeriesName}/format.md`
   
4. **Pattern template**
   - Path: `/articles/shared-templates/patterns/{pattern}.md`
   
5. **Base template** (this file)
   - Path: `/articles/shared-templates/base/format.md`

## 💡 Usage Examples

### Basic Series Definition
```yaml
format:
  structure:
    type: technical
  style:
    tone: casual
    language: japanese
  workflow:
    type: interactive
```

### Resource-Based Article
```yaml
format:
  workflow:
    type: resource_based
    source:
      path: /articles/resources/react-hooks-guide.md
      type: translation
    transformation:
      method: adapt
```

### Fully Automatic Generation
```yaml
format:
  workflow:
    type: automatic
    settings:
      quality_threshold: 98
  structure:
    type: tutorial
```

## 📊 Quality Metrics

```yaml
quality_metrics:
  content:
    - clarity: 95/100
    - technical_accuracy: 100/100
    - completeness: 95/100
  
  format:
    - structure_consistency: 100/100
    - code_quality: 95/100
    - visual_elements: 90/100
  
  readability:
    - target_level_match: 95/100
    - flow_and_transitions: 90/100
    - engagement: 85/100
```

## 🎯 Best Practices

1. **Consistency**: Maintain format consistency within a series
2. **Flexibility**: Use overrides only when necessary
3. **Documentation**: Document custom format decisions
4. **Validation**: Ensure format compatibility with target platform
5. **Testing**: Preview articles before finalizing

## 📊 Metadata

- **Template Type**: Base Template
- **Scope**: Document Formatting and Workflow
- **Dependencies**: 
  - Pattern templates in `/articles/shared-templates/patterns/`
  - Optimization templates in `/articles/shared-templates/optimization/`
- **Created**: 2025-08-06
- **Last Updated**: 2025-08-06