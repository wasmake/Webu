"use client";

import { CalendarDays, LayoutList, User, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PROJECT_STATES } from "@/lib/constants/projectStates";
import { selectCurrentProject, useProjectStore } from "@/lib/store/useProjectStore";
import { formatRelativeDate } from "@/lib/utils/formatters";

export function ProjectHeader() {
  const project = useProjectStore(selectCurrentProject);

  if (!project) {
    return (
      <Card className="border-dashed border-slate-300 bg-white/80">
        <CardContent className="flex h-32 items-center justify-center text-sm text-slate-500">
          Selecciona un proyecto para ver el panel.
        </CardContent>
      </Card>
    );
  }

  const stateMeta = PROJECT_STATES[project.status];

  return (
    <Card className="bg-white/90">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
            <Badge className={stateMeta.accent}>{stateMeta.label}</Badge>
          </div>
          <p className="max-w-xl text-sm text-slate-600">{project.description}</p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {project.dueDate ? new Date(project.dueDate).toLocaleDateString("es-MX") : "Sin fecha"}
              <span className="ml-1 rounded-full bg-slate-900/5 px-2 py-0.5">
                {formatRelativeDate(project.dueDate ?? new Date())}
              </span>
            </span>
            {project.assignedEditor && (
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                Editor: {project.assignedEditor.name}
              </span>
            )}
            {project.reviewers && project.reviewers.length > 0 && (
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                Reviewers: {project.reviewers.map((reviewer) => reviewer.name).join(", ")}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button variant="secondary" className="gap-2">
            <LayoutList className="h-4 w-4" />
            Ver orden maestro
          </Button>
          <div className="text-xs text-slate-500">
            Actualizado {formatRelativeDate(project.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
