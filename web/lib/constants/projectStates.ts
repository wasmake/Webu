import type { ProjectState } from "@/lib/types";

export const PROJECT_STATES: Record<ProjectState, { label: string; accent: string }> = {
  cooking: {
    label: "Cooking",
    accent: "bg-amber-100 text-amber-800",
  },
  ready_to_edit: {
    label: "Listo para editar",
    accent: "bg-indigo-100 text-indigo-700",
  },
  ready_for_review: {
    label: "Listo para revisi?n",
    accent: "bg-sky-100 text-sky-700",
  },
  ready_to_publish: {
    label: "Listo para publicar",
    accent: "bg-emerald-100 text-emerald-700",
  },
  vault: {
    label: "Vault / Archivo",
    accent: "bg-slate-100 text-slate-600",
  },
};

export const PROJECT_STATE_ORDER: ProjectState[] = [
  "cooking",
  "ready_to_edit",
  "ready_for_review",
  "ready_to_publish",
  "vault",
];
