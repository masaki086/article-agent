**Date:** 2025-08-06 | **Version:** 1.0

# Minimal English Base Template for Context Reset

This file contains the absolute minimum definitions needed for high-quality article creation after context reset.

## Core Rules

```yaml
article_creation:
  quality_target: 95/100
  language: japanese
  ai_disclosure: required
  
  mandatory_elements:
    - Clear structure
    - Code examples with comments
    - Error handling
    - Version specifications
    - AI generation notice
```

## Essential Structure

```yaml
article_structure:
  1_introduction:
    hook: engaging_story_or_question
    value_proposition: clear
    prerequisites: listed
    
  2_main_content:
    organization: logical_flow
    code_examples: working_and_tested
    explanations: clear_and_concise
    
  3_conclusion:
    summary: key_points
    next_steps: actionable
    resources: relevant_links
```

## Quality Checklist

```yaml
quality_requirements:
  technical:
    - Code correctness: 100%
    - Security best practices: Applied
    - Performance considered: Yes
    
  content:
    - Grammar: Correct
    - Flow: Logical
    - Completeness: 95%+
    
  format:
    - Markdown: Valid
    - Code blocks: Properly formatted
    - Images: Alt text included
```

## Persona Reference

```yaml
default_personas:
  author: tanukichi
  reviewer: meijyab
  
  load_from:
    individuals: /articles/personas/individuals/{id}.md
    behaviors: /articles/personas/roles/{role}-behaviors.md
```

## Template Hierarchy

```yaml
priority_order:
  1: /articles/series/{SeriesName}/{ArticleName}/custom/
  2: /articles/series/{SeriesName}/custom/
  3: /articles/shared-templates/series/{SeriesName}/
  4: /articles/shared-templates/patterns/{pattern}.md
  5: /articles/shared-templates/base/
```

## Workflow Options

```yaml
creation_modes:
  interactive:
    checkpoints: [structure, content, review]
    user_input: required_at_checkpoints
    
  automatic:
    quality_threshold: 95
    stop_on_error: true
    
  resource_based:
    source: /articles/resources/{file}.md
    transformation: [translate, adapt, expand]
```

## Critical Reminders

1. **NEVER create files unless necessary** - Prefer editing
2. **Check series definitions first** - Load from shared-templates/series/
3. **Maintain consistency** - Follow series patterns
4. **Quality over speed** - Achieve 95/100 minimum
5. **Test all code** - Must be executable

## Token Optimization

```yaml
optimization_strategy:
  read_only_needed: true
  avoid_duplication: true
  reference_shared: true
  
  load_sequence:
    1: This file (english-base.md)
    2: Series-specific definitions
    3: Article-specific overrides
```

## Output Format

```yaml
markdown_rules:
  headings: Use ##, ###, #### hierarchy
  code_blocks: Specify language
  lists: Use - for bullets, 1. for ordered
  emphasis: **bold**, *italic*
  links: [text](url)
```

## Metadata Requirements

```yaml
article_metadata:
  required:
    - Date
    - Version
    - Author (AI + Human)
    - Series
    - Article Number
```

---

**Usage Note**: This file should be loaded immediately after /reset command to establish minimal working context for article creation. Total size optimized to under 1000 tokens.