import { describe, expect, it } from "vitest";
import { buildApp } from "../app";
import { env } from "../config/env";

describe("Admin Batches & Stock API", () => {
  const adminKey = env.ADMIN_API_KEY || "dev_admin_secret_key_replace_in_prod";

  it("POST /api/v1/admin/batches odbija zahtjev bez admin ključa sa 401", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/admin/batches",
      payload: {
        productId: 1,
        batchNumber: "BPC-2026-TEST",
        stockQuantity: 50,
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("POST /api/v1/admin/batches odbija neispravne podatke sa 400 VALIDATION_ERROR", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/admin/batches",
      headers: {
        "x-admin-key": adminKey,
      },
      payload: {
        productId: -1, // neispravan id
        batchNumber: "", // prazan batch
        stockQuantity: -10, // negativna zaliha
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("PATCH /api/v1/admin/batches/:id/stock odbija negativnu zalihu", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "PATCH",
      url: "/api/v1/admin/batches/1/stock",
      headers: {
        "x-admin-key": adminKey,
      },
      payload: {
        stockQuantity: -5,
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
