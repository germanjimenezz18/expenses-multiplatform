import { z } from "zod";
import { transactionItemSchema } from "@/db/schema";

export const receiptItemSchema = transactionItemSchema.extend({
  name: z.string().describe("Item name or description"),
  quantity: z.number().optional().describe("Quantity purchased"),
  unitPrice: z.number().optional().describe("Price per unit"),
  totalPrice: z.number().describe("Total price for this item"),
});

export const receiptExtractionSchema = z.object({
  merchant: z.string().describe("Store or merchant name"),
  date: z.string().optional().describe("Transaction date in ISO 8601 format"),
  items: z.array(receiptItemSchema).describe("Line items on the receipt"),
  subtotal: z.number().optional().describe("Subtotal before tax"),
  tax: z.number().optional().describe("Tax amount"),
  total: z.number().describe("Total amount paid"),
  currency: z.string().default("USD").describe("ISO 4217 currency code"),
  suggestedCategory: z
    .string()
    .optional()
    .describe("Suggested spending category based on merchant/items"),
});

export const categorizationSchema = z.object({
  categoryName: z.string().describe("Suggested category name"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence score between 0 and 1"),
  reasoning: z.string().describe("Brief explanation for the categorization"),
});

export const financialInsightSchema = z.object({
  summary: z.string().describe("Brief summary of the insight"),
  type: z
    .enum(["spending", "saving", "trend", "anomaly", "tip"])
    .describe("Type of financial insight"),
  suggestedAction: z
    .string()
    .optional()
    .describe("Actionable recommendation for the user"),
});
