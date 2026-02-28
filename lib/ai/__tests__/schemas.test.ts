import { describe, expect, it } from "vitest";
import {
  categorizationSchema,
  financialInsightSchema,
  receiptExtractionSchema,
  receiptItemSchema,
} from "../schemas";

describe("receiptItemSchema", () => {
  it("accepts a complete item", () => {
    const result = receiptItemSchema.safeParse({
      name: "Milk 2L",
      quantity: 2,
      unitPrice: 3.5,
      totalPrice: 7.0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts item with only required fields", () => {
    const result = receiptItemSchema.safeParse({
      name: "Coffee",
      totalPrice: 4.99,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = receiptItemSchema.safeParse({ totalPrice: 5 });
    expect(result.success).toBe(false);
  });

  it("rejects missing totalPrice", () => {
    const result = receiptItemSchema.safeParse({ name: "Item" });
    expect(result.success).toBe(false);
  });
});

describe("receiptExtractionSchema", () => {
  it("accepts a complete receipt", () => {
    const result = receiptExtractionSchema.safeParse({
      merchant: "Whole Foods",
      date: "2026-02-28T12:00:00Z",
      items: [{ name: "Bananas", totalPrice: 2.5 }],
      subtotal: 2.5,
      tax: 0.2,
      total: 2.7,
      currency: "USD",
      suggestedCategory: "Groceries",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal receipt (only required fields)", () => {
    const result = receiptExtractionSchema.safeParse({
      merchant: "Gas Station",
      items: [],
      total: 45.0,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("USD");
    }
  });

  it("defaults currency to USD", () => {
    const result = receiptExtractionSchema.safeParse({
      merchant: "Store",
      items: [],
      total: 10,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("USD");
    }
  });

  it("rejects missing merchant", () => {
    const result = receiptExtractionSchema.safeParse({
      items: [],
      total: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing total", () => {
    const result = receiptExtractionSchema.safeParse({
      merchant: "Store",
      items: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("categorizationSchema", () => {
  it("accepts valid categorization", () => {
    const result = categorizationSchema.safeParse({
      categoryName: "Food & Drink",
      confidence: 0.95,
      reasoning: "Merchant is a coffee shop",
    });
    expect(result.success).toBe(true);
  });

  it("rejects confidence above 1", () => {
    const result = categorizationSchema.safeParse({
      categoryName: "Transport",
      confidence: 1.5,
      reasoning: "Uber ride",
    });
    expect(result.success).toBe(false);
  });

  it("rejects confidence below 0", () => {
    const result = categorizationSchema.safeParse({
      categoryName: "Transport",
      confidence: -0.1,
      reasoning: "Unknown",
    });
    expect(result.success).toBe(false);
  });

  it("accepts boundary values 0 and 1", () => {
    expect(
      categorizationSchema.safeParse({
        categoryName: "A",
        confidence: 0,
        reasoning: "Low",
      }).success
    ).toBe(true);
    expect(
      categorizationSchema.safeParse({
        categoryName: "B",
        confidence: 1,
        reasoning: "High",
      }).success
    ).toBe(true);
  });
});

describe("financialInsightSchema", () => {
  it("accepts valid insight with suggestedAction", () => {
    const result = financialInsightSchema.safeParse({
      summary: "Spending on food increased 20% this month",
      type: "trend",
      suggestedAction: "Consider meal prepping to reduce costs",
    });
    expect(result.success).toBe(true);
  });

  it("accepts insight without suggestedAction", () => {
    const result = financialInsightSchema.safeParse({
      summary: "Unusual charge detected",
      type: "anomaly",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid insight types", () => {
    for (const type of ["spending", "saving", "trend", "anomaly", "tip"]) {
      const result = financialInsightSchema.safeParse({
        summary: "Test",
        type,
      });
      expect(result.success, `type "${type}" should be valid`).toBe(true);
    }
  });

  it("rejects invalid insight type", () => {
    const result = financialInsightSchema.safeParse({
      summary: "Test",
      type: "prediction",
    });
    expect(result.success).toBe(false);
  });
});
