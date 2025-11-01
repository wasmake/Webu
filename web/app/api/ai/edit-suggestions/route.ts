import { NextResponse } from "next/server";

import { generateEditSuggestions } from "@/lib/services/aiService";
import { aiRequestSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = aiRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { projectId, fileId } = parsed.data;
  const suggestion = await generateEditSuggestions(projectId, fileId, {});
  return NextResponse.json({ suggestion });
}
