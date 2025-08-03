import * as fs from 'fs';
import * as path from 'path';
import { QiitaResponse } from './apiClient';

export interface SeriesArticle {
  articleName: string;
  title: string;
  id: string;
  url: string;
  uploadedAt: string;
}

export interface SeriesInfo {
  seriesName: string;
  articles: SeriesArticle[];
  updatedAt: string;
}

export class SeriesManager {
  private dataDir: string;

  constructor() {
    this.dataDir = path.resolve(__dirname, '../data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getSeriesFilePath(seriesName: string): string {
    return path.join(this.dataDir, `${seriesName}-series.json`);
  }

  loadSeriesInfo(seriesName: string): SeriesInfo | null {
    const filePath = this.getSeriesFilePath(seriesName);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load series info: ${error}`);
      return null;
    }
  }

  saveArticleInfo(seriesName: string, articleName: string, response: QiitaResponse): void {
    let seriesInfo = this.loadSeriesInfo(seriesName);
    
    if (!seriesInfo) {
      seriesInfo = {
        seriesName,
        articles: [],
        updatedAt: new Date().toISOString(),
      };
    }

    // Update or add article info
    const existingIndex = seriesInfo.articles.findIndex(a => a.articleName === articleName);
    const articleInfo: SeriesArticle = {
      articleName,
      title: response.title,
      id: response.id,
      url: response.url,
      uploadedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      seriesInfo.articles[existingIndex] = articleInfo;
    } else {
      seriesInfo.articles.push(articleInfo);
    }

    seriesInfo.updatedAt = new Date().toISOString();

    // Save to file
    const filePath = this.getSeriesFilePath(seriesName);
    fs.writeFileSync(filePath, JSON.stringify(seriesInfo, null, 2), 'utf-8');
  }

  generateSeriesLinks(seriesInfo: SeriesInfo, currentArticleName?: string): string {
    const sortedArticles = [...seriesInfo.articles].sort((a, b) => 
      a.articleName.localeCompare(b.articleName)
    );

    let markdown = '\n\n---\n\n## 📚 連載記事一覧\n\n';
    markdown += `この記事は「${seriesInfo.seriesName}」シリーズの一部です。\n\n`;

    sortedArticles.forEach((article, index) => {
      const isCurrent = article.articleName === currentArticleName;
      const prefix = isCurrent ? '👉 ' : '';
      const suffix = isCurrent ? ' (この記事)' : '';
      
      markdown += `${index + 1}. ${prefix}[${article.title}](${article.url})${suffix}\n`;
    });

    markdown += '\n---\n';
    
    return markdown;
  }

  findArticleInfo(seriesInfo: SeriesInfo, articleName: string): SeriesArticle | undefined {
    return seriesInfo.articles.find(a => a.articleName === articleName);
  }

  getAllArticleIds(seriesName: string): string[] {
    const seriesInfo = this.loadSeriesInfo(seriesName);
    if (!seriesInfo) {
      return [];
    }
    return seriesInfo.articles.map(a => a.id);
  }
}