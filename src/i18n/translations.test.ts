import { describe, it, expect } from "vitest";
import { translations } from "./translations";

describe("Croatian Trust Translations", () => {
  it("should contain trustBar translations for HR and EN", () => {
    expect(translations.hr.trustBar).toBeDefined();
    expect(translations.hr.trustBar.shipping).toContain("24–48h");
    expect(translations.hr.trustBar.payment).toContain("pouzećem");
    expect(translations.en.trustBar).toBeDefined();
  });

  it("should contain croatiaTrust cards data in HR and EN", () => {
    expect(translations.hr.croatiaTrust).toBeDefined();
    expect(translations.hr.croatiaTrust.title).toBeDefined();
    expect(translations.hr.croatiaTrust.codTitle).toContain("Pouzećem");
    expect(translations.hr.croatiaTrust.deliveryTitle).toContain("24–48h");
    expect(translations.hr.croatiaTrust.discreteTitle).toContain("Diskretno");
    expect(translations.hr.croatiaTrust.supportTitle).toContain("Zagreb");

    expect(translations.en.croatiaTrust).toBeDefined();
    expect(translations.en.croatiaTrust.title).toBeDefined();
  });

  it("should contain payment method options in HR and EN", () => {
    expect(translations.hr.payments).toBeDefined();
    expect(translations.hr.payments.cod).toBeDefined();
    expect(translations.hr.payments.keks).toBeDefined();
    expect(translations.en.payments).toBeDefined();
  });
});
