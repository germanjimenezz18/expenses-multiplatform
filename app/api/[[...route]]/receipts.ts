import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { extractReceiptData } from "@/lib/ai/extract-receipt";
import { receiptVisionModel } from "@/lib/ai/provider";

const app = new Hono().post(
  "/extract",
  zValidator(
    "json",
    z.object({
      image: z.string().min(1),
    })
  ),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { image } = c.req.valid("json");

    const result = await extractReceiptData({
      model: receiptVisionModel,
      imageData: image,
      mimeType: "image/jpeg",
    });

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ data: result.data });
  }
);

export default app;
