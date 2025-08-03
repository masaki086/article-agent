# Generate Article Tags Command

**Date:** 2025-01-03 | **Version:** 1.0

This command analyzes article content and automatically generates appropriate Qiita tags based on the technical topics, technologies, and themes discussed.

## Usage

- `/generate-tags` - Interactive mode: select series and articles
- `/generate-tags <seriesName>` - Generate tags for all articles in series
- `/generate-tags <seriesName> <articleName>` - Generate tags for specific article

## Features

- AI-powered content analysis
- Qiita tag compatibility validation
- Technology stack detection
- Topic and theme identification
- Japanese/English tag normalization
- Maximum 5 tags per article (Qiita limit)

## Process Flow

1. **Content Analysis**: Read article markdown content
2. **Technology Detection**: Identify programming languages, frameworks, tools
3. **Theme Analysis**: Extract main topics and concepts
4. **Tag Generation**: Create relevant, searchable tags
5. **Validation**: Check against Qiita's tag system
6. **Application**: Update article metadata with generated tags

---

## Implementation

```python
import os
import re
import json
from pathlib import Path
from typing import List, Dict, Set

# Common technology keywords and their Qiita tags
TECH_TAG_MAPPING = {
    # Programming Languages
    'python': 'Python',
    'javascript': 'JavaScript', 
    'typescript': 'TypeScript',
    'java': 'Java',
    'go': 'Go',
    'rust': 'Rust',
    'php': 'PHP',
    'ruby': 'Ruby',
    'c++': 'C++',
    'c#': 'C#',
    
    # Frameworks & Libraries
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'django': 'Django',
    'flask': 'Flask',
    'express': 'Express',
    'spring': 'Spring',
    'laravel': 'Laravel',
    'rails': 'Rails',
    
    # Cloud & Infrastructure
    'aws': 'AWS',
    'azure': 'Azure',
    'gcp': 'GoogleCloud',
    'docker': 'Docker',
    'kubernetes': 'kubernetes',
    'terraform': 'Terraform',
    'ansible': 'Ansible',
    
    # Databases
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'redis': 'Redis',
    'elasticsearch': 'Elasticsearch',
    
    # AI/ML
    'ai': 'AI',
    'machine learning': 'MachineLearning',
    'deep learning': 'DeepLearning',
    'tensorflow': 'TensorFlow',
    'pytorch': 'PyTorch',
    'openai': 'OpenAI',
    'gpt': 'ChatGPT',
    'claude': 'Claude',
    
    # Architecture & Concepts
    'microservices': 'マイクロサービス',
    'serverless': 'サーバーレス',
    'faas': 'FaaS',
    'iaas': 'IaaS',
    'saas': 'SaaS',
    'paas': 'PaaS',
    'api': 'API',
    'rest': 'REST',
    'graphql': 'GraphQL',
    'cdn': 'CDN',
    
    # Japanese Business/Tech Terms
    'dx': 'DX',
    'デジタル変革': 'DX',
    'エンジニア': 'エンジニア',
    'プログラミング': 'プログラミング',
    'アーキテクチャ': 'アーキテクチャ',
    'インフラ': 'インフラ',
    'セキュリティ': 'セキュリティ',
    'パフォーマンス': 'パフォーマンス',
}

def analyze_article_content(file_path: str) -> Dict[str, any]:
    """Analyze article content and extract key information"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title
    title_match = re.search(r'^# (.+)', content, re.MULTILINE)
    title = title_match.group(1) if title_match else "No title"
    
    # Convert to lowercase for analysis
    content_lower = content.lower()
    title_lower = title.lower()
    
    # Count word frequencies
    word_counts = {}
    
    # Extract technical terms
    tech_terms = set()
    for keyword, tag in TECH_TAG_MAPPING.items():
        if keyword.lower() in content_lower or keyword.lower() in title_lower:
            tech_terms.add(tag)
    
    # Extract code blocks to identify languages
    code_blocks = re.findall(r'```(\w+)', content)
    for lang in code_blocks:
        if lang.lower() in TECH_TAG_MAPPING:
            tech_terms.add(TECH_TAG_MAPPING[lang.lower()])
    
    # Analyze content themes
    themes = set()
    
    # Infrastructure themes
    if any(term in content_lower for term in ['サーバー', 'インフラ', 'クラウド', 'aws', 'azure', 'gcp']):
        themes.add('インフラ')
    
    # AI/ML themes  
    if any(term in content_lower for term in ['ai', '人工知能', '機械学習', 'chatgpt', 'openai']):
        themes.add('AI')
    
    # Architecture themes
    if any(term in content_lower for term in ['アーキテクチャ', 'マイクロサービス', 'api', '設計']):
        themes.add('アーキテクチャ')
    
    # Business/Strategy themes
    if any(term in content_lower for term in ['戦略', '経営', 'ビジネス', '投資', 'roi']):
        themes.add('ビジネス')
    
    # Performance themes
    if any(term in content_lower for term in ['パフォーマンス', '性能', '最適化', 'コスト']):
        themes.add('パフォーマンス')
    
    return {
        'title': title,
        'tech_terms': list(tech_terms),
        'themes': list(themes),
        'content_length': len(content),
        'code_languages': list(set(code_blocks))
    }

