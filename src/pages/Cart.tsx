import { Minus, Plus, ShoppingCart, Trash2, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import ProductVisual from "../components/product/ProductVisual";
import { useCartStore } from "../store/cartStore";
import { useTranslation } from "../i18n/useTranslation";
import { products } from "../data/products";
import { getLocalizedProduct } from "../types/product";

export default function Cart() {
  const { t, language } = useTranslation();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 100 ? 0 : 4.9;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, 100 - subtotal);

  function handleRemove(id: number, name: string) {
    removeItem(id);
    toast.success(t.cart.removedToast, {
      description: name,
    });
  }

  function handleClearCart() {
    clearCart();
    toast.success(t.cart.clearedToast);
  }

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-md mx-auto rounded-3xl border border-white/10 bg-zinc-900/60 p-8 sm:p-12 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/80 text-zinc-500">
            <ShoppingCart size={32} />
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-white">{t.cart.emptyTitle}</h1>

          <p className="mt-3 text-sm text-zinc-400">{t.cart.emptyDesc}</p>

          <Link
            to="/proizvodi"
            className="tactile-press mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 transition hover:bg-emerald-300 shadow-md shadow-emerald-500/20"
          >
            {t.cart.viewCatalog}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-emerald-400 text-xs sm:text-sm">{t.cart.badge}</p>

          <h1 className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-bold">{t.cart.title}</h1>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs sm:text-sm text-zinc-500 transition hover:text-red-400"
        >
          {t.cart.clearCart}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Products */}
        <div className="space-y-4">
          {items.map((item) => {
            const rawProduct = products.find((p) => p.id === item.id);
            const localizedProduct = rawProduct ? getLocalizedProduct(rawProduct, language) : item;

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-zinc-900/70 p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
              >
                {/* Desktop layout: sm and above */}
                <div className="hidden sm:flex sm:items-center gap-6">
                  {/* Product visual */}
                  <Link
                    to={`/proizvod/${item.slug}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-800"
                  >
                    <ProductVisual
                      name={localizedProduct.name}
                      category={rawProduct?.category || item.category}
                      amount={localizedProduct.amount}
                      image={localizedProduct.image}
                      thumbnail
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/proizvod/${item.slug}`}
                      className="truncate block text-lg font-semibold transition hover:text-emerald-400"
                    >
                      {localizedProduct.name}
                    </Link>

                    <p className="mt-1 text-sm text-zinc-500">{localizedProduct.category}</p>

                    <p className="mt-1 text-sm text-zinc-500">{localizedProduct.amount}</p>

                    <p className="mt-2 font-semibold">
                      {item.price.toFixed(2)} €
                      <span className="ml-1 text-sm font-normal text-zinc-500">
                        {t.cart.perUnit}
                      </span>
                    </p>
                  </div>

                  {/* Quantity */}
                  <div>
                    <p className="mb-2 text-center text-xs text-zinc-500">
                      {t.product.quantity}
                    </p>

                    <div className="flex items-center rounded-xl border border-white/10 bg-zinc-950/80 p-1">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        className="tactile-press flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-zinc-800 text-zinc-300 hover:text-white"
                        aria-label="Smanji količinu"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="w-10 text-center font-mono font-semibold text-white">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        className="tactile-press flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-zinc-800 text-zinc-300 hover:text-white"
                        aria-label="Povećaj količinu"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="w-28 text-right">
                    <p className="text-xs text-zinc-500">{t.cart.total}</p>

                    <p className="mt-1 text-lg font-bold">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, localizedProduct.name)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Ukloni proizvod"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>

                {/* Mobile layout: below sm */}
                <div className="flex sm:hidden flex-col gap-4">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <Link
                      to={`/proizvod/${item.slug}`}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800"
                    >
                      <ProductVisual
                        name={localizedProduct.name}
                        category={rawProduct?.category || item.category}
                        amount={localizedProduct.amount}
                        image={localizedProduct.image}
                        thumbnail
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/proizvod/${item.slug}`}
                        className="text-base font-semibold leading-snug line-clamp-1 transition hover:text-emerald-400"
                      >
                        {localizedProduct.name}
                      </Link>

                      <p className="mt-0.5 text-xs text-zinc-500">{localizedProduct.category} · {localizedProduct.amount}</p>

                      <p className="mt-1.5 text-sm font-semibold">
                        {item.price.toFixed(2)} €
                        <span className="ml-1 text-xs font-normal text-zinc-500">{t.cart.perUnit}</span>
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id, localizedProduct.name)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Ukloni proizvod"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Mobile Stepper + Total row */}
                  <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                    <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                        aria-label="Smanji količinu"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-9 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                        aria-label="Povećaj količinu"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] uppercase tracking-wider text-zinc-500">{t.cart.total}</span>
                      <span className="text-base font-bold text-white">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-900/80 p-5 sm:p-6 lg:sticky lg:top-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{t.cart.summaryTitle}</h2>

          {/* Free shipping info */}
          <div className="mt-4 sm:mt-5 rounded-2xl border border-white/5 bg-zinc-950/70 p-4">
            <div className="flex gap-3">
              <Truck size={20} className="shrink-0 text-emerald-400" />

              <div className="w-full">
                {shipping === 0 ? (
                  <>
                    <p className="text-sm font-semibold text-emerald-400">
                      {t.cart.freeShipping}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {t.cart.freeShippingReached}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Još <span className="font-mono text-emerald-400">{remainingForFreeShipping.toFixed(2)} €</span> {t.cart.remainingForFree}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-2.5 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">{t.cart.subtotal}</span>

              <span>{subtotal.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">{t.cart.shipping}</span>

              <span>
                {shipping === 0 ? t.cart.freeShipping : `${shipping.toFixed(2)} €`}
              </span>
            </div>

            <div className="border-t border-zinc-800 pt-3.5 sm:pt-4">
              <div className="flex items-end justify-between">
                <span className="font-semibold">{t.cart.total}</span>

                <span className="text-2xl sm:text-3xl font-bold">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-zinc-600">
            {t.cart.disclaimer}
          </p>

          <Link
            to="/proizvodi"
            className="mt-6 flex w-full items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold transition hover:bg-zinc-800"
          >
            {t.cart.continueShopping}
          </Link>
        </aside>
      </div>
    </main>
  );
}
