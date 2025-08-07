# /create-human

Complete workflow for creating human-driven articles with AI enhancement.

## Usage
```
/create-human [--topic "topic-name"] [--skip-collection] [--skip-research]
```

## Full Workflow
This command orchestrates the entire human-driven article creation process:

### Step 1: Collect Human Insights
- Interactive dialogue to gather personal experiences
- Structured collection of claims, challenges, and learnings
- Saves to `human-insights.json`

### Step 2: Research and Enhancement
- Automated web search for supporting data
- Collection of statistics, expert opinions, and case studies
- Credibility assessment of sources
- Saves to `research-data.json`

### Step 3: Article Generation
- Combines human insights with research data
- Creates well-structured, readable article
- Integrates links naturally
- Applies quality checks

## Options
- `--topic`: Specify topic upfront (skips initial topic prompt)
- `--skip-collection`: Use existing human-insights.json
- `--skip-research`: Use existing research-data.json

## Interactive Flow Example
```
Assistant: "Let's create your article! What topic would you like to write about?"
User: "Effective code review practices"
Assistant: "Great! Now I'll ask you some questions to understand your perspective..."
[Collection phase using /collect-human]
Assistant: "Now researching supporting information..."
[Research phase using /research-human]
Assistant: "Generating your article..."
[Generation phase using /generate-human]
Assistant: "Your article is ready! Review at /articles/human-driven/{topic}/article.md"
```

## Directory Structure Created
```
articles/
├── resources/
│   └── {topic}/
│       ├── human-insights.json
│       └── research-data.json
└── human-driven/
    └── {topic}/
        └── article.md
```

## Quality Assurance
- Validates each step before proceeding
- Confirms resource files are properly formatted
- Ensures article meets quality standards
- Provides summary of created content

## Error Handling
- Missing resource files: Prompts to run required step
- Invalid JSON: Offers to fix or recollect
- Search failures: Continues with available data
- Generation issues: Provides diagnostic information

## Post-Generation Options
After article creation, suggests:
- Review and edit the article
- Run quality check (`/quality-check`)
- Post to Qiita (`/post-qiita`)
- Create another article