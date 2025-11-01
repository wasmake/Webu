import { NextResponse } from "next/server";

import { createFile, logActivity } from "@/lib/services/projectService";
import { createUploadUrl } from "@/lib/storage/storjClient";
import { fileUploadPayloadSchema } from "@/lib/validation/schemas";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const json = await request.json();
  const parsed = fileUploadPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { file, contentType, generateUploadUrl } = parsed.data;
  if (file.projectId !== projectId) {
    return NextResponse.json({ error: "projectId mismatch" }, { status: 400 });
  }

  await createFile(file);
  await logActivity({
    id: `activity_${Date.now()}`,
    projectId,
    type: "file_uploaded",
    message: `${file.uploadedBy.name} registro ${file.name}`,
    actor: file.uploadedBy,
    createdAt: new Date().toISOString(),
    entityId: file.id,
  });

  let uploadUrl: string | undefined;
  if (generateUploadUrl && contentType) {
    uploadUrl = await createUploadUrl(file.s3Key, contentType);
  }

  return NextResponse.json({ file, uploadUrl }, { status: 201 });
}