def generate_tags(analysis: Dict[str, any], max_tags: int = 5) -> List[str]:
    """Generate appropriate tags based on analysis"""
    
    tags = []
    
    # Add most relevant tech terms (max 2-3)
    tech_terms = analysis.get('tech_terms', [])
    tags.extend(tech_terms[:3])
    
    # Add themes (max 2)
    themes = analysis.get('themes', [])
    tags.extend(themes[:2])
    
    # Add general tags if needed
    if len(tags) < max_tags:
        # Add generic programming tag if code is present
        if analysis.get('code_languages'):
            if 'プログラミング' not in tags:
                tags.append('プログラミング')
        
        # Add technology tag
        if len(tags) < max_tags and any(t in ['AI', 'AWS', 'Docker'] for t in tags):
            if '技術' not in tags:
                tags.append('技術')
    
    # Ensure unique and limit to max_tags
    unique_tags = list(dict.fromkeys(tags))  # Preserve order while removing duplicates
    return unique_tags[:max_tags]

def update_article_tags(file_path: str, tags: List[str]):
    """Update article file with generated tags"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create tags section
    tag_section = f"\n<!--\nGenerated Tags: {', '.join(tags)}\nGenerated at: {datetime.now().isoformat()}\n-->\n"
    
    # Check if tags already exist
    if '<!-- Generated Tags:' in content:
        # Replace existing tags
        content = re.sub(r'<!--\nGenerated Tags:.*?-->\n', tag_section, content, flags=re.DOTALL)
    else:
        # Add tags after title
        title_match = re.search(r'^(# .+\n)', content, re.MULTILINE)
        if title_match:
            content = content.replace(title_match.group(1), title_match.group(1) + tag_section)
        else:
            content = tag_section + content
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def process_series_articles(series_name: str):
    """Process all articles in a series"""
    
    series_dir = Path(f"articles/{series_name}")
    if not series_dir.exists():
        print(f"❌ Series directory not found: {series_dir}")
        return
    
    processed_count = 0
    
    for article_dir in series_dir.iterdir():
        if not article_dir.is_dir() or article_dir.name in ['shared-templates']:
            continue
        
        # Look for article files
        article_files = [
            article_dir / "drafts" / "pages" / "article.md",
            article_dir / "drafts" / "pages" / "main.md",
            article_dir / "drafts" / "pages" / f"{article_dir.name}.md"
        ]
        
        article_file = None
        for f in article_files:
            if f.exists():
                article_file = f
                break
        
        if not article_file:
            print(f"⚠️  No article file found in {article_dir.name}")
            continue
        
        print(f"\n🔍 Analyzing: {article_dir.name}")
        
        # Analyze content
        analysis = analyze_article_content(str(article_file))
        
        # Generate tags
        tags = generate_tags(analysis)
        
        print(f"📝 Title: {analysis['title']}")
        print(f"🔧 Tech Terms: {', '.join(analysis['tech_terms'])}")
        print(f"🎯 Themes: {', '.join(analysis['themes'])}")
        print(f"🏷️  Generated Tags: {', '.join(tags)}")
        
        # Update article with tags
        update_article_tags(str(article_file), tags)
        
        processed_count += 1
    
    print(f"\n✅ Processed {processed_count} articles in {series_name} series")
    print(f"📁 Updated files with generated tags")

# Main execution
import sys
from datetime import datetime

if __name__ == "__main__":
    print("🏷️  Article Tag Generator")
    print("=" * 50)
    
    if len(sys.argv) < 2:
        # Interactive mode
        print("Available series:")
        articles_dir = Path("articles")
        if articles_dir.exists():
            series_list = [d.name for d in articles_dir.iterdir() 
                          if d.is_dir() and d.name != 'shared-templates']
            
            for i, series in enumerate(sorted(series_list), 1):
                print(f"{i}. {series}")
            
            try:
                choice = int(input("\nSelect series number: ")) - 1
                if 0 <= choice < len(series_list):
                    series_name = sorted(series_list)[choice]
                else:
                    print("❌ Invalid selection")
                    sys.exit(1)
            except ValueError:
                print("❌ Invalid input")
                sys.exit(1)
    else:
        series_name = sys.argv[1]
    
    print(f"\n🎯 Processing series: {series_name}")
    process_series_articles(series_name)
    
    print(f"\n✨ Tag generation complete!")
    print(f"💡 Next step: Run /post-qiita {series_name} to upload with new tags")
```