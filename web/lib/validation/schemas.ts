import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["owner", "editor", "reviewer", "guest"]),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(["cooking", "ready_to_edit", "ready_for_review", "ready_to_publish", "vault"]),
  owner: userProfileSchema,
  assignedEditor: userProfileSchema.optional(),
  reviewers: z.array(userProfileSchema).optional(),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
});

export const fileSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  kind: z.enum(["video", "audio", "image", "document"]),
  name: z.string(),
  description: z.string().optional(),
  order: z.number().int(),
  durationSeconds: z.number().optional(),
  sizeInBytes: z.number().optional(),
  s3Key: z.string(),
  thumbnailUrl: z.string().url().optional(),
  uploadedBy: userProfileSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
});

export const commentSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  fileId: z.string(),
  parentId: z.string().optional(),
  timestampSeconds: z.number().nonnegative(),
  body: z.string().min(1),
  author: userProfileSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  resolvedAt: z.string().datetime().optional(),
});

export const aiRequestSchema = z.object({
  projectId: z.string(),
  fileId: z.string(),
  platform: z.string().optional(),
});

export const fileUploadPayloadSchema = z.object({
  file: fileSchema,
  contentType: z.string().optional(),
  generateUploadUrl: z.boolean().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type FileInput = z.infer<typeof fileSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
