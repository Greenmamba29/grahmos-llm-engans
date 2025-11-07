// Constants for the LLM Answer Engine

export const STATUS = {
  RATE_LIMIT_REACHED: 'rateLimitReached',
  DONE: 'done',
} as const;

export const FUNCTION_CALL_TYPES = {
  PLACES: 'places',
  SHOPPING: 'shopping',
  TICKER: 'ticker',
} as const;

export const MESSAGE_TYPES = {
  USER_MESSAGE: 'userMessage',
  ASSISTANT_MESSAGE: 'assistantMessage',
  SYSTEM: 'system',
  FUNCTION: 'function',
} as const;

export const SEARCH_PROVIDERS = {
  BRAVE: 'brave',
  SERPER: 'serper',
  GOOGLE: 'google',
} as const;

export const DEFAULT_QUERIES = [
  'When did Daft Punk release Da Funk?',
  'How is Apple\'s stock doing these days?',
  'Where can I get the best bagel in NYC?',
  'I want to buy a mens patagonia vest'
] as const;

export const FILE_UPLOAD_ACCEPT = '.doc,.docx,.pdf, .txt, .js, .tsx' as const;

export const MENTION_TOOLS = {
  FAL_AI_STABLE_DIFFUSION: 'fal-ai/stable-diffusion-v3-medium',
} as const;

export const NODE_TYPES = {
  INPUT: 'INPUT',
  TEXTAREA: 'TEXTAREA',
} as const;

export const KEYBOARD_KEYS = {
  FORWARD_SLASH: '/',
} as const;
