import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cartStore";
import type { Product } from "../types/product";

const mockProduct: Product = {
  id: 99,
  slug: "test-product",
  name: "Test Product",
  category: "Peptidi",
  description: "Test description",
  amount: "10 mg",
  price: 50,
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("safely handles NaN quantity without corrupting cart", () => {
    useCartStore.getState().addItem(mockProduct, NaN);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });

  it("safely handles negative and zero quantities by defaulting to 1", () => {
    useCartStore.getState().addItem(mockProduct, -5);
    expect(useCartStore.getState().items[0].quantity).toBe(1);

    useCartStore.getState().addItem(mockProduct, 0);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("floats are truncated to integers", () => {
    useCartStore.getState().addItem(mockProduct, 2.7);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("caps quantity at MAX_ITEM_QUANTITY (99) when increasing item", () => {
    useCartStore.getState().addItem(mockProduct, 98);
    expect(useCartStore.getState().items[0].quantity).toBe(98);

    useCartStore.getState().increaseItem(mockProduct.id);
    expect(useCartStore.getState().items[0].quantity).toBe(99);

    // Try increasing beyond 99
    useCartStore.getState().increaseItem(mockProduct.id);
    expect(useCartStore.getState().items[0].quantity).toBe(99);
  });

  it("caps quantity at MAX_ITEM_QUANTITY (99) when adding items", () => {
    useCartStore.getState().addItem(mockProduct, 150);
    expect(useCartStore.getState().items[0].quantity).toBe(99);

    useCartStore.getState().addItem(mockProduct, 10);
    expect(useCartStore.getState().items[0].quantity).toBe(99);
  });
});
