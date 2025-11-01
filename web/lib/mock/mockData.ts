import type {
  ActivityItem,
  AISuggestion,
  CaptionBlock,
  ProjectFile,
  ProjectMetadata,
  ProjectState,
  TimestampedComment,
  TranscriptSegment,
  WhiteboardElement,
} from "@/lib/types";

const baseUsers = {
  owner: {
    id: "user_owner",
    name: "Valeria Ortiz",
    avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
    role: "owner",
  },
  editor: {
    id: "user_editor",
    name: "Mateo Rivas",
    avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
    role: "editor",
  },
  reviewer: {
    id: "user_reviewer",
    name: "Laura Vega",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    role: "reviewer",
  },
};

export const mockProjects: ProjectMetadata[] = [
  {
    id: "project_1",
    name: "Serie YouTube - Recetas express",
    description: "Batch de 5 videos cortos para YouTube y TikTok sobre recetas r?pidas.",
    status: "ready_for_review",
    owner: baseUsers.owner,
    assignedEditor: baseUsers.editor,
    reviewers: [baseUsers.reviewer],
    dueDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["cocina", "recetas", "yt"],
  },
  {
    id: "project_2",
    name: "Documental Behind The Scenes",
    description: "Material crudo para documental de campa?a temporada 2.",
    status: "ready_to_edit",
    owner: baseUsers.owner,
    assignedEditor: baseUsers.editor,
    reviewers: [baseUsers.reviewer],
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    tags: ["documental", "bts"],
  },
  {
    id: "project_3",
    name: "Campa?a IG Reels Abril",
    description: "Reels para brand awareness centrados en storytelling.",
    status: "cooking" as ProjectState,
    owner: baseUsers.owner,
    assignedEditor: baseUsers.editor,
    reviewers: [],
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    tags: ["reels", "brand"],
  },
];

export const mockFiles: ProjectFile[] = [
  {
    id: "file_1",
    projectId: "project_1",
    kind: "video",
    name: "Receta - Tacos de birria.mp4",
    description: "Corte final con B-roll total",
    order: 1,
    durationSeconds: 185,
    sizeInBytes: 785_000_000,
    s3Key: "project_1/video/tacos-birria.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    uploadedBy: baseUsers.owner,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    tags: ["principal", "b-roll"],
  },
  {
    id: "file_2",
    projectId: "project_1",
    kind: "video",
    name: "Receta - Pasta cremosa.mp4",
    description: "Versi?n c?mara cenital",
    order: 2,
    durationSeconds: 210,
    sizeInBytes: 655_000_000,
    s3Key: "project_1/video/pasta-cremosa.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    uploadedBy: baseUsers.owner,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    tags: ["versi?n 2"],
  },
  {
    id: "file_3",
    projectId: "project_1",
    kind: "audio",
    name: "VoiceOver - pauta.mp3",
    description: "Lectura AI en espa?ol neutro",
    order: 3,
    durationSeconds: 120,
    sizeInBytes: 15_000_000,
    s3Key: "project_1/audio/vo-pauta.mp3",
    uploadedBy: baseUsers.editor,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    tags: ["voz", "ai"],
  },
  {
    id: "file_4",
    projectId: "project_1",
    kind: "image",
    name: "Moodboard capa final.png",
    description: "Referencias de color",
    order: 4,
    s3Key: "project_1/image/moodboard.png",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    uploadedBy: baseUsers.owner,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    tags: ["referencia"],
  },
];

export const mockComments: TimestampedComment[] = [
  {
    id: "comment_1",
    projectId: "project_1",
    fileId: "file_1",
    timestampSeconds: 13,
    body: "Agregar close-up del queso derriti?ndose para subir el apetito visual.",
    author: baseUsers.owner,
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    replies: [
      {
        id: "comment_1_reply_1",
        projectId: "project_1",
        fileId: "file_1",
        parentId: "comment_1",
        timestampSeconds: 13,
        body: "Tengo un clip B-roll que puede funcionar, lo subo en un momento.",
        author: baseUsers.editor,
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
  },
  {
    id: "comment_2",
    projectId: "project_1",
    fileId: "file_1",
    timestampSeconds: 165,
    body: "Eliminar silencio entre los clips de la canela.",
    author: baseUsers.reviewer,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    resolvedAt: undefined,
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: "activity_1",
    projectId: "project_1",
    type: "file_uploaded",
    message: "Valeria subi? Receta - Tacos de birria.mp4",
    actor: baseUsers.owner,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    entityId: "file_1",
  },
  {
    id: "activity_2",
    projectId: "project_1",
    type: "comment_added",
    message: "Laura dej? feedback en 02:45",
    actor: baseUsers.reviewer,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    entityId: "comment_2",
  },
  {
    id: "activity_3",
    projectId: "project_1",
    type: "ai_generated",
    message: "AI gener? caption para IG",
    actor: {
      id: "system_ai",
      name: "AI Bot",
      role: "guest",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata: { action: "caption" },
  },
];

export const mockTranscript: TranscriptSegment[] = [
  {
    id: "segment_1",
    start: 0,
    end: 10,
    text: "Hola, hoy vamos a preparar unos tacos de birria express.",
    speaker: "Valeria",
  },
  {
    id: "segment_2",
    start: 10,
    end: 25,
    text: "Arrancamos con la tortilla y rellenamos con la carne jugosa.",
  },
  {
    id: "segment_3",
    start: 25,
    end: 40,
    text: "Tip: mezcla el queso Oaxaca con mozzarella para el stretch perfecto.",
  },
];

export const mockCaptions: CaptionBlock[] = [
  {
    id: "caption_1",
    start: 0,
    end: 4,
    text: "Tacos birria express",
  },
  {
    id: "caption_2",
    start: 4,
    end: 8,
    text: "Carne jugosa + queso derretido",
  },
  {
    id: "caption_3",
    start: 8,
    end: 12,
    text: "Listos en 20 minutos",
  },
];

export const mockAISuggestions: AISuggestion[] = [
  {
    id: "ai_1",
    projectId: "project_1",
    fileId: "file_1",
    type: "edit",
    title: "Cortar silencio 02:13 - 02:20",
    summary: "Reducir pausa para mantener el ritmo.",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    payload: {
      ranges: [
        {
          start: 133,
          end: 140,
          action: "cut",
        },
      ],
    },
  },
  {
    id: "ai_2",
    projectId: "project_1",
    type: "distribution",
    title: "Caption sugerido IG",
    summary: "Estira el queso y enamora: tacos birria listos en 20 minutos. ?Team salsa roja o verde?",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    payload: {
      hashtags: ["#foodie", "#recetas", "#tacotuesday"],
      tone: "entusiasta",
    },
  },
];

export const mockWhiteboard: WhiteboardElement[] = [
  {
    id: "wb_1",
    type: "shape",
    content: "Intro con hook visual",
    position: { x: 40, y: 28 },
    color: "#6366f1",
    linkedTo: { type: "timestamp", id: "file_1", timestampSeconds: 5 },
  },
  {
    id: "wb_2",
    type: "text",
    content: "Reforzar CTA final",
    position: { x: 120, y: 110 },
    color: "#0ea5e9",
    linkedTo: { type: "project", id: "project_1" },
  },
];
