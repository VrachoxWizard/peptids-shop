import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchProducts, fetchProductBySlug } from "./catalogApi";
import { products } from "../data/products";

describe("catalogApi service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches products from API when network succeeds", async () => {
    const mockApiResponse = {
      data: [
        {
          id: 101,
          slug: "test-peptide",
          name: "Test Peptid",
          category: "Peptidi",
          description: "Opis testnog peptida",
          amount: "10 mg",
          price: 55.0,
          imageUrl: "/test.jpg",
          featured: true,
          purity: "≥99.0%",
          casNumber: "123-45-6",
          molecularWeight: "1000 g/mol",
          inStock: true,
        },
      ],
      pagination: {
        totalItems: 1,
        totalPages: 1,
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      }),
    );

    const result = await fetchProducts({ category: "Peptidi" }, "hr");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("Test Peptid");
    expect(result.items[0].image).toBe("/test.jpg");
    expect(result.total).toBe(1);
  });

  it("falls back to local data when network fetch throws a TypeError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    const result = await fetchProducts();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].slug).toBe(products[0].slug);
    expect(result.total).toBe(products.length);
  });

  it("fetches single product by slug from API", async () => {
    const mockProduct = {
      id: 1,
      slug: "bpc-157-arginate",
      name: "BPC-157 Arginatna sol",
      category: "Peptidi",
      description: "Opis",
      amount: "10 mg",
      price: 49.9,
      imageUrl: "/bpc.jpg",
      currentBatch: {
        batchNumber: "BPC-2026-01",
        purityPercentage: "99.40",
        inStock: true,
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockProduct }),
      }),
    );

    const result = await fetchProductBySlug("bpc-157-arginate");
    expect(result).not.toBeNull();
    expect(result?.slug).toBe("bpc-157-arginate");
    expect(result?.image).toBe("/bpc.jpg");
  });

  it("falls back to local product by slug when network fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    const result = await fetchProductBySlug(products[0].slug);
    expect(result).not.toBeNull();
    expect(result?.slug).toBe(products[0].slug);
    expect(result?.name).toBe(products[0].name);
  });

  it("returns null when product slug is not found locally on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    const result = await fetchProductBySlug("non-existent-slug");
    expect(result).toBeNull();
  });
});
