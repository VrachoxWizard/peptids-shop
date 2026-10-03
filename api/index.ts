import type { IncomingMessage, ServerResponse } from "node:http";
import { buildApp } from "../server/src/app";

// Sprječava Vercel da unaprijed konzumira stream zahtjeva kako bi Fastify mogao sam parsirati body
export const config = {
  api: {
    bodyParser: false,
  },
};

type AppInstance = ReturnType<typeof buildApp>;
let app: AppInstance | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!app) {
    app = buildApp();
    await app.ready();
  }

  app.server.emit("request", req, res);
}
