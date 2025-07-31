// Quick test to trigger the download function
import { downloadOpportunityImages } from './utils/downloadOpportunityImages';

console.log('Starting image download test...');
downloadOpportunityImages().then(result => {
  console.log('Download result:', result);
}).catch(error => {
  console.error('Download error:', error);
});