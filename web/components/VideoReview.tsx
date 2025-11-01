"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Play, Plus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  selectCommentsForFile,
  selectFilesForCurrentProject,
  useProjectStore,
} from "@/lib/store/useProjectStore";
import type { TimestampedComment } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { formatTimecode } from "@/lib/utils/formatters";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

function CommentThread({ comment }: { comment: TimestampedComment }) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white px-3 py-2")}
    >
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{comment.author.name}</span>
        <span className="rounded bg-slate-900/5 px-1.5 py-0.5 font-mono text-[11px]">
          {formatTimecode(comment.timestampSeconds)}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-700">{comment.body}</p>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-1 border-l-2 border-dashed border-slate-200 pl-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="text-xs text-slate-600">
              <span className="font-medium text-slate-700">{reply.author.name}:</span> {reply.body}
            </div>
          ))}
        </div>
      )}
      {comment.resolvedAt && (
        <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Resuelto
        </span>
      )}
    </div>
  );
}

interface TimelineMarkerProps {
  timestamp: number;
  duration?: number;
}

function TimelineMarker({ timestamp, duration }: TimelineMarkerProps) {
  if (!duration || duration === 0) return null;
  const left = Math.min(100, (timestamp / duration) * 100);
  return (
    <motion.div
      layout
      className="absolute top-0 h-full w-1 rounded-sm bg-indigo-500"
      style={{ left: `${left}%` }}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
    />
  );
}

export function VideoReview() {
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const selectedFileId = useProjectStore((state) => state.selectedFileId);
  const appendComment = useProjectStore((state) => state.appendComment);
  const files = useProjectStore(selectFilesForCurrentProject);
  const selectedFile = useMemo(
    () => files.find((file) => file.id === selectedFileId),
    [files, selectedFileId],
  );
  const comments = useProjectStore((state) => selectCommentsForFile(state, selectedFileId));

  const [timestamp, setTimestamp] = useState(0);
  const [message, setMessage] = useState("");

  function handleCreateComment() {
    if (!selectedFile || message.trim().length === 0) return;
    appendComment({
      id: `comment_${Date.now()}`,
      projectId: selectedProjectId,
      fileId: selectedFile.id,
      timestampSeconds: timestamp,
      body: message,
      author: {
        id: "current_user",
        name: "Tu",
        role: "editor",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setMessage("");
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <Card className="bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold text-slate-900">
            Reproductor y feedback
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
            <Play className="h-4 w-4" />
            Ir a la marca {formatTimecode(timestamp)}
          </Button>
        </CardHeader>
        <CardContent>
          {selectedFile ? (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200">
                <ReactPlayer
                  url={`https://cdn.storj.io/${selectedFile.s3Key}`}
                  width="100%"
                  height="100%"
                  controls
                  onProgress={({ playedSeconds }) => setTimestamp(Math.floor(playedSeconds))}
                />
              </div>
              <div className="relative h-14 rounded-full bg-slate-100">
                <div className="absolute inset-2 rounded-full border border-dashed border-slate-300" />
                <AnimatePresence>
                  {comments.map((comment) => (
                    <TimelineMarker
                      key={comment.id}
                      timestamp={comment.timestampSeconds}
                      duration={selectedFile.durationSeconds}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MessageSquare className="h-4 w-4" />
                  Deja feedback atado a un minuto especifico
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={timestamp}
                    onChange={(event) => setTimestamp(Number(event.target.value))}
                    className="w-32"
                  />
                  <Input
                    placeholder="Tu comentario contextual..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleCreateComment} className="gap-2">
                    <Send className="h-4 w-4" />
                    Publicar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-slate-500">
              <MessageSquare className="h-6 w-6" />
              Selecciona un archivo de video para iniciar la revision.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-1 flex-col bg-white/90">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold text-slate-900">
            Comentarios ({comments.length})
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
            <Plus className="h-4 w-4" />
            Nuevo hilo
          </Button>
        </CardHeader>
        <CardContent className="flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-3 pr-2">
              {comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} />
              ))}
              {comments.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Aun no hay comentarios.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
