import { describe, expect, it } from "vitest";
import {
  DEFAULT_CHAT_MODEL,
  GENERATION_DEFAULTS,
  MODEL_IDS,
  REGISTRY_MODELS,
} from "../models";

const OPENROUTER_ID_PATTERN = /^[\w-]+\/[\w.-]+$/;
const EXPENSES_PREFIX_PATTERN = /^expenses:/;

describe("MODEL_IDS", () => {
  it("contains all expected model IDs in OpenRouter format", () => {
    for (const id of Object.values(MODEL_IDS)) {
      expect(id).toMatch(OPENROUTER_ID_PATTERN);
    }
  });

  it("has unique model IDs", () => {
    const values = Object.values(MODEL_IDS);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("DEFAULT_CHAT_MODEL", () => {
  it("references a valid model ID", () => {
    expect(Object.values(MODEL_IDS)).toContain(DEFAULT_CHAT_MODEL);
  });
});

describe("REGISTRY_MODELS", () => {
  it("uses expenses: prefix for all keys", () => {
    for (const key of Object.values(REGISTRY_MODELS)) {
      expect(key).toMatch(EXPENSES_PREFIX_PATTERN);
    }
  });

  it("has receipt, chat, and agent entries", () => {
    expect(REGISTRY_MODELS).toHaveProperty("receipt");
    expect(REGISTRY_MODELS).toHaveProperty("chat");
    expect(REGISTRY_MODELS).toHaveProperty("agent");
  });
});

describe("GENERATION_DEFAULTS", () => {
  it("has config for each purpose", () => {
    for (const purpose of ["receipt", "chat", "agent"] as const) {
      expect(GENERATION_DEFAULTS[purpose]).toHaveProperty("temperature");
      expect(GENERATION_DEFAULTS[purpose]).toHaveProperty("maxTokens");
    }
  });

  it("uses temperature 0 for receipt and agent (deterministic)", () => {
    expect(GENERATION_DEFAULTS.receipt.temperature).toBe(0);
    expect(GENERATION_DEFAULTS.agent.temperature).toBe(0);
  });

  it("uses higher temperature for chat (conversational)", () => {
    expect(GENERATION_DEFAULTS.chat.temperature).toBeGreaterThan(0);
  });
});
