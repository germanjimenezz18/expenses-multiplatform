import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createProviderRegistry, customProvider } from "ai";
import { createFallback } from "ai-fallback";
import { MODEL_IDS } from "./models";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// OpenRouter provider is on spec V2 while ai-fallback v2 expects V3.
// The runtime APIs are compatible; cast to bridge the transitional gap.
const model = (id: string) => openrouter(id) as unknown as LanguageModelV3;

export const receiptVisionModel = createFallback({
  models: [
    model(MODEL_IDS.gemini25Flash),
    model(MODEL_IDS.qwen25Vl72b),
    model(MODEL_IDS.gemini20Flash),
  ],
});

export const financeChatModel = createFallback({
  models: [
    model(MODEL_IDS.gemini25FlashLite),
    model(MODEL_IDS.claudeSonnet4),
    model(MODEL_IDS.gpt41Mini),
  ],
});

export const financeAgentModel = createFallback({
  models: [
    model(MODEL_IDS.claudeSonnet4),
    model(MODEL_IDS.gpt41Mini),
    model(MODEL_IDS.gemini25Flash),
  ],
});

const expensesProvider = customProvider({
  languageModels: {
    receipt: receiptVisionModel,
    chat: financeChatModel,
    agent: financeAgentModel,
  },
  fallbackProvider: openrouter as unknown as Parameters<
    typeof customProvider
  >[0]["fallbackProvider"],
});

export const registry = createProviderRegistry({
  openrouter: openrouter as unknown as Parameters<
    typeof createProviderRegistry
  >[0][string],
  expenses: expensesProvider,
});
