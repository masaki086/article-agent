**Date:** 2025-08-06 | **Version:** 1.0

# Personas and Roles Template

This template defines the personalities and roles for article creation, combining author, reviewer, and other participant definitions.

## 📝 Configuration Structure

```yaml
personas_roles:
  # Default personas for the series
  default_author: tanukichi
  default_reviewer: meijyab
  default_proofreader: alexandra_sterling
  
  # Allow article-specific overrides
  article_specific:
    enabled: true
    override_author: null      # Set by /create-article command
    override_reviewer: null    # Set by /create-article command
    override_proofreader: null # Set by /create-article command
  
  # Reference to persona definitions
  references:
    individuals: /articles/personas/individuals/
    behaviors: /articles/personas/roles/
```

## 🎭 Role Definitions

### Author Role
- **Primary Function**: Content creation and narrative development
- **Persona Source**: `/articles/personas/individuals/{author_id}.md`
- **Behavior Pattern**: `/articles/personas/roles/author-behaviors.md`
- **Customizable Elements**:
  - Writing style
  - Technical depth
  - Tone and personality
  - Example patterns

### Reviewer Role
- **Primary Function**: Technical accuracy and quality assurance
- **Persona Source**: `/articles/personas/individuals/{reviewer_id}.md`
- **Behavior Pattern**: `/articles/personas/roles/reviewer-behaviors.md`
- **Customizable Elements**:
  - Review criteria
  - Feedback style
  - Technical expertise areas
  - Quality standards

### Proofreader Role
- **Primary Function**: Grammar, clarity, and readability
- **Persona Source**: `/articles/personas/individuals/{proofreader_id}.md`
- **Behavior Pattern**: `/articles/personas/roles/proofreader-behaviors.md`
- **Customizable Elements**:
  - Language preferences
  - Style guidelines
  - Formatting standards

### Reader Role (Optional)
- **Primary Function**: Target audience perspective
- **Persona Source**: `/articles/personas/individuals/{reader_id}.md`
- **Behavior Pattern**: `/articles/personas/roles/reader-behaviors.md`
- **Usage**: Validation and feedback simulation

## 🔄 Override Hierarchy

1. **Article-level override** (highest priority)
   - Path: `/articles/series/{SeriesName}/{ArticleName}/custom/personas-roles.md`
   
2. **Series-level custom**
   - Path: `/articles/series/{SeriesName}/custom/personas-roles.md`
   
3. **Series-level shared**
   - Path: `/articles/shared-templates/series/{SeriesName}/personas-roles.md`
   
4. **Base template** (this file)
   - Path: `/articles/shared-templates/base/personas-roles.md`

## 💡 Usage Examples

### Basic Usage (Series Default)
```yaml
personas_roles:
  default_author: tanukichi
  default_reviewer: meijyab
```

### Article-Specific Override
```yaml
personas_roles:
  default_author: tanukichi
  article_specific:
    override_author: alexandra_sterling  # This article uses different author
```

### Multiple Reviewers
```yaml
personas_roles:
  default_author: tanukichi
  reviewers:
    - technical: meijyab
    - readability: youko
    - domain_expert: alexandra_sterling
```

## 🎯 Best Practices

1. **Consistency**: Maintain consistent personas within a series unless specifically needed
2. **Documentation**: Document why specific overrides are used
3. **Validation**: Ensure referenced personas exist in `/articles/personas/individuals/`
4. **Role Clarity**: Clearly define each role's responsibilities

## 📊 Metadata

- **Template Type**: Base Template
- **Scope**: Series and Article Configuration
- **Dependencies**: 
  - `/articles/personas/individuals/` directory
  - `/articles/personas/roles/` directory
- **Created**: 2025-08-06
- **Last Updated**: 2025-08-06