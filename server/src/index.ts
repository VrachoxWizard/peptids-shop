import { buildApp } from "./app";
import { env } from "./config/env";
import { pool } from "./db";

async function startServer() {
  const app = buildApp();

  try {
    const address = await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`🚀 PeptideLab API Server pokrenut na: ${address}`);
    app.log.info(`📡 Health check dostupan na: ${address}/health`);
    app.log.info(`📦 API rute montirane pod: ${address}/api/v1`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Zaprimljen ${signal}, gašenje poslužitelja...`);
      await app.close();
      await pool.end();
      app.log.info("Poslužitelj i baza uspješno ugašeni.");
      process.exit(0);
    });
  }
}

startServer();
