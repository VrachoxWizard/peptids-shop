import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ProductVisual from "../product/ProductVisual";
import type { CartItem } from "../../store/cartStore";
import type { Product } from "../../types/product";
import type { translations } from "../../i18n/translations";

type TranslationCart = (typeof translations)[keyof typeof translations]["cart"];

interface CartItemRowProps {
  item: CartItem;
  rawProduct?: Product;
  localizedProduct: {
    name: string;
    category: string;
    amount: string;
    image?: string;
  };
  tCart: TranslationCart;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number, name: string) => void;
}

export default function CartItemRow({
  item,
  rawProduct,
  localizedProduct,
  tCart,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      {/* Desktop Layout (sm and up) */}
      <div className="hidden sm:flex sm:items-center gap-6">
        <Link
          to={`/proizvod/${item.slug}`}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        >
          <ProductVisual
            name={localizedProduct.name}
            category={rawProduct?.category || item.category}
            amount={localizedProduct.amount}
            image={localizedProduct.image}
            thumbnail
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={`/proizvod/${item.slug}`}
            className="truncate block text-base font-bold text-slate-900 transition hover:text-sky-700"
          >
            {localizedProduct.name}
          </Link>
          <p className="mt-0.5 text-xs text-slate-500">
            {localizedProduct.category} · {localizedProduct.amount}
          </p>
          <p className="mt-2 font-mono text-sm font-bold text-slate-900 tabular-nums">
            {item.price.toFixed(2)} €
            <span className="ml-1 text-xs font-normal text-slate-500">
              {tCart.perUnit}
            </span>
          </p>
        </div>

        {/* Stepper */}
        <div>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => onDecrease(item.id)}
              className="tactile-press flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 transition"
              aria-label={tCart.decreaseQty}
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-mono text-xs font-bold text-slate-900 tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onIncrease(item.id)}
              className="tactile-press flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 transition"
              aria-label={tCart.increaseQty}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Item Total */}
        <div className="w-24 text-right">
          <span className="text-[11px] text-slate-400 block font-mono">
            {tCart.total}
          </span>
          <span className="mt-0.5 text-base font-bold font-mono text-slate-900 tabular-nums block">
            {itemTotal} €
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id, localizedProduct.name)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label={tCart.removeItem}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Mobile Layout (below sm) */}
      <div className="flex sm:hidden flex-col gap-3">
        <div className="flex items-start gap-3">
          <Link
            to={`/proizvod/${item.slug}`}
            className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
          >
            <ProductVisual
              name={localizedProduct.name}
              category={rawProduct?.category || item.category}
              amount={localizedProduct.amount}
              image={localizedProduct.image}
              thumbnail
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              to={`/proizvod/${item.slug}`}
              className="text-sm font-bold text-slate-900 line-clamp-1"
            >
              {localizedProduct.name}
            </Link>
            <p className="mt-0.5 text-xs text-slate-500">
              {localizedProduct.category} · {localizedProduct.amount}
            </p>
            <p className="mt-1 text-xs font-mono font-bold text-slate-900 tabular-nums">
              {item.price.toFixed(2)} €
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id, localizedProduct.name)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-400 hover:text-red-600"
            aria-label={tCart.removeItem}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => onDecrease(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-600"
              aria-label={tCart.decreaseQty}
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center font-mono text-xs font-bold text-slate-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onIncrease(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded text-slate-600"
              aria-label={tCart.increaseQty}
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
              {itemTotal} €
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
