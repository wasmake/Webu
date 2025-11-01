import { randomUUID } from "node:crypto";

import { emitRealtimeEvent } from "@/lib/realtime/events";
import type { AISuggestion, CaptionBlock, TranscriptSegment } from "@/lib/types";

interface TranscriptPayload {
  transcript: TranscriptSegment[];
}

interface CaptionPayload {
  captions: CaptionBlock[];
  format: "srt" | "vtt" | "json";
}

interface EditSuggestionPayload {
  suggestions: Array<{ summary: string; start: number; end: number; action: string }>;
}

export async function generateTranscript(projectId: string, fileId: string, _sourceUrl: string) {
  const transcript: TranscriptPayload = {
    transcript: [
      {
        id: randomUUID(),
        start: 0,
        end: 8,
        text: "[AI] Introducci?n detectada",
      },
      {
        id: randomUUID(),
        start: 8,
        end: 22,
        text: "[AI] Narraci?n con ingredientes principales",
      },
    ],
  };

  await emitRealtimeEvent(`projects.${projectId}.ai`, {
    type: "transcript_generated",
    data: transcript,
  });

  return transcript;
}

export async function generateCaptions(projectId: string, fileId: string, language = "es") {
  const captions: CaptionPayload = {
    format: "json",
    captions: [
      { id: randomUUID(), start: 0, end: 4, text: "[AI] Hook inicial (${language})" },
      { id: randomUUID(), start: 4, end: 9, text: "[AI] Instrucciones clave" },
    ],
  };

  await emitRealtimeEvent(`projects.${projectId}.ai`, {
    type: "captions_generated",
    data: captions,
  });

  return captions;
}

export async function generateEditSuggestions(projectId: string, fileId: string, context: Record<string, unknown>) {
  const suggestion: AISuggestion = {
    id: randomUUID(),
    projectId,
    fileId,
    type: "edit",
    title: "AI: Ajustar ritmo",
    summary: "Recorta silencio y a?ade B-roll contextual",
    createdAt: new Date().toISOString(),
    payload: {
      context,
      ranges: [
        {
          start: 45,
          end: 52,
          action: "trim",
          note: "Silencio detectado",
        },
      ],
    },
  };

  await emitRealtimeEvent(`projects.${projectId}.ai`, {
    type: "edit_suggestions_generated",
    data: suggestion,
  });

  return suggestion;
}
