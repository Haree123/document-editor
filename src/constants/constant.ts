export const DEFAULT_AUTHOR = "Anonymous";

export const AI_ACTION_DELAY = 1500; // ms

export const PERFORMANCE_THRESHOLDS = {
  LARGE_DOCUMENT: 50,
  VERY_LARGE_DOCUMENT: 100,
  ENABLE_LAZY_COMMENTS: 20,
} as const;

export const DEBOUNCE_DELAYS = {
  BLOCK_UPDATE: 300,
  SEARCH: 500,
} as const;
