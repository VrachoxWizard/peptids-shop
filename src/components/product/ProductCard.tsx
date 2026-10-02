import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getLocalizedProduct, type Product } from "../../types/product";
import { useCartStore } from "../../store/cartStore";
import { useTranslation } from "../../i18n/useTranslation";
import ProductVisual from "./ProductVisual";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  const loc = getLocalizedProduct(product, language);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);

    toast.success(t.product.addedToast, {
      description: `${loc.name} (${product.amount})`,
      action: {
        label: t.product.openCart,
        onClick: () => navigate("/kosarica"),
      },
    });
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_32px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_20px_45px_-15px_rgba(16,185,129,0.12)] hover:-translate-y-1 flex flex-col justify-between">
      {/* Top Media Section */}
      <div>
        <Link
          to={`/proizvod/${product.slug}`}
          className="relative block overflow-hidden rounded-2xl"
        >
          <div className="transition duration-500 group-hover:scale-[1.03]">
            <ProductVisual
              name={loc.name}
              category={loc.category}
              amount={product.amount}
              image={product.image}
            />
          </div>

          {/* Quick Details Floating Arrow */}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-zinc-950/70 opacity-0 backdrop-blur-md transition duration-200 group-hover:opacity-100 z-10">
            <ArrowUpRight size={15} className="text-zinc-200" />
          </div>

          {/* HPLC Purity Tag if present */}
          {product.purity && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-zinc-950/80 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 backdrop-blur-md z-10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{product.purity}</span>
            </div>
          )}
        </Link>

        {/* Info & Typography Section */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-400 truncate">
              {loc.category}
            </span>

            <span className="shrink-0 rounded-full border border-white/5 bg-zinc-950/70 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-zinc-400">
              {product.amount}
            </span>
          </div>

          <Link to={`/proizvod/${product.slug}`} className="block mt-2.5">
            <h2 className="text-base sm:text-lg font-bold leading-snug text-white transition group-hover:text-emerald-300">
              {loc.name}
            </h2>
          </Link>

          <p className="mt-2 line-clamp-2 min-h-10 text-xs sm:text-sm leading-relaxed text-zinc-400">
            {loc.description}
          </p>

          {/* Optional CAS specification line */}
          {product.casNumber && (
            <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
              <span>CAS:</span>
              <span className="text-zinc-400">{product.casNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="p-4 sm:p-5 pt-0 mt-2 border-t border-white/5">
        <div className="flex items-end justify-between gap-3 pt-3">
          <div>
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-mono">
              {t.product.priceLabel}
            </span>

            <span className="mt-0.5 block text-xl sm:text-2xl font-bold font-mono text-white">
              {product.price.toFixed(2)}
              <span className="ml-1 text-xs sm:text-sm font-normal text-zinc-500">
                €
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="tactile-press flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 shadow-md shadow-emerald-500/10 hover:bg-emerald-300"
          >
            <ShoppingCart size={15} />
            <span>{t.product.addBtn}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
