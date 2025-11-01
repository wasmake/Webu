import { Client, Realtime } from "appwrite";

let browserClient: Client | null = null;

export function getAppwriteBrowserClient() {
  if (browserClient) return browserClient;
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  if (!endpoint || !project) {
    console.warn("Appwrite: configuraci?n incompleta para el cliente p?blico");
    return null;
  }

  browserClient = new Client().setEndpoint(endpoint).setProject(project);
  return browserClient;
}

export function getRealtimeInstance() {
  const client = getAppwriteBrowserClient();
  if (!client) return null;
  return new Realtime(client);
}

export function subscribeToChannel(channel: string, callback: (payload: unknown) => void) {
  const realtime = getRealtimeInstance();
  if (!realtime) {
    console.warn("Appwrite: no se pudo suscribir, cliente no inicializado");
    return () => void 0;
  }

  const unsubscribe = realtime.subscribe(channel, (response) => {
    callback(response.payload);
  });

  return unsubscribe;
}
