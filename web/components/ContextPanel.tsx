"use client";

import { useState } from "react";
import { Brain, Loader2, Sparkles, StickyNote, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/RichTextEditor";
import { WhiteboardCanvas } from "@/components/WhiteboardCanvas";
import {
  selectAISuggestions,
  selectCaptions,
  selectCurrentProject,
  selectTranscript,
  useProjectStore,
} from "@/lib/store/useProjectStore";
import { formatTimecode } from "@/lib/utils/formatters";

type LoadingState = "transcript" | "captions" | "suggestions" | null;

export function ContextPanel() {
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const selectedFileId = useProjectStore((state) => state.selectedFileId);
  const updateAISuggestion = useProjectStore((state) => state.updateAISuggestion);
  const setTranscript = useProjectStore((state) => state.setTranscript);
  const setCaptions = useProjectStore((state) => state.setCaptions);
  const transcript = useProjectStore(selectTranscript);
  const captions = useProjectStore(selectCaptions);
  const aiSuggestions = useProjectStore(selectAISuggestions);
  const project = useProjectStore(selectCurrentProject);

  const [notes, setNotes] = useState("<p>Documenta acuerdos, checklists o referencias.</p>");
  const [loading, setLoading] = useState<LoadingState>(null);

  async function safeFetch(path: string, payload: Record<string, unknown>) {
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    } catch (error) {
      console.error("AI request failed", error);
      return null;
    }
  }

  async function handleGenerateTranscript() {
    if (!selectedProjectId || !selectedFileId) return;
    setLoading("transcript");
    const data = await safeFetch("/api/ai/transcript", {
      projectId: selectedProjectId,
      fileId: selectedFileId,
    });
    if (data?.transcript) {
      setTranscript(data.transcript);
    }
    setLoading(null);
  }

  async function handleGenerateCaptions() {
    if (!selectedProjectId || !selectedFileId) return;
    setLoading("captions");
    const data = await safeFetch("/api/ai/caption", {
      projectId: selectedProjectId,
      fileId: selectedFileId,
      platform: "tiktok",
    });
    if (data?.captions) {
      setCaptions(data.captions);
    }
    setLoading(null);
  }

  async function handleGenerateSuggestions() {
    if (!selectedProjectId || !selectedFileId) return;
    setLoading("suggestions");
    const data = await safeFetch("/api/ai/edit-suggestions", {
      projectId: selectedProjectId,
      fileId: selectedFileId,
    });
    if (data?.suggestion) {
      updateAISuggestion(data.suggestion);
    }
    setLoading(null);
  }

  return (
    <aside className="flex h-full w-[360px] flex-col border-l border-slate-200 bg-slate-50/60">
      <Card className="m-4 bg-white/90">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Contexto inteligente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-500">
          <p>
            Proyecto: <span className="font-medium text-slate-900">{project?.name ?? "Sin seleccionar"}</span>
          </p>
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs">
            Usa las acciones de AI para obtener transcripciones, captions y sugerencias de edicion en segundos.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="gap-2" onClick={handleGenerateTranscript} disabled={loading === "transcript"}>
              {loading === "transcript" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Transcript
            </Button>
            <Button size="sm" variant="secondary" className="gap-2" onClick={handleGenerateCaptions} disabled={loading === "captions"}>
              {loading === "captions" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Caption IG/TikTok
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={handleGenerateSuggestions} disabled={loading === "suggestions"}>
              {loading === "suggestions" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              Sugerir edits
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ai" className="flex flex-1 flex-col">
        <TabsList className="mx-4 mt-2 grid grid-cols-3">
          <TabsTrigger value="ai" className="text-xs">
            AI
          </TabsTrigger>
          <TabsTrigger value="transcript" className="text-xs">
            Transcript
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">
            Notas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ai" className="flex-1">
          <ScrollArea className="h-full px-4 py-4">
            <div className="space-y-4">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase text-indigo-600">{suggestion.type}</span>
                    <span>{new Date(suggestion.createdAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">{suggestion.title}</p>
                  {suggestion.summary && <p className="mt-1 text-xs text-slate-500">{suggestion.summary}</p>}
                  {suggestion.payload?.ranges && Array.isArray(suggestion.payload.ranges) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {suggestion.payload.ranges.map((range: any, index: number) => (
                        <span key={index} className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] text-slate-600">
                          {formatTimecode(range.start)} - {formatTimecode(range.end)} ({range.action})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {aiSuggestions.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                  Solicita sugerencias para poblar este panel.
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="transcript" className="flex-1">
          <ScrollArea className="h-full px-4 py-4">
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                Exporta la transcripcion para subtitulos o guiones. Cada segmento conserva timecodes.
              </div>
              {transcript.map((segment) => (
                <div key={segment.id} className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{segment.speaker ?? "Locutor"}</span>
                    <span className="font-mono text-[11px]">
                      {formatTimecode(segment.start)} - {formatTimecode(segment.end)}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-700">{segment.text}</p>
                </div>
              ))}
              {transcript.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                  Genera la transcripcion con el asistente de AI.
                </div>
              )}
              <Separator className="my-4" />
              <h4 className="text-xs font-semibold uppercase text-slate-500">Captions sociales</h4>
              {captions.map((caption) => (
                <div key={caption.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-mono text-[11px] text-slate-500">
                    {formatTimecode(caption.start)} - {formatTimecode(caption.end)}
                  </span>
                  <p className="mt-1 text-slate-700">{caption.text}</p>
                </div>
              ))}
              {captions.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
                  Genera captions personalizados por plataforma.
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="notes" className="flex-1">
          <ScrollArea className="h-full px-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <StickyNote className="h-4 w-4" />
                Notas y checklists sincronizados con el proyecto.
              </div>
              <RichTextEditor value={notes} onUpdate={setNotes} placeholder="Checklist, referencias, copy..." />
              <WhiteboardCanvas />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
