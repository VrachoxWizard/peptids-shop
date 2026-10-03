import { getApiBaseUrl } from "./apiClient";
import { products as localProducts } from "../data/products";
import type { Product } from "../types/product";
import { filterAndSortProducts } from "../utils/productFilters";

export interface FetchProductsQuery {
  category?: string;
  search?: string;
  sort?: string;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface FetchProductsResponse {
  items: Product[];
  total: number;
  page?: number;
  totalPages?: number;
}

interface ServerProductDto {
  id: number;
  slug: string;
  name: string;
  nameEn?: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  amount: string;
  price: number;
  imageUrl?: string;
  image?: string;
  featured?: boolean;
  purity?: string;
  casNumber?: string;
  molecularWeight?: string;
  inStock?: boolean;
  stockQuantity?: number;
  currentBatch?: {
    batchNumber: string;
    purityPercentage: string | number | null;
    inStock: boolean;
    coaUrl?: string | null;
    stockQuantity?: number;
  } | null;
}

function normalizeProduct(p: ServerProductDto): Product {
  const inStock =
    p.inStock !== undefined
      ? p.inStock
      : p.currentBatch?.inStock !== undefined
      ? p.currentBatch.inStock
      : true;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category,
    categoryEn: p.categoryEn,
    description: p.description,
    descriptionEn: p.descriptionEn,
    amount: p.amount,
    price: Number(p.price),
    image: p.imageUrl || p.image || "/images/products/placeholder.jpg",
    featured: Boolean(p.featured),
    purity: p.purity,
    casNumber: p.casNumber,
    molecularWeight: p.molecularWeight,
    inStock,
    stockQuantity: p.stockQuantity ?? (p.currentBatch?.stockQuantity ?? 100),
    currentBatch: p.currentBatch,
  };
}

export async function fetchProducts(
  query: FetchProductsQuery = {},
  lang: "hr" | "en" = "hr",
): Promise<FetchProductsResponse> {
  const baseUrl = getApiBaseUrl();
  const searchParams = new URLSearchParams();

  if (query.category && query.category !== "Sve" && query.category !== "All") {
    searchParams.set("category", query.category);
  }
  if (query.search) {
    searchParams.set("search", query.search);
  }
  if (query.sort) {
    searchParams.set("sort", query.sort);
  }
  if (query.maxPrice) {
    searchParams.set("maxPrice", query.maxPrice.toString());
  }
  if (query.page) {
    searchParams.set("page", query.page.toString());
  }
  if (query.limit) {
    searchParams.set("limit", query.limit.toString());
  }

  const queryString = searchParams.toString();
  const url = `${baseUrl}/products${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Accept-Language": lang,
      },
    });

    if (!res.ok) {
      throw new Error(`Poslužitelj vratio status ${res.status}`);
    }

    const json = (await res.json()) as {
      data: ServerProductDto[];
      pagination?: { totalItems: number; totalPages: number; page: number; limit: number };
    };

    const items = (json.data || []).map(normalizeProduct);
    const total = json.pagination?.totalItems ?? items.length;

    return {
      items,
      total,
      page: json.pagination?.page ?? 1,
      totalPages: json.pagination?.totalPages ?? 1,
    };
  } catch (err: unknown) {
    // Ako poslužitelj nije dostupan, koristimo lokalne podatke
    const filtered = filterAndSortProducts(localProducts, {
      search: query.search || "",
      category: query.category || "Sve",
      maxPrice: query.maxPrice || 100,
      sort: query.sort || "default",
    });

    return {
      items: filtered.map((p) => ({
        ...p,
        inStock: true,
        stockQuantity: 100,
      })),
      total: filtered.length,
      page: 1,
      totalPages: 1,
    };
  }
}

export async function fetchProductBySlug(
  slug: string,
  lang: "hr" | "en" = "hr",
): Promise<Product | null> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/products/${encodeURIComponent(slug)}`, {
      headers: {
        "Accept-Language": lang,
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Poslužitelj vratio status ${res.status}`);
    }

    const json = (await res.json()) as { data: ServerProductDto };
    if (!json.data) return null;

    return normalizeProduct(json.data);
  } catch {
    // Offline fallback
    const local = localProducts.find((p) => p.slug === slug);
    if (!local) return null;

    return {
      ...local,
      inStock: true,
      stockQuantity: 100,
    };
  }
}
