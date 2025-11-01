import { NextResponse } from "next/server";

import { addComment, logActivity } from "@/lib/services/projectService";
import { commentSchema } from "@/lib/validation/schemas";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const json = await request.json();
  const parsed = commentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const comment = parsed.data;
  if (comment.projectId !== projectId) {
    return NextResponse.json({ error: "projectId mismatch" }, { status: 400 });
  }

  await addComment(comment);
  await logActivity({
    id: `activity_${Date.now()}`,
    projectId,
    type: "comment_added",
    message: `${comment.author.name} comento en ${comment.fileId} @ ${comment.timestampSeconds}s`,
    actor: comment.author,
    createdAt: new Date().toISOString(),
    entityId: comment.id,
  });

  return NextResponse.json({ comment }, { status: 201 });
}
