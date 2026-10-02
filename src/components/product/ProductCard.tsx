import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { Product } from "../../types/product";
import { useCartStore } from "../../store/cartStore";
import ProductVisual from "./ProductVisual";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart() {
    addItem(product);

    toast.success("Proizvod dodan u košaricu", {
      description: product.name,
      action: {
        label: "Otvori košaricu",
        onClick: () => navigate("/kosarica"),
      },
    });
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/30">
      {/* Product visual */}
      <Link
        to={`/proizvod/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <div className="transition duration-500 group-hover:scale-[1.03]">
          <ProductVisual
            name={product.name}
            category={product.category}
            amount={product.amount}
          />
        </div>

        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/70 opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            {product.category}
          </span>

          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
            {product.amount}
          </span>
        </div>

        <Link to={`/proizvod/${product.slug}`}>
          <h2 className="mt-4 text-xl font-semibold transition group-hover:text-emerald-400">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-500">
          {product.description}
        </p>

        <div className="mt-6 border-t border-zinc-800 pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="block text-xs text-zinc-500">Cijena</span>

              <span className="mt-1 block text-2xl font-bold">
                {product.price.toFixed(2)}
                <span className="ml-1 text-sm font-normal text-zinc-500">
                  €
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 active:scale-95"
            >
              <ShoppingCart size={16} />
              Dodaj
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
