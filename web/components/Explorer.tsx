"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileAudio, FileText, FileVideo, Image as ImageIcon, Lock, Unlock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  selectCurrentProject,
  selectFilesForCurrentProject,
  useProjectStore,
} from "@/lib/store/useProjectStore";
import type { FileKind, ProjectFile } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { formatBytes, formatDuration, formatRelativeDate } from "@/lib/utils/formatters";

const ORDER_VIEWS = [
  { id: "project", label: "Orden del proyecto (bloqueado)", icon: Lock },
  { id: "personal_asc", label: "Personal ASC", icon: Unlock },
  { id: "personal_desc", label: "Personal DESC", icon: Unlock },
] as const;

const ICONS: Record<FileKind, React.ComponentType<{ className?: string }>> = {
  video: FileVideo,
  audio: FileAudio,
  image: ImageIcon,
  document: FileText,
};

function SortableFileCard({ file, disabled }: { file: ProjectFile; disabled: boolean }) {
  const { setSelectedFile, selectedFileId } = useProjectStore((state) => ({
    setSelectedFile: state.setSelectedFile,
    selectedFileId: state.selectedFileId,
  }));
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.id,
    disabled,
  });
  const Icon = ICONS[file.kind];

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden border border-slate-200 bg-white transition-all hover:border-indigo-200 hover:shadow-md",
        selectedFileId === file.id && "border-indigo-500 shadow-lg",
        disabled && "cursor-default",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
      onClick={() => setSelectedFile(file.id)}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium text-slate-900">{file.name}</span>
        </div>
        <Badge variant="secondary" className="uppercase">
          #{file.order}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 py-3">
        <div className="rounded-lg bg-slate-100/80 px-3 py-2 text-xs text-slate-500">
          <p>{file.description ?? "Sin descripcion"}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <p>
            <span className="font-semibold text-slate-700">Duracion:</span> {formatDuration(file.durationSeconds)}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Peso:</span> {formatBytes(file.sizeInBytes)}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Actualizado:</span> {formatRelativeDate(file.updatedAt)}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Tags:</span> {file.tags?.join(", ") ?? "--"}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
          <span>Subido por {file.uploadedBy.name}</span>
          <span>{new Date(file.createdAt).toLocaleDateString("es-MX")}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function Explorer() {
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const orderView = useProjectStore((state) => state.orderView);
  const setOrderView = useProjectStore((state) => state.setOrderView);
  const reorderPersonalView = useProjectStore((state) => state.reorderPersonalView);
  const projectOrderOverrides = useProjectStore((state) => state.projectOrderOverrides);
  const upsertActivity = useProjectStore((state) => state.upsertActivity);
  const files = useProjectStore(selectFilesForCurrentProject);
  const currentProject = useProjectStore(selectCurrentProject);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
  );

  const isLocked = orderView === "project";
  const items = files.map((file) => file.id);

  function handleDragEnd(event: DragEndEvent) {
    if (isLocked) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    reorderPersonalView(selectedProjectId, reordered);

    const movedFile = files.find((file) => file.id === active.id);
    if (movedFile && currentProject) {
      upsertActivity({
        id: `activity_${Date.now()}`,
        projectId: selectedProjectId,
        type: "asset_reordered",
        message: `Se reordeno ${movedFile.name} en la vista personal`,
        actor: currentProject.assignedEditor ?? currentProject.owner,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return (
    <section className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Explorador de archivos</h3>
            <p className="text-sm text-slate-500">
              Orden maestro definido por el dueno. Ajusta tu vista personal sin afectar al equipo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ORDER_VIEWS.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                size="sm"
                variant={orderView === id ? "default" : "ghost"}
                onClick={() => setOrderView(id)}
                className="gap-2 rounded-full"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>
        <Separator className="mt-4" />
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {files.length} recursos vinculados a este proyecto
          </span>
          {!isLocked && projectOrderOverrides[selectedProjectId] && (
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
              Vista personal activa
            </span>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            disabled={isLocked}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={items}>
              {files.map((file) => (
                <SortableFileCard key={file.id} file={file} disabled={isLocked} />
              ))}
            </SortableContext>
          </DndContext>
          {files.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
              Aun no hay archivos. Sube contenido para comenzar a colaborar.
            </div>
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
