import { NextResponse } from "next/server";

import { createProject, logActivity } from "@/lib/services/projectService";
import { projectSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const project = parsed.data;
  await createProject(project);
  await logActivity({
    id: `activity_${Date.now()}`,
    projectId: project.id,
    type: "status_changed",
    message: `Proyecto ${project.name} creado`,
    actor: project.owner,
    createdAt: new Date().toISOString(),
    metadata: { status: project.status },
  });

  return NextResponse.json({ project }, { status: 201 });
}
