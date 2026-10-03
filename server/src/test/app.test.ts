import { describe, expect, it } from "vitest";
import { buildApp } from "../app";
import { generateHub3Payload } from "../modules/payments/hub3";

describe("PeptideLab Fastify Server", () => {
  it("GET /health vraća status ok i service naziv", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("PeptideLab API");
    expect(body).toHaveProperty("database");
    expect(body).toHaveProperty("uptime");
  });

  it("POST /api/v1/inquiries odbija neispravne podatke sa Zod greškom", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/inquiries",
      payload: {
        name: "A", // prekratko ime
        email: "neispravan-email",
        message: "kratko",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details.length).toBeGreaterThan(0);
  });

  it("POST /api/v1/orders odbija narudžbu ako RUO izjava nije prihvaćena", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/orders",
      payload: {
        items: [{ productId: 1, quantity: 1 }],
        customerEmail: "ivan@lab.hr",
        shippingAddress: {
          recipientName: "Dr. Ivan",
          streetAddress: "Ilica 10",
          city: "Zagreb",
          postalCode: "10000",
          country: "HR",
          phoneNumber: "+385912345678",
        },
        paymentMethod: "cod",
        ruoDeclarationAccepted: false, // ne smije proći
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    type Detail = { field: string; message: string };
    const ruoError = (body.error.details as Detail[]).find((d) =>
      d.field.includes("ruoDeclarationAccepted"),
    );
    expect(ruoError).toBeDefined();
  });

  it("POST /api/v1/orders odbija narudžbu s praznom košaricom", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/orders",
      payload: {
        items: [],
        customerEmail: "ivan@lab.hr",
        shippingAddress: {
          recipientName: "Dr. Ivan",
          streetAddress: "Ilica 10",
          city: "Zagreb",
          postalCode: "10000",
          country: "HR",
          phoneNumber: "+385912345678",
        },
        paymentMethod: "cod",
        ruoDeclarationAccepted: true,
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    type Detail = { field: string; message: string };
    const itemsError = (body.error.details as Detail[]).find((d) =>
      d.field.includes("items"),
    );
    expect(itemsError).toBeDefined();
  });

  it("HUB3 generator točno formatira podatke za virman/uplatnicu", () => {
    const payload = generateHub3Payload({
      orderNumber: "ORD-2026-123456",
      amount: 49.9,
      customerName: "Dr. Ivan Horvat",
      customerStreet: "Ilica 100",
      customerCity: "Zagreb",
    });

    expect(payload.amountFormatted).toBe("49.90 EUR");
    expect(payload.referenceNumber).toBe("ORD-2026-123456");
    expect(payload.formattedBarcodePayload).toContain("HRVHUB30");
    expect(payload.formattedBarcodePayload).toContain("EUR");
    expect(payload.formattedBarcodePayload).toContain("000000000004990"); // 49.90 EUR = 4990 centi
  });

  it("GET /api/v1/admin/orders odbija neautoriziran zahtjev bez admin ključa", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/admin/orders",
    });

    expect(response.statusCode).toBe(401);
    const body = response.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /api/v1/admin/orders odbija neispravan admin ključ sa statusom 403 Forbidden", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/admin/orders",
      headers: {
        "x-admin-key": "pogresna_lozinka_123",
      },
    });

    expect(response.statusCode).toBe(403);
    const body = response.json();
    expect(body.error.code).toBe("FORBIDDEN");
  });

  it("GET /api/v1/admin/orders sigurno rukuje višestrukim/nizom admin zaglavlja bez rušenja poslužitelja", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/admin/orders",
      headers: {
        // Višestruka zaglavlja se prenose kao niz stringova
        "x-admin-key": ["key1", "key2"] as unknown as string,
      },
    });

    expect(response.statusCode).toBe(403);
    const body = response.json();
    expect(body.error.code).toBe("FORBIDDEN");
  });

  it("Poslužitelj postavlja sigurnosna HTTP zaglavlja (Helmet)", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  it("POST /api/v1/orders odbija prekomjerno dugačke podatke (DoS zaštita)", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/orders",
      payload: {
        items: [{ productId: 1, quantity: 1 }],
        customerEmail: "ivan@lab.hr",
        shippingAddress: {
          recipientName: "A".repeat(250), // Prekoračuje limit od 200 znakova
          streetAddress: "Ilica 10",
          city: "Zagreb",
          postalCode: "10000",
          country: "HR",
          phoneNumber: "+385912345678",
        },
        paymentMethod: "cod",
        ruoDeclarationAccepted: true,
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
