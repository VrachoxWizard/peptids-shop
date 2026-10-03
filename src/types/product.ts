export type Product = {
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
};

export function getLocalizedProduct(product: Product, lang: "hr" | "en") {
  return {
    ...product,
    name: lang === "en" && product.nameEn ? product.nameEn : product.name,
    category: lang === "en" && product.categoryEn ? product.categoryEn : product.category,
    description:
      lang === "en" && product.descriptionEn ? product.descriptionEn : product.description,
  };
}
