# Kitchen Collab ? Plataforma asincrona para equipos de video

Kitchen Collab es un andamiaje listo para produccion que combina lo mejor de Dropbox (gestion de archivos), Notion (contexto y documentacion) y Figma (feedback en timeline) para equipos de creacion y edicion de video. Construido con Next.js 15 + Vite, Tailwind/shadcn, Appwrite (solo auth + realtime), MongoDB como fuente de verdad y almacenamiento de medios en Storj (S3-compatible).

## Arquitectura

- **Frontend**: Next.js 15 (React 19, App Router) con modo experimental de Vite (`next dev --experimental-vite`). UI con TailwindCSS, shadcn/ui, animaciones via Framer Motion, estado global con Zustand y drag & drop con DnD Kit.
- **Backend**: API Routes en `app/api/*` con validaciones Zod. Capa de servicios en `lib/services` que abstrae MongoDB (driver oficial), Storj (AWS SDK) y Appwrite Realtime.
- **Auth & Realtime**: Appwrite se usa unicamente para autenticacion y canales realtime (`lib/realtime`). MongoDB es la fuente de verdad de negocio.
- **Storage**: Presigned URLs hacia Storj desde `lib/storage/storjClient`. Solo se guarda metadata en Mongo.
- **AI**: Endpoints `/api/ai/*` como placeholders de transcript, captions y sugerencias de edicion; alimentan el store y emiten eventos.
- **Dominio**: Modelo estrictamente centrado en proyectos. Los archivos dependen de un `projectId` y se respeta un orden maestro (owner) y vistas personales (asc/desc) para editores.

## Estructura relevante

```
web/
  app/
    (dashboard)/
      layout.tsx
      projects/
        page.tsx
        [projectId]/page.tsx
    api/
      projects/...
      ai/...
    globals.css
  components/
    Explorer.tsx
    VideoReview.tsx
    ContextPanel.tsx
    Sidebar.tsx
    ProjectHeader.tsx
    ProjectInitializer.tsx
    RichTextEditor.tsx
    WhiteboardCanvas.tsx
    ui/*
  lib/
    constants/
    db/
    mock/
    realtime/
    services/
    storage/
    store/
    utils/
    validation/
  tailwind.config.ts
  vite.config.ts
```

## Flujos clave

- **Panel 3-columnas**: `Sidebar` agrupa proyectos por estado (Cooking ? Vault). `Explorer` maneja archivos y orden maestro/personal con DnD Kit. `ContextPanel` centraliza transcript, captions, notas (TipTap) y whiteboard ligero. `VideoReview` combina player + comentarios timestamped al estilo Figma.
- **Orden maestro vs personal**: El owner define `ProjectFile.order` en Mongo. El editor puede reordenar localmente (vista personal) sin afectar el maestro; cada accion se registra en el activity log.
- **Comentarios temporizados**: `VideoReview` permite fijar feedback en un segundo especifico. Se persiste via `/api/projects/:id/comments` y se publica por Appwrite Realtime.
- **AI contextual**: Botones para generar transcript, captions sociales y sugerencias de edicion. Las respuestas actualizan el estado global (`useProjectStore`).
- **Whiteboard**: `WhiteboardCanvas` replica una pizarra ligera tipo tldraw para enlazar ideas con archivos o timestamps.

## Variables de entorno

Copiar `.env.example` dentro de `web/` y completar:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
APPWRITE_API_KEY=
MONGODB_URI=
MONGODB_DB_NAME=
STORJ_ACCESS_KEY_ID=
STORJ_SECRET_ACCESS_KEY=
STORJ_ENDPOINT=
STORJ_BUCKET=
OPENAI_API_KEY=
```

## Scripts utiles

```bash
cd web
npm install --legacy-peer-deps
npm run dev          # Next.js + Vite experimental
npm run dev:vite     # Sandbox de UI con Vite puro
npm run lint
npm run test
```

- `npm run dev` levanta Next 15 con Vite bajo el capot.
- `npm run dev:vite` sirve para prototipos rapidos de UI/estados.
- `npm run test` usa Vitest + Testing Library (`vitest.setup.ts`).

## Roadmap sugerido

1. Conectar Appwrite (auth/realtime) y reemplazar los placeholders en `lib/realtime` por funciones o webhooks reales.
2. Desplegar MongoDB Atlas con indices por coleccion (`projects`, `files`, `comments`, `activities`, `aiArtifacts`).
3. Completar flujo de subida directa a Storj (multipart/chunk) y versionado de archivos.
4. Integrar modelos de AI reales (OpenAI, Vertex o self-hosted) en los endpoints `/api/ai/*`.
5. Agregar pruebas E2E (Playwright) para los flujos criticos: crear proyecto, subir assets, dejar feedback, generar captions.
