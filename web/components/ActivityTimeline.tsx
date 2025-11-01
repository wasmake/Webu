"use client";

import { Clock, MessageCircle, Sparkles, UploadCloud } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { selectActivities, useProjectStore } from "@/lib/store/useProjectStore";
import { formatRelativeDate } from "@/lib/utils/formatters";

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  file_uploaded: UploadCloud,
  comment_added: MessageCircle,
  comment_resolved: MessageCircle,
  status_changed: Clock,
  ai_generated: Sparkles,
  editor_joined: Clock,
  asset_reordered: Clock,
};

export function ActivityTimeline() {
  const activity = useProjectStore(selectActivities);

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Actividad reciente</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-72 pr-2">
          <ul className="space-y-4 py-4">
            {activity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.type] ?? Clock;
              return (
                <li key={item.id} className="relative pl-9">
                  <Icon className="absolute left-0 top-0 h-5 w-5 text-indigo-500" />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{item.actor.name}</span>
                    <span>{formatRelativeDate(item.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-700">{item.message}</p>
                </li>
              );
            })}
            {activity.length === 0 && (
              <li className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Aun no hay actividad registrada.
              </li>
            )}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
