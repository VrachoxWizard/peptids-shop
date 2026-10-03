import { describe, expect, it } from "vitest";
import { buildApp } from "../app";
import { env } from "../config/env";

describe("Admin Inquiries API", () => {
  const adminKey = env.ADMIN_API_KEY || "dev_admin_secret_key_replace_in_prod";

  it("GET /api/v1/admin/inquiries odbija zahtjev bez admin ključa sa 401", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/admin/inquiries",
    });

    expect(response.statusCode).toBe(401);
  });

  it("PATCH /api/v1/admin/inquiries/:id/status odbija neautorizirani pristup sa 401", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/admin/inquiries/1/status",
      payload: {
        status: "IN_PROGRESS",
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("PATCH /api/v1/admin/inquiries/:id/status odbija neispravan status sa 400 VALIDATION_ERROR", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/admin/inquiries/1/status",
      headers: {
        "x-admin-key": adminKey,
      },
      payload: {
        status: "INVALID_STATUS",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
