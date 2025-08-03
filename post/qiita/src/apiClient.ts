import axios, { AxiosInstance, AxiosError } from 'axios';
import { Config, API_CONFIG } from './config';
import { RateLimiter } from './rateLimiter';

export interface QiitaTag {
  name: string;
  versions?: string[];
}

export interface QiitaArticle {
  title: string;
  body: string;
  tags: QiitaTag[];
  private?: boolean;
  coediting?: boolean;
  group_url_name?: string;
}

export interface QiitaResponse {
  id: string;
  url: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export class QiitaApiClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  private config: Config;

  constructor() {
    this.config = Config.getInstance();
    this.rateLimiter = new RateLimiter();
    
    this.client = axios.create({
      baseURL: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor to update rate limit info
    this.client.interceptors.response.use(
      (response) => {
        this.rateLimiter.updateFromHeaders(response.headers as Record<string, string>);
        return response;
      },
      (error) => {
        if (error.response) {
          this.rateLimiter.updateFromHeaders(error.response.headers as Record<string, string>);
        }
        return Promise.reject(error);
      }
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateRetryDelay(attempt: number): number {
    const { initial, multiplier, maxDelay } = API_CONFIG.retryDelay;
    return Math.min(initial * Math.pow(multiplier, attempt), maxDelay);
  }

  async postArticle(article: QiitaArticle, retryCount = 0): Promise<QiitaResponse> {
    await this.rateLimiter.waitForSlot();

    try {
      console.log(`Posting article: "${article.title}"`);
      const response = await this.client.post<QiitaResponse>('/items', article);
      console.log(`✅ Successfully posted: ${response.data.url}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 429) {
        // Rate limit error
        console.error(`⚠️ Rate limit hit for "${article.title}"`);
        const retryAfter = parseInt(axiosError.response.headers['retry-after'] || '60', 10);
        await this.delay(retryAfter * 1000);
        return this.postArticle(article, retryCount);
      }

      if (axiosError.response?.status === 401) {
        throw new Error('Authentication failed. Please check your API token.');
      }

      if (axiosError.response && axiosError.response.status >= 500 && retryCount < API_CONFIG.maxRetries) {
        const delay = this.calculateRetryDelay(retryCount);
        console.log(`⚠️ Server error for "${article.title}". Retrying in ${delay}ms...`);
        await this.delay(delay);
        return this.postArticle(article, retryCount + 1);
      }

      // Log error details without exposing token
      console.error(`❌ Failed to post "${article.title}":`, {
        status: axiosError.response?.status,
        message: axiosError.message,
        data: axiosError.response?.data,
      });

      throw error;
    }
  }

  async postBatch(articles: QiitaArticle[]): Promise<Array<{ article: QiitaArticle; result: QiitaResponse | Error }>> {
    const results: Array<{ article: QiitaArticle; result: QiitaResponse | Error }> = [];
    const uploadedIds: string[] = [];
    
    for (let i = 0; i < articles.length; i += API_CONFIG.batchSize) {
      const batch = articles.slice(i, i + API_CONFIG.batchSize);
      console.log(`\nProcessing batch ${Math.floor(i / API_CONFIG.batchSize) + 1}/${Math.ceil(articles.length / API_CONFIG.batchSize)}`);
      
      // Process articles one by one to detect failure early
      for (const article of batch) {
        try {
          const result = await this.postArticle(article);
          results.push({ article, result });
          uploadedIds.push(result.id);
        } catch (error) {
          // Failure detected - immediate rollback
          console.error(`❌ Upload failed for "${article.title}". Starting immediate rollback...`);
          
          if (uploadedIds.length > 0) {
            await this.rollbackSeries(uploadedIds);
          }
          
          // Add the failed result and throw to stop execution
          results.push({ article, result: error as Error });
          throw new Error(`Series upload failed at "${article.title}". All uploaded articles have been deleted.`);
        }
      }

      // Add delay between batches
      if (i + API_CONFIG.batchSize < articles.length) {
        await this.delay(2000); // 2 second delay between batches
      }
    }

    return results;
  }

  async updateArticle(articleId: string, article: QiitaArticle, retryCount = 0): Promise<QiitaResponse> {
    await this.rateLimiter.waitForSlot();

    try {
      console.log(`Updating article: "${article.title}" (${articleId})`);
      const response = await this.client.patch<QiitaResponse>(`/items/${articleId}`, article);
      console.log(`✅ Successfully updated: ${response.data.url}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 429) {
        console.error(`⚠️ Rate limit hit for update "${article.title}"`);
        const retryAfter = parseInt(axiosError.response.headers['retry-after'] || '60', 10);
        await this.delay(retryAfter * 1000);
        return this.updateArticle(articleId, article, retryCount);
      }

      if (axiosError.response && axiosError.response.status >= 500 && retryCount < API_CONFIG.maxRetries) {
        const delay = this.calculateRetryDelay(retryCount);
        console.log(`⚠️ Server error for update "${article.title}". Retrying in ${delay}ms...`);
        await this.delay(delay);
        return this.updateArticle(articleId, article, retryCount + 1);
      }

      console.error(`❌ Failed to update "${article.title}":`, {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      throw error;
    }
  }

  async deleteArticle(articleId: string, retryCount = 0): Promise<boolean> {
    await this.rateLimiter.waitForSlot();

    try {
      console.log(`Deleting article: ${articleId}`);
      await this.client.delete(`/items/${articleId}`);
      console.log(`✅ Successfully deleted: ${articleId}`);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 429) {
        console.error(`⚠️ Rate limit hit for delete ${articleId}`);
        const retryAfter = parseInt(axiosError.response.headers['retry-after'] || '60', 10);
        await this.delay(retryAfter * 1000);
        return this.deleteArticle(articleId, retryCount);
      }

      if (axiosError.response?.status && axiosError.response.status >= 500 && retryCount < API_CONFIG.maxRetries) {
        const delay = this.calculateRetryDelay(retryCount);
        console.log(`⚠️ Server error for delete ${articleId}. Retrying in ${delay}ms...`);
        await this.delay(delay);
        return this.deleteArticle(articleId, retryCount + 1);
      }

      console.error(`❌ Failed to delete ${articleId}:`, {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      return false;
    }
  }

  async rollbackSeries(articleIds: string[]): Promise<void> {
    if (articleIds.length === 0) return;

    console.log(`\n🔄 Rolling back ${articleIds.length} articles...`);
    console.log('-'.repeat(50));

    const deletePromises = articleIds.map(async (id) => {
      try {
        const success = await this.deleteArticle(id);
        return { id, success };
      } catch (error) {
        return { id, success: false, error };
      }
    });

    const results = await Promise.all(deletePromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    console.log(`\n📊 Rollback Summary:`);
    console.log(`✅ Deleted: ${successful}`);
    console.log(`❌ Failed to delete: ${failed}`);

    if (failed > 0) {
      console.log(`\n⚠️ Some articles could not be deleted. Manual cleanup required:`);
      results.forEach(({ id, success }) => {
        if (!success) {
          console.log(`  - https://qiita.com/items/${id}`);
        }
      });
    }
  }

  getRateLimitStatus() {
    return this.rateLimiter.getStatus();
  }
}