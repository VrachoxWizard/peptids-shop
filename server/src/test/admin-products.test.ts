import { describe, expect, it } from "vitest";
import { buildApp } from "../app";
import { env } from "../config/env";

describe("Admin Products API", () => {
  const adminKey = env.ADMIN_API_KEY || "dev_admin_secret_key_replace_in_prod";

  it("POST /api/v1/admin/products odbija zahtjev bez x-admin-key sa 401", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/admin/products",
      payload: {
        slug: "novi-peptid",
        nameHr: "Novi Peptid",
        category: "Peptidi",
        descriptionHr: "Opis novog peptida",
        amount: "10 mg",
        price: 50.0,
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("POST /api/v1/admin/products odbija neispravne podatke sa 400 VALIDATION_ERROR", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/admin/products",
      headers: {
        "x-admin-key": adminKey,
      },
      payload: {
        slug: "NEISPRAVAN_SLUG_SA_VELIKIM_SLOVIMA!",
        nameHr: "", // prazno ime
        category: "Peptidi",
        descriptionHr: "Opis",
        amount: "10 mg",
        price: -20, // negativna cijena
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
