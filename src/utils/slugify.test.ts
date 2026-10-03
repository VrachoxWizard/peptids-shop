import { describe, expect, it } from "vitest";
import { slugifyHr } from "./slugify";

describe("slugifyHr utility", () => {
  it("pretvara hrvatska slova č, ć, đ, š, ž u engleske ekvivalente", () => {
    expect(slugifyHr("Čistoća Šumskog Života i Đurđica")).toBe("cistoca-sumskog-zivota-i-djurdjica");
  });

  it("uklanja specijalne znakove i višestruke crtice", () => {
    expect(slugifyHr("Peptid BPC-157 (10 mg) -- HPLC! ≥99%")).toBe("peptid-bpc-157-10-mg-hplc-99");
  });

  it("ispravno reže vodeće i prateće crtice", () => {
    expect(slugifyHr("  ---TB-500 test---  ")).toBe("tb-500-test");
  });
});
