import { MockLanguageModelV3 } from "ai/test";
import { describe, expect, it } from "vitest";
import { extractReceiptData } from "../extract-receipt";

const COMPLETE_RECEIPT = {
  merchant: "Whole Foods Market",
  date: "2026-02-28T14:30:00Z",
  items: [
    { name: "Organic Bananas", quantity: 1, unitPrice: 1.99, totalPrice: 1.99 },
    { name: "Almond Milk", quantity: 2, unitPrice: 4.49, totalPrice: 8.98 },
  ],
  subtotal: 10.97,
  tax: 0.88,
  total: 11.85,
  currency: "USD",
  suggestedCategory: "Groceries",
};

const MINIMAL_RECEIPT = {
  merchant: "Corner Store",
  items: [{ name: "Snack", totalPrice: 3.5 }],
  total: 3.5,
};

function mockModel(jsonResponse: unknown) {
  return new MockLanguageModelV3({
    doGenerate: {
      content: [{ type: "text", text: JSON.stringify(jsonResponse) }],
      finishReason: { type: "stop" },
      usage: { inputTokens: 100, outputTokens: 50 },
    },
  });
}

function mockModelRaw(text: string) {
  return new MockLanguageModelV3({
    doGenerate: {
      content: [{ type: "text", text }],
      finishReason: { type: "stop" },
      usage: { inputTokens: 100, outputTokens: 50 },
    },
  });
}

const DUMMY_IMAGE = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk";

describe("extractReceiptData", () => {
  it("extracts a complete receipt with all fields", async () => {
    const model = mockModel(COMPLETE_RECEIPT);
    const result = await extractReceiptData({
      model,
      imageData: DUMMY_IMAGE,
      mimeType: "image/jpeg",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.merchant).toBe("Whole Foods Market");
      expect(result.data.items).toHaveLength(2);
      expect(result.data.total).toBe(11.85);
      expect(result.data.currency).toBe("USD");
      expect(result.data.suggestedCategory).toBe("Groceries");
      expect(result.data.date).toBe("2026-02-28T14:30:00Z");
    }
  });

  it("extracts a minimal receipt and defaults currency to USD", async () => {
    const model = mockModel(MINIMAL_RECEIPT);
    const result = await extractReceiptData({
      model,
      imageData: DUMMY_IMAGE,
      mimeType: "image/png",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.merchant).toBe("Corner Store");
      expect(result.data.total).toBe(3.5);
      expect(result.data.currency).toBe("USD");
      expect(result.data.date).toBeUndefined();
      expect(result.data.subtotal).toBeUndefined();
      expect(result.data.tax).toBeUndefined();
    }
  });

  it("returns error when model returns invalid JSON schema", async () => {
    const model = mockModel({ merchant: "Store" }); // missing required fields
    const result = await extractReceiptData({
      model,
      imageData: DUMMY_IMAGE,
      mimeType: "image/jpeg",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });

  it("returns error when model returns non-JSON text", async () => {
    const model = mockModelRaw(
      "I cannot process this image. Please try again."
    );
    const result = await extractReceiptData({
      model,
      imageData: DUMMY_IMAGE,
      mimeType: "image/jpeg",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Model response is not valid JSON");
    }
  });

  it("passes the correct image FilePart to the model", async () => {
    const model = mockModel(COMPLETE_RECEIPT);
    await extractReceiptData({
      model,
      imageData: DUMMY_IMAGE,
      mimeType: "image/webp",
    });

    expect(model.doGenerateCalls).toHaveLength(1);
    const call = model.doGenerateCalls[0];
    const userMessage = call.prompt.find((m) => m.role === "user");
    expect(userMessage).toBeDefined();

    const filePart = userMessage!.content.find(
      (p: { type: string }) => p.type === "file"
    );
    expect(filePart).toBeDefined();
    expect(filePart).toMatchObject({
      type: "file",
      mediaType: "image/webp",
    });
  });

  it("accepts Uint8Array image data", async () => {
    const model = mockModel(COMPLETE_RECEIPT);
    const binaryData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

    const result = await extractReceiptData({
      model,
      imageData: binaryData,
      mimeType: "image/png",
    });

    expect(result.success).toBe(true);

    const call = model.doGenerateCalls[0];
    const userMessage = call.prompt.find((m) => m.role === "user");
    const filePart = userMessage!.content.find(
      (p: { type: string }) => p.type === "file"
    );
    expect(filePart).toMatchObject({
      type: "file",
      mediaType: "image/png",
    });
  });
});
