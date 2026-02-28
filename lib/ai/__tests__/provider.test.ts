import { generateText } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import { describe, expect, it } from "vitest";
import { categorizationSchema, receiptExtractionSchema } from "../schemas";

function mockModel(text: string) {
  return new MockLanguageModelV3({
    doGenerate: {
      content: [{ type: "text", text }],
      finishReason: { unified: "stop", raw: undefined },
      usage: {
        inputTokens: { total: 10, noCache: 10 },
        outputTokens: { total: 20, text: 20, reasoning: undefined },
      },
      warnings: [],
    },
  });
}

describe("MockLanguageModelV3 with generateText", () => {
  it("returns text from mock model", async () => {
    const result = await generateText({
      model: mockModel("Hello from mock"),
      prompt: "Say hello",
    });

    expect(result.text).toBe("Hello from mock");
  });

  it("returns JSON that parses against receiptExtractionSchema", async () => {
    const receipt = {
      merchant: "Starbucks",
      date: "2026-02-28T10:00:00Z",
      items: [
        { name: "Latte", quantity: 1, unitPrice: 5.5, totalPrice: 5.5 },
        { name: "Muffin", totalPrice: 3.25 },
      ],
      subtotal: 8.75,
      tax: 0.7,
      total: 9.45,
      currency: "USD",
      suggestedCategory: "Food & Drink",
    };

    const result = await generateText({
      model: mockModel(JSON.stringify(receipt)),
      prompt: "Extract receipt data",
    });

    const parsed = receiptExtractionSchema.safeParse(JSON.parse(result.text));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(receipt);
    }
  });

  it("applies schema defaults when model omits optional fields", async () => {
    const partial = {
      merchant: "Local Shop",
      items: [],
      total: 15.0,
    };

    const result = await generateText({
      model: mockModel(JSON.stringify(partial)),
      prompt: "Extract receipt data",
    });

    const parsed = receiptExtractionSchema.safeParse(JSON.parse(result.text));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.currency).toBe("USD");
      expect(parsed.data.date).toBeUndefined();
      expect(parsed.data.suggestedCategory).toBeUndefined();
    }
  });

  it("rejects invalid JSON against schema", async () => {
    const invalid = { merchant: "Shop" }; // missing items and total

    const result = await generateText({
      model: mockModel(JSON.stringify(invalid)),
      prompt: "Extract receipt data",
    });

    const parsed = receiptExtractionSchema.safeParse(JSON.parse(result.text));
    expect(parsed.success).toBe(false);
  });

  it("parses categorization output from model", async () => {
    const categorization = {
      categoryName: "Transportation",
      confidence: 0.92,
      reasoning: "Uber is a ride-sharing service",
    };

    const result = await generateText({
      model: mockModel(JSON.stringify(categorization)),
      prompt: "Categorize: Uber ride to airport",
    });

    const parsed = categorizationSchema.safeParse(JSON.parse(result.text));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.categoryName).toBe("Transportation");
      expect(parsed.data.confidence).toBeGreaterThan(0.9);
    }
  });
});
