import { ObjectId } from "mongodb";

import { getMongoDb } from "@/lib/db/mongodb";
import { emitRealtimeEvent } from "@/lib/realtime/events";
import type { ActivityItem, ProjectFile, ProjectMetadata, TimestampedComment } from "@/lib/types";

const PROJECTS_COLLECTION = "projects";
const FILES_COLLECTION = "files";
const COMMENTS_COLLECTION = "comments";
const ACTIVITIES_COLLECTION = "activities";

async function withCollection<T>(collection: string, callback: (collection: any) => Promise<T>) {
  const db = await getMongoDb();
  const handler = db.collection(collection);
  return callback(handler);
}

export async function createProject(project: ProjectMetadata) {
  return withCollection(PROJECTS_COLLECTION, async (collection) => {
    await collection.insertOne({ ...project, _id: new ObjectId(project.id) });
    await emitRealtimeEvent(`projects.${project.id}`, { type: "project_created", data: project });
    return project;
  });
}

export async function listProjectsForUser(userId: string) {
  return withCollection<ProjectMetadata[]>(PROJECTS_COLLECTION, async (collection) =>
    collection
      .find({ "owner.id": userId })
      .sort({ updatedAt: -1 })
      .toArray(),
  );
}

export async function createFile(file: ProjectFile) {
  return withCollection<ProjectFile>(FILES_COLLECTION, async (collection) => {
    await collection.insertOne({ ...file, _id: new ObjectId(file.id) });
    await emitRealtimeEvent(`projects.${file.projectId}.files`, {
      type: "file_created",
      data: file,
    });
    return file;
  });
}

export async function addComment(comment: TimestampedComment) {
  return withCollection<TimestampedComment>(COMMENTS_COLLECTION, async (collection) => {
    await collection.insertOne({ ...comment, _id: new ObjectId(comment.id) });
    await emitRealtimeEvent(`projects.${comment.projectId}.comments`, {
      type: "comment_created",
      data: comment,
    });
    return comment;
  });
}

export async function logActivity(activity: ActivityItem) {
  return withCollection<ActivityItem>(ACTIVITIES_COLLECTION, async (collection) => {
    await collection.insertOne({ ...activity, _id: new ObjectId(activity.id) });
    await emitRealtimeEvent(`projects.${activity.projectId}.activity`, {
      type: "activity_created",
      data: activity,
    });
    return activity;
  });
}

export async function fetchActivity(projectId: string) {
  return withCollection<ActivityItem[]>(ACTIVITIES_COLLECTION, async (collection) =>
    collection
      .find({ projectId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray(),
  );
}
