import { useState } from "react";
import { ArrowUpRight, Check, ShoppingCart, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import { getLocalizedProduct, type Product } from "../../types/product";
import { useCartStore } from "../../store/cartStore";
import { useTranslation } from "../../i18n/useTranslation";
import ProductVisual from "./ProductVisual";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const { t, language } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  const loc = getLocalizedProduct(product, language);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);

    // Silent inline tactile confirmation
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  }

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Media Section */}
      <div>
        <Link
          to={`/proizvod/${product.slug}`}
          className="relative block overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
        >
          <div className="transition duration-300 group-hover:scale-[1.02]">
            <ProductVisual
              name={loc.name}
              category={loc.category}
              amount={product.amount}
              image={product.image}
            />
          </div>

          {/* Quick Details Floating Arrow */}
          <div className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white/90 opacity-0 transition duration-200 group-hover:opacity-100 z-10 shadow-xs">
            <ArrowUpRight size={14} className="text-slate-700" />
          </div>

          {/* HPLC Purity Tag if present */}
          {product.purity && (
            <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-slate-200 bg-white/95 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-800 z-10 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{product.purity}</span>
            </div>
          )}
        </Link>

        {/* Info & Typography Section */}
        <div className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-sky-700 truncate">
              {loc.category}
            </span>

            <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] text-slate-600 font-medium">
              {product.amount}
            </span>
          </div>

          <Link to={`/proizvod/${product.slug}`} className="block mt-2">
            <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-slate-900 transition group-hover:text-sky-800">
              {loc.name}
            </h3>
          </Link>

          <p className="mt-1.5 line-clamp-2 min-h-9 text-xs sm:text-sm leading-relaxed text-slate-600">
            {loc.description}
          </p>

          {/* Delivery & origin trust signal - Flat row without card-in-card */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Truck size={14} className="text-sky-700 shrink-0" />
            <span>Zaliha u RH (24–48h)</span>
          </div>

          {/* Optional CAS specification line */}
          {product.casNumber && (
            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
              <span>CAS:</span>
              <span className="text-slate-700 font-medium">{product.casNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="p-3.5 sm:p-4 pt-0 mt-1 border-t border-slate-100">
        <div className="flex items-end justify-between gap-3 pt-3">
          <div>
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              {t.product.priceLabel}
            </span>

            <span className="mt-0.5 block text-xl sm:text-2xl font-bold font-mono text-slate-950 tabular-nums">
              {product.price.toFixed(2)}
              <span className="ml-1 text-xs sm:text-sm font-normal text-slate-500">
                €
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`tactile-press flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              justAdded
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={15} />
                <span>{language === "hr" ? "Dodano" : "Added"}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                <span>{t.product.addBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
