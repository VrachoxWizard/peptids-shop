import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { products, productBatches } from "../../db/schema";
import type { GetProductsQuery } from "./catalog.schema";

export class CatalogService {
  async listProducts(query: GetProductsQuery, lang: "hr" | "en" = "hr") {
    const { search, category, maxPrice, sort, page, limit } = query;
    const offset = (page - 1) * limit;

    const conditions = [eq(products.isActive, true)];

    if (category && category !== "Sve" && category !== "All") {
      conditions.push(
        or(
          eq(products.category, category),
          eq(products.categoryEn, category),
        )!,
      );
    }

    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }

    if (search && search.trim().length > 0) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(products.nameHr, term),
          ilike(products.nameEn, term),
          ilike(products.casNumber, term),
          ilike(products.category, term),
          ilike(products.categoryEn, term),
        )!,
      );
    }

    let orderByClause;
    switch (sort) {
      case "price-asc":
        orderByClause = asc(products.price);
        break;
      case "price-desc":
        orderByClause = desc(products.price);
        break;
      case "name-asc":
        orderByClause = asc(lang === "en" ? products.nameEn : products.nameHr);
        break;
      case "name-desc":
        orderByClause = desc(lang === "en" ? products.nameEn : products.nameHr);
        break;
      default:
        orderByClause = desc(products.featured);
        break;
    }

    const whereClause = and(...conditions);

    // Dohvati paginirane proizvode
    const rows = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Dohvati ukupan broj rezultata za paginaciju
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereClause);

    const localizedProducts = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: lang === "en" && p.nameEn ? p.nameEn : p.nameHr,
      category: lang === "en" && p.categoryEn ? p.categoryEn : p.category,
      description: lang === "en" && p.descriptionEn ? p.descriptionEn : p.descriptionHr,
      amount: p.amount,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      featured: p.featured,
      purity: p.purity,
      casNumber: p.casNumber,
      molecularWeight: p.molecularWeight,
    }));

    return {
      items: localizedProducts,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getProductBySlug(slug: string, lang: "hr" | "en" = "hr") {
    const [row] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isActive, true)));

    if (!row) return null;

    // Dohvati podatke o najnovijoj aktivnoj seriji za ovaj proizvod
    const [latestBatch] = await db
      .select()
      .from(productBatches)
      .where(
        and(
          eq(productBatches.productId, row.id),
          eq(productBatches.isReleased, true),
        ),
      )
      .orderBy(desc(productBatches.createdAt))
      .limit(1);

    return {
      id: row.id,
      slug: row.slug,
      name: lang === "en" && row.nameEn ? row.nameEn : row.nameHr,
      category: lang === "en" && row.categoryEn ? row.categoryEn : row.category,
      description: lang === "en" && row.descriptionEn ? row.descriptionEn : row.descriptionHr,
      amount: row.amount,
      price: Number(row.price),
      imageUrl: row.imageUrl,
      featured: row.featured,
      purity: row.purity,
      casNumber: row.casNumber,
      molecularWeight: row.molecularWeight,
      currentBatch: latestBatch
        ? {
            batchNumber: latestBatch.batchNumber,
            purityPercentage: latestBatch.purityPercentage,
            inStock: latestBatch.stockQuantity > 0,
            coaUrl: latestBatch.coaPdfUrl,
          }
        : null,
    };
  }
}

export const catalogService = new CatalogService();
