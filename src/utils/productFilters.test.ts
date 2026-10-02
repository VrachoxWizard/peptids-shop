import { describe, expect, it } from "vitest";
import { filterAndSortProducts } from "./productFilters";
import type { Product } from "../types/product";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "BPC-157",
    nameEn: "BPC-157",
    slug: "bpc-157",
    price: 49.9,
    category: "Peptidi",
    categoryEn: "Peptides",
    amount: "5mg",
    description: "Visokopročišćeni pentapeptid",
    descriptionEn: "High-purity pentadecapeptide",
    purity: "≥99.2%",
    casNumber: "137525-51-0",
    molecularWeight: "1419.53 g/mol",
  },
  {
    id: 2,
    name: "NAD+",
    nameEn: "NAD+",
    slug: "nad-plus",
    price: 38.0,
    category: "Istraživački spojevi",
    categoryEn: "Research Compounds",
    amount: "500mg",
    description: "Nikotinamid adenin dinukleotid",
    descriptionEn: "Nicotinamide adenine dinucleotide",
    purity: "≥99.0%",
    casNumber: "53-84-9",
  },
  {
    id: 3,
    name: "GHK-Cu",
    nameEn: "GHK-Cu",
    slug: "ghk-cu",
    price: 65.0,
    category: "Peptidi",
    categoryEn: "Peptides",
    amount: "50mg",
    description: "Tripeptid bakra",
    descriptionEn: "Copper tripeptide",
    purity: "≥99.5%",
    casNumber: "49557-75-7",
  },
];

describe("filterAndSortProducts", () => {
  it("returns all products when no criteria provided", () => {
    const result = filterAndSortProducts(sampleProducts, {});
    expect(result).toHaveLength(3);
  });

  it("filters products by search term", () => {
    const result = filterAndSortProducts(sampleProducts, { search: "nad" });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("NAD+");
  });

  it("filters products by category", () => {
    const result = filterAndSortProducts(sampleProducts, { category: "Peptidi" });
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(["BPC-157", "GHK-Cu"]);
  });

  it("filters products by max price", () => {
    const result = filterAndSortProducts(sampleProducts, { maxPrice: 50 });
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(["BPC-157", "NAD+"]);
  });

  it("sorts products by price ascending and descending", () => {
    const asc = filterAndSortProducts(sampleProducts, { sort: "price-asc" });
    expect(asc[0].name).toBe("NAD+");
    expect(asc[2].name).toBe("GHK-Cu");

    const desc = filterAndSortProducts(sampleProducts, { sort: "price-desc" });
    expect(desc[0].name).toBe("GHK-Cu");
    expect(desc[2].name).toBe("NAD+");
  });
});
