import { describe, it, expect } from "vitest";
import { translations } from "./translations";

describe("Translations Completeness & Consistency", () => {
  it("should contain trustBar translations for HR and EN", () => {
    expect(translations.hr.trustBar).toBeDefined();
    expect(translations.hr.trustBar.shipping).toContain("24–48h");
    expect(translations.hr.trustBar.payment).toContain("pouzećem");
    expect(translations.en.trustBar).toBeDefined();
  });

  it("should contain croatiaTrust cards and tags in HR and EN", () => {
    expect(translations.hr.croatiaTrust).toBeDefined();
    expect(translations.hr.croatiaTrust.title).toBeDefined();
    expect(translations.hr.croatiaTrust.tagNoRisk).toBe("Bez rizika");
    expect(translations.hr.croatiaTrust.tagEuWarehouse).toBe("EU skladište");
    expect(translations.hr.croatiaTrust.tagThermo).toBe("Termo-zaštita");
    expect(translations.hr.croatiaTrust.tagSupport).toBe("Radni dan 9–17h");

    expect(translations.en.croatiaTrust).toBeDefined();
    expect(translations.en.croatiaTrust.tagNoRisk).toBe("Zero Risk");
    expect(translations.en.croatiaTrust.tagEuWarehouse).toBe("EU Warehouse");
    expect(translations.en.croatiaTrust.tagThermo).toBe("Thermal Protection");
    expect(translations.en.croatiaTrust.tagSupport).toBe("Weekdays 9–17h");
  });

  it("should contain unified 70 € free shipping threshold message", () => {
    expect(translations.hr.cart.freeShippingReached).toContain("70 €");
    expect(translations.hr.cart.freeShippingReached).not.toContain("100 €");
    expect(translations.en.cart.freeShippingReached).toContain("70 €");
    expect(translations.en.cart.freeShippingReached).not.toContain("100 €");
  });

  it("should contain product reassurance & feedback in HR and EN", () => {
    expect(translations.hr.product.stockReassurance).toContain("24–48h");
    expect(translations.en.product.stockReassurance).toBeDefined();
    expect(translations.hr.product.addedInline).toBe("Dodano");
    expect(translations.en.product.addedInline).toBe("Added");
    expect(translations.hr.product.addedToast).toBe("Dodano u košaricu!");
    expect(translations.en.product.addedToast).toBe("Added to cart!");
  });

  it("should contain regulatory RUO disclaimer and footer labels in HR and EN", () => {
    expect(translations.hr.footer.regulatoryTitle).toBeDefined();
    expect(translations.hr.footer.regulatoryBody).toBeDefined();
    expect(translations.en.footer.regulatoryTitle).toBeDefined();
    expect(translations.en.footer.regulatoryBody).toBeDefined();
  });

  it("should contain payment method options in HR and EN", () => {
    expect(translations.hr.payments).toBeDefined();
    expect(translations.hr.payments.cod).toBeDefined();
    expect(translations.hr.payments.keks).toBeDefined();
    expect(translations.en.payments).toBeDefined();
  });
});
