import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { extractReceiptData } from "@/lib/ai/extract-receipt";
import { receiptVisionModel } from "@/lib/ai/provider";

const bodySchema = z.object({
  image: z.string().min(1),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const result = await extractReceiptData({
    model: receiptVisionModel,
    imageData: parsed.data.image,
    mimeType: "image/jpeg",
  });

  if (!result.success) {
    console.error("Receipt extraction failed:", result.error);
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ data: result.data });
}
