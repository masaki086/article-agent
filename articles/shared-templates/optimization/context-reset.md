**Date:** 2025-08-06 | **Version:** 1.0

# Context Reset Strategy for Optimal Article Creation

This document defines the context reset procedure to prevent attention degradation and maintain high-quality article generation.

## 🎯 When to Reset Context

```yaml
reset_triggers:
  token_count:
    threshold: 5000
    action: recommend_reset
    
  conversation_turns:
    threshold: 15
    action: suggest_reset
    
  quality_degradation:
    indicators:
      - Ignoring CLAUDE.md rules
      - Inconsistent formatting
      - Creating unnecessary files
      - Forgetting series patterns
    action: immediate_reset
    
  before_article_creation:
    condition: always
    reason: "Start with clean context for maximum quality"
```

## 🔄 Reset Procedure

### Step-by-Step Process

```yaml
reset_workflow:
  1_evaluate_current_state:
    check:
      - Current token count
      - Number of conversation turns
      - Quality indicators
    command: "/check-context"  # If available
    
  2_save_important_context:
    note: "Record any decisions or configurations"
    items:
      - Series name
      - Article specifications
      - Custom requirements
      
  3_execute_reset:
    command: "/reset"
    confirmation: "Context cleared"
    
  4_load_minimal_context:
    files_to_load:
      1: /articles/shared-templates/optimization/english-base.md
      2: /articles/shared-templates/series/{SeriesName}/personas-roles.md
      3: /articles/shared-templates/series/{SeriesName}/format.md
    
  5_begin_article_creation:
    command: "/create-article --series {SeriesName}"
    mode: "Fresh start with optimal context"
```

## 📊 Context Management Best Practices

### Optimal Loading Sequence

```yaml
loading_strategy:
  phase_1_minimal:
    # Load only essential rules (< 1000 tokens)
    - english-base.md
    
  phase_2_series:
    # Load series-specific definitions (< 2000 tokens)
    - series/personas-roles.md
    - series/format.md
    
  phase_3_article:
    # Load only if custom overrides exist (< 500 tokens)
    - article/custom/format.md
    - article/custom/personas-roles.md
    
  total_target: "< 3500 tokens for definitions"
```

### Token Budget Allocation

```yaml
token_distribution:
  system_rules: 1000        # english-base.md
  series_config: 2000       # Series definitions
  article_content: 40000    # Actual article creation
  review_feedback: 5000     # Review and refinement
  buffer: 2000             # Unexpected needs
  
  total_budget: 50000      # Stay well under limit
```

## 🚨 Warning Signs of Context Degradation

### Early Indicators
```yaml
early_warning:
  - Creating files instead of editing
  - Forgetting to use Japanese for articles
  - Missing AI disclosure notice
  - Ignoring series patterns
  severity: low
  action: remind_of_rules
```

### Critical Signs
```yaml
critical_warning:
  - Wrong file paths repeatedly
  - Circular logic in responses
  - Contradicting previous decisions
  - Completely ignoring templates
  severity: high
  action: immediate_reset_required
```

## 💡 Optimization Techniques

### Pre-Reset Checklist
```markdown
Before resetting context:
- [ ] Note current series name
- [ ] Save any custom configurations
- [ ] Record article specifications
- [ ] Copy any important decisions
```

### Post-Reset Verification
```markdown
After reset and reload:
- [ ] Confirm english-base.md loaded
- [ ] Verify series definitions accessible
- [ ] Check quality target understood (95/100)
- [ ] Test with small task first
```

## 📈 Performance Metrics

```yaml
context_efficiency:
  metrics:
    definition_tokens: "< 3500"
    quality_score: ">= 95/100"
    rule_compliance: "100%"
    creation_speed: "Normal"
    
  comparison:
    without_reset:
      after_20_turns:
        definition_recall: "60%"
        quality_score: "75-85/100"
        rule_compliance: "70%"
        creation_speed: "Slower"
    
    with_reset:
      fresh_start:
        definition_recall: "100%"
        quality_score: "95-98/100"
        rule_compliance: "100%"
        creation_speed: "Optimal"
```

## 🔧 Troubleshooting

### Reset Not Working
```yaml
if_reset_fails:
  1_verify_command:
    check: "Is /reset available?"
    alternative: "Start new conversation"
    
  2_manual_reset:
    action: "Begin new session"
    first_message: "Load english-base.md only"
    
  3_gradual_loading:
    step1: "Load base definitions"
    step2: "Add series config"
    step3: "Begin work"
```

### Quality Still Low After Reset
```yaml
quality_recovery:
  1_check_loading:
    verify: "All required files loaded?"
    fix: "Reload missing files"
    
  2_simplify_task:
    action: "Break into smaller steps"
    reason: "Reduce cognitive load"
    
  3_explicit_rules:
    action: "State rules explicitly in prompt"
    example: "Remember: Japanese, 95/100 quality, test code"
```

## 📝 Reset Command Template

```bash
# Optimal reset and article creation sequence
/reset
# After reset confirmation:
Read /articles/shared-templates/optimization/english-base.md
Load series definitions for {SeriesName}
/create-article --series {SeriesName} --article {ArticleName}
```

## 🎯 Expected Outcomes

```yaml
successful_reset:
  immediate:
    - Clear, focused responses
    - Accurate file paths
    - Consistent formatting
    - Rule compliance
    
  throughout_session:
    - Maintained quality
    - Series consistency
    - Proper Japanese usage
    - Complete code examples
    
  final_result:
    - Quality score >= 95/100
    - All requirements met
    - Clean, professional output
```

---

**Critical Note**: Context reset is not a failure - it's a best practice for maintaining optimal performance in long projects. Use it proactively rather than reactively.