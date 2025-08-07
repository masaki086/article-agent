# /generate-human

Generate a polished article from collected human insights and research data.

## Usage
```
/generate-human --topic "topic-name" [--style "casual|formal|technical"]
```

## Prerequisites
- `/articles/resources/{topic}/human-insights.json` must exist
- `/articles/resources/{topic}/research-data.json` must exist

## Process
1. Load both resource files
2. Analyze content and determine optimal structure
3. Generate article sections:
   - Engaging introduction with hook
   - Personal experience narrative
   - Data-backed insights with links
   - Practical approaches and guides
   - Alternative viewpoints discussion
   - Actionable conclusion
4. Integrate external links naturally
5. Ensure coherent flow and transitions
6. Apply quality checks
7. Save as `/articles/human-driven/{topic}/article.md`

## Article Structure Template
- **Introduction**: Hook + overview (10-15%)
- **Personal Experience**: Stories and challenges (25-30%)
- **Supporting Data**: Research findings with links (20-25%)
- **Practical Application**: How-to guides (20-25%)
- **Different Perspectives**: Alternative views (10-15%)
- **Conclusion**: Summary + call to action (10-15%)

## Link Integration Rules
- Embed links naturally within sentences
- Use descriptive anchor text
- Balance between different source types
- Prioritize high-credibility sources
- Maximum 2-3 links per section

## Quality Checks
- Clarity of main claim
- Logical flow between sections
- Appropriate link placement
- Balance of personal and external content
- Readability score
- Actionable takeaways

## Output
Creates polished article ready for publication.