import * as fs from 'fs';
import * as path from 'path';
import { QiitaArticle, QiitaTag } from './apiClient';

export interface ArticleMetadata {
  seriesName: string;
  articleName: string;
  filePath: string;
  tags?: QiitaTag[];
}

export class ArticleLoader {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.resolve(__dirname, '../../../../articles');
  }

  private removeImages(content: string): string {
    // Remove markdown image syntax: ![alt text](url)
    const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g;
    let cleanContent = content.replace(imageRegex, '');
    
    // Remove any empty lines that were left after image removal
    cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove image caption lines (single * followed by caption text)
    // Make sure to only match lines that start with a single * followed by a space
    // and do not contain ** (bold text markers)
    cleanContent = cleanContent.replace(/^\*\s+[^*\n][^\n]*$/gm, '');
    
    // Clean up multiple consecutive empty lines again
    cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return cleanContent.trim();
  }

  private extractMetadata(content: string): { title: string; tags: QiitaTag[] } {
    const lines = content.split('\n');
    let title = '';
    const tags: QiitaTag[] = [];

    // Extract title from first # heading
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.substring(2).trim();
        break;
      }
    }

    // Look for generated tags in comments first
    const generatedTagMatch = content.match(/<!--\s*Generated Tags:\s*([^-]+)\s*Generated at:/s);
    if (generatedTagMatch) {
      const tagNames = generatedTagMatch[1].split(',').map(t => t.trim());
      tags.push(...tagNames.map(name => ({ name })));
    } else {
      // Look for tags in frontmatter or comments (fallback)
      const tagMatch = content.match(/tags:\s*\[(.*?)\]/s);
      if (tagMatch) {
        const tagNames = tagMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
        tags.push(...tagNames.map(name => ({ name })));
      }
    }

    // Default tags if none found
    if (tags.length === 0) {
      tags.push({ name: '技術' }, { name: 'プログラミング' });
    }

    return { title, tags };
  }

  async loadArticle(metadata: ArticleMetadata, removeImages: boolean = false): Promise<QiitaArticle> {
    const filePath = metadata.filePath;

    if (!fs.existsSync(filePath)) {
      throw new Error(`Article file not found: ${filePath}`);
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove images if requested (for Qiita upload)
    if (removeImages) {
      content = this.removeImages(content);
    }
    
    const { title, tags: extractedTags } = this.extractMetadata(content);

    if (!title) {
      throw new Error(`No title found in article: ${filePath}`);
    }

    return {
      title,
      body: content,
      tags: metadata.tags || extractedTags,
      private: false, // Default to public
    };
  }

  async loadSeriesArticles(seriesName: string): Promise<ArticleMetadata[]> {
    const seriesDir = path.join(this.baseDir, seriesName);
    
    if (!fs.existsSync(seriesDir)) {
      throw new Error(`Series directory not found: ${seriesDir}`);
    }

    const articles: ArticleMetadata[] = [];
    const entries = fs.readdirSync(seriesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const articleName = entry.name;
      const draftPath = path.join(seriesDir, articleName, 'drafts/pages/article.md');
      
      // Also check for alternative naming
      const altPaths = [
        path.join(seriesDir, articleName, 'drafts/pages/main.md'),
        path.join(seriesDir, articleName, 'drafts/pages', `${articleName}.md`),
      ];

      let articlePath = '';
      if (fs.existsSync(draftPath)) {
        articlePath = draftPath;
      } else {
        for (const altPath of altPaths) {
          if (fs.existsSync(altPath)) {
            articlePath = altPath;
            break;
          }
        }
      }

      if (articlePath) {
        articles.push({
          seriesName,
          articleName,
          filePath: articlePath,
        });
      }
    }

    return articles.sort((a, b) => a.articleName.localeCompare(b.articleName));
  }

  async savePublishedArticle(metadata: ArticleMetadata, content: string, url: string): Promise<void> {
    const publishedDir = path.join(
      this.baseDir,
      metadata.seriesName,
      metadata.articleName,
      'published'
    );

    if (!fs.existsSync(publishedDir)) {
      fs.mkdirSync(publishedDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const publishedPath = path.join(publishedDir, `article_${date}.md`);

    // Add URL as comment at the top
    const publishedContent = `<!-- Published to Qiita: ${url} -->\n<!-- Date: ${new Date().toISOString()} -->\n\n${content}`;
    
    fs.writeFileSync(publishedPath, publishedContent, 'utf-8');
    console.log(`📁 Saved to: ${publishedPath}`);
  }
}