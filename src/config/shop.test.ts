import { describe, it, expect } from "vitest";
import { SHOP_CONFIG, calculateShipping } from "./shop";

describe("SHOP_CONFIG", () => {
  it("defines standard business constants", () => {
    expect(SHOP_CONFIG.FREE_SHIPPING_THRESHOLD).toBe(70);
    expect(SHOP_CONFIG.SHIPPING_FEE).toBe(4.9);
    expect(SHOP_CONFIG.PRODUCTS_PER_PAGE).toBe(6);
  });

  it("calculates free shipping when subtotal is >= threshold", () => {
    expect(calculateShipping(70)).toBe(0);
    expect(calculateShipping(100)).toBe(0);
  });

  it("calculates standard shipping fee when subtotal is below threshold", () => {
    expect(calculateShipping(69.9)).toBe(4.9);
    expect(calculateShipping(0)).toBe(4.9);
  });
});
