import { ShoppingCart } from "lucide-react";
import type { Product } from "../../types/product";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition">
      <div className="aspect-square bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-28 mx-auto rounded-lg border border-zinc-600 bg-zinc-900 flex items-center justify-center">
            <span className="text-emerald-400 text-xs font-bold">LAB</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-emerald-400 font-medium">
            {product.category}
          </span>

          <span className="text-xs text-zinc-500">{product.amount}</span>
        </div>

        <Link
          to={`/proizvod/${product.slug}`}
          className="aspect-square bg-zinc-800 flex items-center justify-center"
        >
          <h2 className="text-xl font-semibold mt-3 hover:text-emerald-400 transition">
            {product.name}
          </h2>
        </Link>

        <p className="text-sm text-zinc-400 mt-2">{product.description}</p>

        <div className="flex items-center justify-between mt-6">
          <span className="text-xl font-bold">
            {product.price.toFixed(2)} €
          </span>

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-emerald-400 text-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-emerald-300 transition"
          >
            <ShoppingCart size={16} />
            Dodaj
          </button>
        </div>
      </div>
    </article>
  );
}
