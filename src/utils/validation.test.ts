import { describe, it, expect } from "vitest";
import { validateContactForm, isValidEmail, validateCheckoutForm } from "./validation";

describe("validation utils", () => {
  it("validates correct emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("dr.ivan@institut.hr")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("validates complete and valid contact form data", () => {
    const validData = {
      name: "Dr. Ivan Horvat",
      email: "ivan@institut.hr",
      message: "Zanima me COA certifikat za seriju BPC-157.",
    };

    const messages = {
      valName: "Ime mora imati barem 2 znaka.",
      valEmail: "Unesite ispravnu email adresu.",
      valMessage: "Poruka mora imati barem 10 znakova.",
    };

    const result = validateContactForm(validData, messages);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("detects validation errors for short name, invalid email, and short message", () => {
    const invalidData = {
      name: "A",
      email: "not-an-email",
      message: "Kratko",
    };

    const messages = {
      valName: "Ime prekratko",
      valEmail: "Email nevalja",
      valMessage: "Poruka prekratka",
    };

    const result = validateContactForm(invalidData, messages);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe("Ime prekratko");
    expect(result.errors.email).toBe("Email nevalja");
    expect(result.errors.message).toBe("Poruka prekratka");
  });

  it("validates checkout form correctly and checks RUO acceptance", () => {
    const validCheckout = {
      recipientName: "Dr. Marko",
      customerEmail: "marko@lab.hr",
      phoneNumber: "+385912345678",
      streetAddress: "Ilica 10",
      city: "Zagreb",
      postalCode: "10000",
      country: "HR",
      needR1: false,
      companyName: "",
      companyOib: "",
      deliveryInstructions: "",
      ruoAccepted: true,
    };

    const validResult = validateCheckoutForm(validCheckout, "hr");
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toEqual({});

    const invalidResult = validateCheckoutForm(
      { ...validCheckout, ruoAccepted: false, customerEmail: "bad" },
      "hr",
    );
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.ruoAccepted).toBeDefined();
    expect(invalidResult.errors.customerEmail).toBeDefined();
  });
});
