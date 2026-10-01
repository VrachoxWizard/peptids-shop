import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    slug: "research-peptide-a",
    name: "Research Peptide A",
    category: "Peptidi",
    description: "Sintetski spoj namijenjen laboratorijskom istraživanju.",
    amount: "10 mg",
    price: 39.9,
    image: "/images/product-placeholder.png",
  },
  {
    id: 2,
    slug: "research-peptide-b",
    name: "Research Peptide B",
    category: "Peptidi",
    description: "Demo istraživački peptid visoke čistoće.",
    amount: "5 mg",
    price: 29.9,
    image: "/images/product-placeholder.png",
  },
  {
    id: 3,
    slug: "research-compound-x",
    name: "Research Compound X",
    category: "Istraživački spojevi",
    description: "Referentni laboratorijski spoj za razvoj demo aplikacije.",
    amount: "20 mg",
    price: 44.9,
    image: "/images/product-placeholder.png",
  },
];
