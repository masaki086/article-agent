#!/usr/bin/env node

import { QiitaApiClient } from './src/apiClient';
import { ArticleLoader } from './src/articleLoader';
import { SeriesManager } from './src/seriesManager';
import { Logger } from './src/logger';
import { Config } from './src/config';

async function main() {
  const logger = new Logger();
  
  try {
    // Get series name from command line argument
    const seriesName = process.argv[2];
    
    if (!seriesName) {
      console.error('Usage: npm run upload <seriesName>');
      console.error('Example: npm run upload AIEraInfrastructure');
      process.exit(1);
    }

    logger.info('START', `Starting batch upload for series: ${seriesName}`);

    // Initialize components
    const config = Config.getInstance();
    logger.info('CONFIG', `Loaded config with token: ${config.getRedactedToken()}`);

    const apiClient = new QiitaApiClient();
    const articleLoader = new ArticleLoader();
    const seriesManager = new SeriesManager();

    // Load all articles in the series
    logger.info('LOAD', `Loading articles from series: ${seriesName}`);
    const articleMetadata = await articleLoader.loadSeriesArticles(seriesName);
    
    if (articleMetadata.length === 0) {
      logger.warn('LOAD', `No articles found in series: ${seriesName}`);
      process.exit(0);
    }

    logger.info('LOAD', `Found ${articleMetadata.length} articles to upload`);

    // Check for existing uploads
    const existingSeriesInfo = seriesManager.loadSeriesInfo(seriesName);
    const alreadyUploaded: string[] = [];
    
    if (existingSeriesInfo && existingSeriesInfo.articles.length > 0) {
      logger.warn('DUPLICATE_CHECK', `Found ${existingSeriesInfo.articles.length} already uploaded articles`);
      
      console.log('\n⚠️  Articles already uploaded in this series:');
      existingSeriesInfo.articles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   URL: ${article.url}`);
        alreadyUploaded.push(article.articleName);
      });
      
      console.log('\nOptions:');
      console.log('1. Skip already uploaded articles (recommended)');
      console.log('2. Update existing articles'); 
      console.log('3. Create duplicates (not recommended)');
      console.log('4. Cancel');
      
      const choice = process.argv.includes('--force') ? '3' : 
                    process.argv.includes('--update') ? '2' :
                    process.argv.includes('--skip') ? '1' : '1'; // Default to skip
      
      if (choice === '1') {
        logger.info('SKIP_MODE', 'Will skip already uploaded articles');
      } else if (choice === '2') {
        logger.info('UPDATE_MODE', 'Will update existing articles');
      } else {
        logger.warn('DUPLICATE_MODE', 'Will create duplicate articles');
      }
    }

    // Load article contents (filter based on choice)
    const articles = [];
    for (const metadata of articleMetadata) {
      // Skip if already uploaded and not in update/duplicate mode
      if (alreadyUploaded.includes(metadata.articleName) && 
          !process.argv.includes('--update') && 
          !process.argv.includes('--force')) {
        logger.info('SKIP', `Skipping already uploaded: ${metadata.articleName}`);
        continue;
      }
      
      try {
        const article = await articleLoader.loadArticle(metadata);
        articles.push({ metadata, article });
        logger.info('PREPARE', `Loaded: ${metadata.articleName}`);
      } catch (error) {
        logger.error('PREPARE', `Failed to load ${metadata.articleName}`, error);
      }
    }
    
    if (articles.length === 0) {
      logger.info('COMPLETE', 'No new articles to upload. All articles already exist.');
      console.log('\n✅ All articles in this series are already uploaded!');
      
      if (existingSeriesInfo && existingSeriesInfo.articles.length > 1) {
        console.log('\n🔗 To update series links, run:');
        console.log(`   npm run update-links ${seriesName}`);
      }
      
      process.exit(0);
    }

    // Check rate limit before starting
    const rateLimitStatus = apiClient.getRateLimitStatus();
    logger.info('RATE_LIMIT', `Current status`, rateLimitStatus);

    if (rateLimitStatus.remaining < articles.length) {
      logger.warn('RATE_LIMIT', `Not enough API calls remaining. Will process in batches.`);
    }

    // Upload articles
    console.log('\n🚀 Starting upload process...\n');
    
    let results;
    try {
      results = await apiClient.postBatch(articles.map(a => a.article));
    } catch (error) {
      // Early failure detected - rollback already performed in postBatch
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('COMPLETE', errorMessage);
      process.exit(1);
    }

    // Save successful uploads to published directory and track in series manager
    for (let i = 0; i < results.length; i++) {
      const { result } = results[i];
      const { metadata, article } = articles[i];

      if (!(result instanceof Error)) {
        try {
          // Save to published directory
          await articleLoader.savePublishedArticle(
            metadata,
            article.body,
            result.url
          );
          
          // Track in series manager for later link updates
          seriesManager.saveArticleInfo(seriesName, metadata.articleName, result);
          
          logger.success('SAVE', `Saved published article: ${metadata.articleName}`, {
            url: result.url,
            id: result.id,
          });
        } catch (error) {
          logger.error('SAVE', `Failed to save published article: ${metadata.articleName}`, error);
        }
      }
    }

    // Log summary
    logger.logSummary(results);

    // Final rate limit status
    const finalStatus = apiClient.getRateLimitStatus();
    logger.info('COMPLETE', 'Final rate limit status', finalStatus);

    // Suggest next step if all uploads were successful
    const successCount = results.filter(r => !(r.result instanceof Error)).length;
    if (successCount === results.length) {
      console.log('\n✨ All articles uploaded successfully!');
      console.log('📝 To add series links to all articles, run:');
      console.log(`   npm run update-links ${seriesName}\n`);
    } else if (successCount > 0) {
      console.log('\n⚠️  Some articles were uploaded successfully.');
      console.log('📝 You can still add series links to successful uploads:');
      console.log(`   npm run update-links ${seriesName}\n`);
    }

  } catch (error) {
    logger.error('FATAL', 'Unexpected error occurred', error);
    console.error('Full error details:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main };