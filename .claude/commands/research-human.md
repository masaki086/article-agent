# /research-human

Research and collect supporting information for human insights using web search.

## Usage
```
/research-human --topic "topic-name"
```

## Prerequisites
- `/articles/resources/{topic}/human-insights.json` must exist

## Process
1. Load human insights from JSON file
2. Extract key concepts and claims
3. Generate search queries for:
   - Statistical data supporting the claim
   - Industry trends and reports
   - Expert opinions and articles
   - Similar case studies
   - Academic research
4. Evaluate source credibility
5. Extract relevant quotes and summaries
6. Identify contradicting viewpoints
7. Save as `/articles/resources/{topic}/research-data.json`

## Search Strategy
- Primary claim validation
- Supporting statistics and data
- Expert opinions and thought leadership
- Contradicting or alternative viewpoints
- Recent developments and trends

## Credibility Assessment
- High: Academic papers, official statistics, recognized experts
- Medium: Industry reports, reputable media, professional blogs
- Low: Opinion pieces, unverified sources, outdated information

## Output
Creates `research-data.json` with supporting and contradicting information.