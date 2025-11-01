import { NextResponse } from "next/server";

import { fetchActivity } from "@/lib/services/projectService";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function GET(_: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const activity = await fetchActivity(projectId);
  return NextResponse.json({ activity });
}
