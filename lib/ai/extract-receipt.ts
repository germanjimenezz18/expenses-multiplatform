import type { LanguageModelV3 } from "@ai-sdk/provider";
import { generateText } from "ai";
import type { z } from "zod";
import { convertAmountToMiliUnits } from "@/lib/utils/currency";
import { GENERATION_DEFAULTS } from "./models";
import { receiptExtractionSchema } from "./schemas";

const SYSTEM_PROMPT = `You are a receipt data extraction assistant. Analyze the provided receipt image and extract structured data.

Respond ONLY with a valid JSON object matching this schema:
{
  "merchant": "string (store/merchant name)",
  "date": "string (ISO 8601 date, optional)",
  "items": [{ "name": "string", "quantity": number (optional), "unitPrice": number (optional), "totalPrice": number }],
  "subtotal": number (optional),
  "tax": number (optional),
  "total": number (total amount paid),
  "currency": "string (ISO 4217 code, default USD)",
  "suggestedCategory": "string (optional, suggested spending category)"
}

Rules:
- All monetary values must be plain numbers (e.g. 12.99, not "$12.99")
- If the currency is not visible, default to "USD"
- If the date is visible, use ISO 8601 format (e.g. "2026-01-15")
- Do NOT include any text outside the JSON object`;

type ImageMimeType = "image/jpeg" | "image/png" | "image/webp";

const OPENING_MARKDOWN_FENCE = /^```(?:json)?\s*\n?/i;
const CLOSING_MARKDOWN_FENCE = /\n?```\s*$/i;

interface ExtractReceiptParams {
  model: LanguageModelV3;
  imageData: string | Uint8Array;
  mimeType: ImageMimeType;
}

export type ExtractReceiptResult =
  | { success: true; data: z.infer<typeof receiptExtractionSchema> }
  | { success: false; error: string };

export async function extractReceiptData({
  model,
  imageData,
  mimeType,
}: ExtractReceiptParams): Promise<ExtractReceiptResult> {
  const { text } = await generateText({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "file",
            data: imageData,
            mediaType: mimeType,
          },
          { type: "text", text: "Extract the data from this receipt." },
        ],
      },
    ],
    temperature: GENERATION_DEFAULTS.receipt.temperature,
    maxOutputTokens: GENERATION_DEFAULTS.receipt.maxTokens,
  });

  // Models often wrap JSON in markdown fences — strip them before parsing
  const cleaned = text
    .replace(OPENING_MARKDOWN_FENCE, "")
    .replace(CLOSING_MARKDOWN_FENCE, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { success: false, error: "Model response is not valid JSON" };
  }

  const result = receiptExtractionSchema.safeParse(parsed);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }

  const data = {
    ...result.data,
    total: convertAmountToMiliUnits(result.data.total),
    subtotal: result.data.subtotal
      ? convertAmountToMiliUnits(result.data.subtotal)
      : undefined,
    tax: result.data.tax
      ? convertAmountToMiliUnits(result.data.tax)
      : undefined,
    items: result.data.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice
        ? convertAmountToMiliUnits(item.unitPrice)
        : undefined,
      totalPrice: convertAmountToMiliUnits(item.totalPrice),
    })),
  };

  console.log({ result });
  console.log({ data });

  return { success: true, data };
}
