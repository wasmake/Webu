"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  mockActivities,
  mockAISuggestions,
  mockCaptions,
  mockComments,
  mockFiles,
  mockProjects,
  mockTranscript,
  mockWhiteboard,
} from "@/lib/mock/mockData";
import type {
  ActivityItem,
  AISuggestion,
  CaptionBlock,
  ProjectFile,
  ProjectMetadata,
  TimestampedComment,
  TranscriptSegment,
  WhiteboardElement,
} from "@/lib/types";

type OrderView = "project" | "personal_asc" | "personal_desc";

export interface ProjectStoreState {
  projects: ProjectMetadata[];
  files: ProjectFile[];
  comments: TimestampedComment[];
  activities: ActivityItem[];
  aiSuggestions: AISuggestion[];
  transcript: TranscriptSegment[];
  captions: CaptionBlock[];
  whiteboard: WhiteboardElement[];
  selectedProjectId: string;
  selectedFileId?: string;
  orderView: OrderView;
  projectOrderOverrides: Record<string, string[]>; // projectId -> array of fileIds for personal view

  // actions
  setSelectedProject: (projectId: string) => void;
  setSelectedFile: (fileId?: string) => void;
  setOrderView: (view: OrderView) => void;
  reorderPersonalView: (projectId: string, fileIds: string[]) => void;
  appendComment: (comment: TimestampedComment) => void;
  resolveComment: (commentId: string, resolvedAt: string) => void;
  upsertActivity: (activity: ActivityItem) => void;
  updateAISuggestion: (suggestion: AISuggestion) => void;
  setTranscript: (segments: TranscriptSegment[]) => void;
  setCaptions: (entries: CaptionBlock[]) => void;
}

const defaultProjectId = mockProjects[0]?.id ?? "";
const defaultFileId = mockFiles.find((file) => file.projectId === defaultProjectId)?.id;

export const useProjectStore = create<ProjectStoreState>()(
  devtools((set) => ({
    projects: mockProjects,
    files: mockFiles,
    comments: mockComments,
    activities: mockActivities,
    aiSuggestions: mockAISuggestions,
    transcript: mockTranscript,
    captions: mockCaptions,
    whiteboard: mockWhiteboard,
    selectedProjectId: defaultProjectId,
    selectedFileId: defaultFileId,
    orderView: "project",
    projectOrderOverrides: {},

    setSelectedProject: (projectId) =>
      set((state) => ({
        selectedProjectId: projectId,
        selectedFileId:
          state.files.find((file) => file.projectId === projectId)?.id ?? undefined,
      })),
    setSelectedFile: (fileId) =>
      set(() => ({
        selectedFileId: fileId,
      })),
    setOrderView: (view) =>
      set(() => ({
        orderView: view,
      })),
    reorderPersonalView: (projectId, fileIds) =>
      set((state) => ({
        projectOrderOverrides: {
          ...state.projectOrderOverrides,
          [projectId]: fileIds,
        },
      })),
    appendComment: (comment) =>
      set((state) => ({
        comments: [...state.comments, comment],
      })),
    resolveComment: (commentId, resolvedAt) =>
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentId ? { ...comment, resolvedAt } : comment,
        ),
      })),
    upsertActivity: (activity) =>
      set((state) => {
        const existingIndex = state.activities.findIndex((item) => item.id === activity.id);
        if (existingIndex === -1) {
          return { activities: [activity, ...state.activities] };
        }
        const updated = [...state.activities];
        updated[existingIndex] = activity;
        return { activities: updated };
      }),
    updateAISuggestion: (suggestion) =>
      set((state) => {
        const exists = state.aiSuggestions.some((ai) => ai.id === suggestion.id);
        return {
          aiSuggestions: exists
            ? state.aiSuggestions.map((ai) => (ai.id === suggestion.id ? suggestion : ai))
            : [suggestion, ...state.aiSuggestions],
        };
      }),
    setTranscript: (segments) =>
      set(() => ({
        transcript: segments,
      })),
    setCaptions: (entries) =>
      set(() => ({
        captions: entries,
      })),
  }))
);

export function selectCurrentProject(state: ProjectStoreState) {
  return state.projects.find((project) => project.id === state.selectedProjectId);
}

export function selectFilesForCurrentProject(state: ProjectStoreState) {
  const projectFiles = state.files.filter((file) => file.projectId === state.selectedProjectId);
  if (state.orderView === "project") {
    return [...projectFiles].sort((a, b) => a.order - b.order);
  }

  const override = state.projectOrderOverrides[state.selectedProjectId];
  if (override && override.length) {
    const fileMap = new Map(projectFiles.map((file) => [file.id, file] as const));
    return override
      .map((fileId) => fileMap.get(fileId))
      .filter((file): file is ProjectFile => Boolean(file));
  }

  if (state.orderView === "personal_asc") {
    return [...projectFiles].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  }

  return [...projectFiles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function selectCommentsForFile(state: ProjectStoreState, fileId?: string) {
  if (!fileId) return [];
  return state.comments.filter((comment) => comment.fileId === fileId && !comment.parentId);
}

export function selectTranscript(state: ProjectStoreState) {
  return state.transcript;
}

export function selectCaptions(state: ProjectStoreState) {
  return state.captions;
}

export function selectAISuggestions(state: ProjectStoreState) {
  return state.aiSuggestions.filter((suggestion) => suggestion.projectId === state.selectedProjectId);
}

export function selectActivities(state: ProjectStoreState) {
  return state.activities.filter((item) => item.projectId === state.selectedProjectId);
}

export function selectWhiteboard(state: ProjectStoreState) {
  return state.whiteboard;
}
