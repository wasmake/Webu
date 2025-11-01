import { Client } from "appwrite";

let serverClient: Client | null = null;

export function getServerAppwriteClient() {
  if (serverClient) return serverClient;
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !project || !apiKey) {
    console.warn("Appwrite: falta endpoint, project o API key para el cliente server-side");
    return null;
  }

  serverClient = new Client().setEndpoint(endpoint).setProject(project).setKey(apiKey);
  return serverClient;
}

export async function emitRealtimeEvent(channel: string, payload: Record<string, unknown>) {
  const client = getServerAppwriteClient();
  if (!client) return;

  try {
    await client.call("post", "/v1/functions/execute", {
      channel,
      payload,
    });
  } catch (error) {
    console.error("Appwrite emit error", error);
  }
}
