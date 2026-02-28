import { customProvider, createProviderRegistry } from "ai";
import { createFallback } from "ai-fallback";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { MODEL_IDS } from "./models";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const receiptVisionModel = createFallback({
  models: [
    openrouter(MODEL_IDS.gemini25Flash),
    openrouter(MODEL_IDS.qwen25Vl72b),
    openrouter(MODEL_IDS.gemini20Flash),
  ],
});

export const financeChatModel = createFallback({
  models: [
    openrouter(MODEL_IDS.gemini25FlashLite),
    openrouter(MODEL_IDS.claudeSonnet4),
    openrouter(MODEL_IDS.gpt41Mini),
  ],
});

export const financeAgentModel = createFallback({
  models: [
    openrouter(MODEL_IDS.claudeSonnet4),
    openrouter(MODEL_IDS.gpt41Mini),
    openrouter(MODEL_IDS.gemini25Flash),
  ],
});

const expensesProvider = customProvider({
  languageModels: {
    receipt: receiptVisionModel,
    chat: financeChatModel,
    agent: financeAgentModel,
  },
  fallbackProvider: openrouter,
});

export const registry = createProviderRegistry({
  openrouter,
  expenses: expensesProvider,
});
