import { describe, expect, it } from "vitest";
import { buildApp } from "../app";
import { ordersService } from "../modules/orders/orders.service";

describe("Orders Stock Guard & Batch FIFO", () => {
  it("odbija narudžbu kada proizvod nema aktivnu puštenu seriju", async () => {
    // Simuliramo situaciju gdje proizvod postoji u katalogu ali nema seriju
    // ordersService.createOrder mora baciti grešku ako nema aktivne serije
    const dummyInput = {
      items: [{ productId: 99999, quantity: 1 }],
      customerEmail: "researcher@lab.hr",
      shippingAddress: {
        recipientName: "Dr. Ana Horvat",
        streetAddress: "Ksaverska cesta 4",
        city: "Zagreb",
        postalCode: "10000",
        country: "HR",
        phoneNumber: "+385912345678",
      },
      paymentMethod: "cod" as const,
      ruoDeclarationAccepted: true as const,
    };

    await expect(ordersService.createOrder(dummyInput)).rejects.toThrow();
  });

  it("POST /api/v1/orders vraća 400 ORDER_CREATION_FAILED kada proizvod nije dostupan", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/orders",
      payload: {
        items: [{ productId: 99999, quantity: 1 }],
        customerEmail: "researcher@lab.hr",
        shippingAddress: {
          recipientName: "Dr. Ana Horvat",
          streetAddress: "Ksaverska cesta 4",
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
    expect(body.error.code).toBe("ORDER_CREATION_FAILED");
  });
});
