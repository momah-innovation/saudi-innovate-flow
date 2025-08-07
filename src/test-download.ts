// Quick test to trigger the download function
import { downloadOpportunityImages } from './utils/downloadOpportunityImages';
import { logger } from './utils/logger';

logger.info('Starting image download test...');
downloadOpportunityImages().then(result => {
  logger.info('Download result', { data: result });
}).catch(error => {
  logger.error('Download error', undefined, error);
});