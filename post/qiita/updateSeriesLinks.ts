#!/usr/bin/env node

import { QiitaApiClient } from './src/apiClient';
import { ArticleLoader } from './src/articleLoader';
import { SeriesManager } from './src/seriesManager';
import { Logger } from './src/logger';

async function updateSeriesLinks() {
  const logger = new Logger();
  
  try {
    const seriesName = process.argv[2];
    
    if (!seriesName) {
      console.error('Usage: npm run update-links <seriesName>');
      console.error('Example: npm run update-links AIEraInfrastructure');
      process.exit(1);
    }

    logger.info('START', `Starting series link update for: ${seriesName}`);

    // Initialize components
    const apiClient = new QiitaApiClient();
    const articleLoader = new ArticleLoader();
    const seriesManager = new SeriesManager();

    // Load series information
    const seriesInfo = seriesManager.loadSeriesInfo(seriesName);
    
    if (!seriesInfo || seriesInfo.articles.length === 0) {
      logger.error('LOAD', `No uploaded articles found for series: ${seriesName}`);
      console.error('\n❌ No articles found. Please upload articles first using:');
      console.error(`   npm run upload ${seriesName}`);
      process.exit(1);
    }

    logger.info('LOAD', `Found ${seriesInfo.articles.length} articles to update`);

    // Update each article with series links
    let successCount = 0;
    let failCount = 0;

    for (const articleInfo of seriesInfo.articles) {
      try {
        logger.info('UPDATE', `Processing: ${articleInfo.articleName}`);

        // Load current article content
        const articleMeta = await articleLoader.loadSeriesArticles(seriesName);
        const currentArticleMeta = articleMeta.find(a => a.articleName === articleInfo.articleName);
        
        if (!currentArticleMeta) {
          logger.warn('UPDATE', `Article file not found: ${articleInfo.articleName}`);
          failCount++;
          continue;
        }

        const article = await articleLoader.loadArticle(currentArticleMeta);

        // Remove existing series links if any
        const existingLinksPattern = /\n\n---\n\n## 📚 連載記事一覧[\s\S]*?---\n/;
        let updatedBody = article.body.replace(existingLinksPattern, '');

        // Add new series links at the end
        const seriesLinks = seriesManager.generateSeriesLinks(seriesInfo, articleInfo.articleName);
        updatedBody = updatedBody.trimEnd() + seriesLinks;

        // Update article via API
        const updatedArticle = {
          ...article,
          body: updatedBody,
        };

        const result = await apiClient.updateArticle(articleInfo.id, updatedArticle);
        
        logger.success('UPDATE', `Updated: ${articleInfo.title}`, {
          url: result.url,
          id: result.id,
        });

        // Save updated content to published directory
        await articleLoader.savePublishedArticle(
          currentArticleMeta,
          updatedBody,
          result.url
        );

        successCount++;

      } catch (error) {
        logger.error('UPDATE', `Failed to update: ${articleInfo.articleName}`, error);
        failCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Update Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📝 Total: ${seriesInfo.articles.length}`);

    // Show rate limit status
    const rateLimitStatus = apiClient.getRateLimitStatus();
    logger.info('COMPLETE', 'Final rate limit status', rateLimitStatus);

  } catch (error) {
    logger.error('FATAL', 'Unexpected error occurred', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateSeriesLinks().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { updateSeriesLinks };