export const MODEL_IDS = {
  // Gemini
  gemini25FlashLite: "google/gemini-2.5-flash-lite",
  gemini25Flash: "google/gemini-2.5-flash",
  gemini20Flash: "google/gemini-2.0-flash-001",

  // Claude
  claudeSonnet4: "anthropic/claude-sonnet-4",

  // OpenAI
  gpt41Mini: "openai/gpt-4.1-mini",

  // Qwen (vision)
  qwen25Vl72b: "qwen/qwen-2.5-vl-72b-instruct",
} as const;

export const DEFAULT_CHAT_MODEL = MODEL_IDS.gemini25FlashLite;

export const REGISTRY_MODELS = {
  receipt: "expenses:receipt",
  chat: "expenses:chat",
  agent: "expenses:agent",
} as const;

export const GENERATION_DEFAULTS = {
  receipt: {
    temperature: 0,
    maxTokens: 2048,
  },
  chat: {
    temperature: 0.7,
    maxTokens: 4096,
  },
  agent: {
    temperature: 0,
    maxTokens: 8192,
  },
} as const;
