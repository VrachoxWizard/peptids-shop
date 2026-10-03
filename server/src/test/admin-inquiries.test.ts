import { describe, expect, it, vi } from "vitest";
import { buildApp } from "../app";
import { env } from "../config/env";
import { adminService } from "../modules/admin/admin.service";

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

  it("GET /api/v1/admin/inquiries podržava limit i offset paginaciju", async () => {
    const listSpy = vi.spyOn(adminService, "listInquiries").mockResolvedValueOnce({
      inquiries: [],
      total: 0,
    });
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/admin/inquiries?limit=10&offset=0",
      headers: {
        "x-admin-key": adminKey,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("pagination");
    expect(body.pagination.limit).toBe(10);
    expect(body.pagination.offset).toBe(0);
    expect(Array.isArray(body.data)).toBe(true);
    expect(listSpy).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    listSpy.mockRestore();
  });
});
