export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  amount: string;
  price: number;
  image?: string;
  featured?: boolean;
  purity?: string;
  casNumber?: string;
  molecularWeight?: string;
};
