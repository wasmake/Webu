export type ProjectState =
  | "cooking"
  | "ready_to_edit"
  | "ready_for_review"
  | "ready_to_publish"
  | "vault";

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  role: "owner" | "editor" | "reviewer" | "guest";
}

export interface ProjectMetadata {
  id: string;
  name: string;
  description?: string;
  status: ProjectState;
  owner: UserProfile;
  assignedEditor?: UserProfile;
  reviewers?: UserProfile[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export type FileKind = "video" | "audio" | "image" | "document";

export interface ProjectFile {
  id: string;
  projectId: string;
  kind: FileKind;
  name: string;
  description?: string;
  order: number;
  durationSeconds?: number;
  sizeInBytes?: number;
  s3Key: string;
  thumbnailUrl?: string;
  uploadedBy: UserProfile;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface TimestampedComment {
  id: string;
  projectId: string;
  fileId: string;
  parentId?: string;
  timestampSeconds: number;
  body: string;
  author: UserProfile;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  replies?: TimestampedComment[];
}

export interface ActivityItem {
  id: string;
  projectId: string;
  type:
    | "file_uploaded"
    | "comment_added"
    | "comment_resolved"
    | "status_changed"
    | "ai_generated"
    | "editor_joined"
    | "asset_reordered";
  message: string;
  actor: UserProfile;
  createdAt: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface CaptionBlock {
  id: string;
  start: number;
  end: number;
  text: string;
}

export type AISuggestionType = "transcript" | "caption" | "edit" | "distribution";

export interface AISuggestion {
  id: string;
  projectId: string;
  fileId?: string;
  type: AISuggestionType;
  title: string;
  summary?: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

export interface WhiteboardElement {
  id: string;
  type: "shape" | "text" | "connector";
  content: string;
  position: { x: number; y: number };
  color?: string;
  linkedTo?: {
    type: "project" | "file" | "timestamp";
    id: string;
    timestampSeconds?: number;
  };
}

export interface ProjectContextSnapshot {
  project: ProjectMetadata;
  files: ProjectFile[];
  comments: TimestampedComment[];
  activities: ActivityItem[];
  aiArtifacts: AISuggestion[];
  transcript: TranscriptSegment[];
  captions: CaptionBlock[];
  whiteboard: WhiteboardElement[];
}
