export const ITEM_MATCHING_QUEUE = 'item-matching';

/** Minimum Jaccard similarity score (0–100) to persist a match */
export const MATCH_MIN_SCORE = 25;

/** Number of found posts compared per parallel batch inside a job */
export const MATCH_BATCH_SIZE = 20;

/** Concurrent jobs processed by each worker process */
export const WORKER_CONCURRENCY = 5;
