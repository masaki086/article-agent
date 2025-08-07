# /collect-human

Collect human insights through interactive dialogue and save as structured resource file.

## Usage
```
/collect-human [--topic "topic-name"]
```

## Process
1. Confirm or ask for topic
2. Collect information through questions:
   - Main claim/thesis
   - Background and context
   - Specific experiences and examples
   - Challenges faced and solutions
   - Key learnings and insights
   - Target audience
   - Core message to readers
3. Review and confirm collected information
4. Save as `/articles/resources/{topic}/human-insights.json`

## Interactive Questions Flow
1. "What is the main claim or thesis you want to convey?"
2. "What background or context led you to this insight?"
3. "Can you share specific experiences or examples?"
4. "What challenges did you face and how did you solve them?"
5. "What are the key learnings from your experience?"
6. "Who is your target audience?"
7. "What is the core message you want readers to take away?"

## Output Format
Creates structured JSON file with human insights for later processing.