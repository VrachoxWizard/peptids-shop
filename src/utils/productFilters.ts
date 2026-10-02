import type { Product } from "../types/product";

export interface ProductFilterCriteria {
  search?: string;
  category?: string;
  maxPrice?: number;
  sort?: string;
}

export function filterAndSortProducts(
  productsList: Product[],
  criteria: ProductFilterCriteria,
): Product[] {
  let result = [...productsList];

  const search = criteria.search?.trim();
  if (search) {
    const searchValue = search.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue) ||
        (product.nameEn?.toLowerCase().includes(searchValue) ?? false) ||
        product.description.toLowerCase().includes(searchValue) ||
        (product.descriptionEn?.toLowerCase().includes(searchValue) ?? false) ||
        product.category.toLowerCase().includes(searchValue) ||
        (product.categoryEn?.toLowerCase().includes(searchValue) ?? false) ||
        (product.casNumber?.toLowerCase().includes(searchValue) ?? false),
    );
  }

  const category = criteria.category;
  if (category && category !== "Sve") {
    result = result.filter(
      (product) =>
        product.category === category ||
        product.categoryEn === category ||
        (category === "Peptidi" && product.category === "Peptidi") ||
        (category === "Peptides" && product.category === "Peptidi") ||
        (category === "Research Compounds" && product.category === "Istraživački spojevi") ||
        (category === "Reference Standards" && product.category === "Referentni uzorci"),
    );
  }

  if (typeof criteria.maxPrice === "number") {
    result = result.filter((product) => product.price <= criteria.maxPrice!);
  }

  switch (criteria.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return result;
}
