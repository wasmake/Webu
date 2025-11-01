"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Film, Inbox, Layers, Rocket, Vault } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PROJECT_STATE_ORDER, PROJECT_STATES } from "@/lib/constants/projectStates";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { ProjectState } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const STATE_ICONS: Record<ProjectState, React.ComponentType<{ className?: string }>> = {
  cooking: Inbox,
  ready_to_edit: Layers,
  ready_for_review: Film,
  ready_to_publish: Rocket,
  vault: Vault,
};

export function Sidebar() {
  const { projects, selectedProjectId, setSelectedProject } = useProjectStore((state) => ({
    projects: state.projects,
    selectedProjectId: state.selectedProjectId,
    setSelectedProject: state.setSelectedProject,
  }));

  const grouped = useMemo(() => {
    return PROJECT_STATE_ORDER.map((state) => ({
      state,
      projects: projects.filter((project) => project.status === state),
    }));
  }, [projects]);

  return (
    <aside className="flex h-full min-w-[280px] max-w-[320px] flex-col border-r border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Panel de proyectos</p>
          <h2 className="text-lg font-semibold text-slate-900">Kitchen Collab</h2>
        </div>
        <Button size="sm" variant="secondary" className="rounded-full" asChild>
          <Link href="/new-project">Nuevo</Link>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-6 px-4 pb-6">
          {grouped.map(({ state, projects: stateProjects }) => {
            const Icon = STATE_ICONS[state];
            const stateMeta = PROJECT_STATES[state];
            return (
              <div key={state}>
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Icon className="h-3.5 w-3.5" />
                    {stateMeta.label}
                  </div>
                  <Badge variant="secondary">{stateProjects.length}</Badge>
                </div>
                <ul className="mt-2 space-y-1">
                  {stateProjects.map((project) => (
                    <li key={project.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project.id)}
                        className={cn(
                          "group w-full rounded-lg px-3 py-2 text-left transition-all",
                          "hover:bg-slate-100",
                          selectedProjectId === project.id && "bg-slate-900 text-white hover:bg-slate-900",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium leading-tight">{project.name}</span>
                          <span className="text-[11px] uppercase text-slate-400 group-hover:text-slate-500">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString("es-MX") : "Sin fecha"}
                          </span>
                        </div>
                        {project.description && (
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500 group-hover:text-slate-600">
                            {project.description}
                          </p>
                        )}
                      </button>
                    </li>
                  ))}
                  {stateProjects.length === 0 && (
                    <li className="px-3 py-6 text-center text-xs text-slate-400">
                      Sin proyectos en esta etapa
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-slate-200 px-4 py-4 text-xs text-slate-500">
        <p className="font-medium text-slate-600">Navegaci?n r?pida</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">Favoritos</Badge>
          <Badge variant="outline">Compartidos</Badge>
          <Badge variant="outline">Archivados</Badge>
        </div>
      </div>
    </aside>
  );
}
