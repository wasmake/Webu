import { NextResponse } from "next/server";

import { generateCaptions } from "@/lib/services/aiService";
import { aiRequestSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = aiRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { projectId, fileId, platform } = parsed.data;
  const captions = await generateCaptions(projectId, fileId, platform ?? "es");
  return NextResponse.json(captions);
}
