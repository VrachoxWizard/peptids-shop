import { useState } from "react";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Lock,
  Minus,
  PackageCheck,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import ProductVisual from "../components/product/ProductVisual";
import { useCartStore } from "../store/cartStore";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { products } from "../data/products";
import { getLocalizedProduct } from "../types/product";
import { SHOP_CONFIG, calculateShipping } from "../config/shop";

export default function Cart() {
  const { t, language } = useTranslation();
  useDocumentTitle(t.cart.title);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "keks" | "card" | "transfer">("cod");
  const [completedOrder, setCompletedOrder] = useState<{
    total: number;
    paymentMethod: "cod" | "keks" | "card" | "transfer";
  } | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, SHOP_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal);

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

  function handleCheckout() {
    const finalTotal = total;
    const method = paymentMethod;
    setCompletedOrder({ total: finalTotal, paymentMethod: method });
    clearCart();
    toast.success(
      method === "cod" ? t.cart.orderSuccessCodDesc : t.cart.orderSuccessSecureDesc,
    );
  }

  if (completedOrder) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-lg mx-auto rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="font-serif mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t.cart.orderSuccessTitle}
          </h1>

          <p className="mt-2.5 text-sm text-slate-600">
            {completedOrder.paymentMethod === "cod"
              ? t.cart.orderSuccessCodDesc
              : t.cart.orderSuccessSecureDesc}
          </p>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.cart.total}:</span>
              <strong className="font-mono text-slate-900 text-sm">{completedOrder.total.toFixed(2)} €</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.payments.title}:</span>
              <span className="font-semibold text-slate-900">
                {completedOrder.paymentMethod === "cod"
                  ? t.payments.cod
                  : completedOrder.paymentMethod === "keks"
                  ? t.payments.keks
                  : completedOrder.paymentMethod === "card"
                  ? t.payments.card
                  : t.payments.transfer}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-emerald-800">
              <span className="font-medium">{t.trustBar.shipping}</span>
            </div>
          </div>

          <Link
            to="/proizvodi"
            onClick={() => setCompletedOrder(null)}
            className="tactile-press mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 text-sm shadow-xs"
          >
            {t.cart.continueShopping}
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
            <ShoppingCart size={28} />
          </div>

          <h1 className="font-serif mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{t.cart.emptyTitle}</h1>

          <p className="mt-2.5 text-sm text-slate-600">{t.cart.emptyDesc}</p>

          <Link
            to="/proizvodi"
            className="tactile-press mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 text-sm shadow-xs"
          >
            {t.cart.viewCatalog}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-slate-900">
      {/* Header */}
      <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-700">{t.cart.badge}</p>

          <h1 className="font-serif mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">{t.cart.title}</h1>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs sm:text-sm text-slate-500 transition hover:text-red-600 font-medium"
        >
          {t.cart.clearCart}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Products list */}
        <div className="space-y-4">
          {items.map((item) => {
            const rawProduct = products.find((p) => p.id === item.id);
            const localizedProduct = rawProduct ? getLocalizedProduct(rawProduct, language) : item;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs"
              >
                {/* Desktop layout: sm and above */}
                <div className="hidden sm:flex sm:items-center gap-6">
                  {/* Product visual */}
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

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/proizvod/${item.slug}`}
                      className="truncate block text-base font-bold text-slate-900 transition hover:text-sky-700"
                    >
                      {localizedProduct.name}
                    </Link>

                    <p className="mt-0.5 text-xs text-slate-500">{localizedProduct.category} · {localizedProduct.amount}</p>

                    <p className="mt-2 font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {item.price.toFixed(2)} €
                      <span className="ml-1 text-xs font-normal text-slate-500">
                        {t.cart.perUnit}
                      </span>
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div>
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        className="tactile-press flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 transition"
                        aria-label={t.cart.decreaseQty}
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-8 text-center font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        className="tactile-press flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-white hover:text-slate-900 transition"
                        aria-label={t.cart.increaseQty}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="w-24 text-right">
                    <span className="text-[11px] text-slate-400 block font-mono">{t.cart.total}</span>
                    <span className="mt-0.5 text-base font-bold font-mono text-slate-900 tabular-nums block">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, localizedProduct.name)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={t.cart.removeItem}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Mobile layout: below sm */}
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

                      <p className="mt-0.5 text-xs text-slate-500">{localizedProduct.category} · {localizedProduct.amount}</p>

                      <p className="mt-1 text-xs font-mono font-bold text-slate-900 tabular-nums">
                        {item.price.toFixed(2)} €
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id, localizedProduct.name)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-400 hover:text-red-600"
                      aria-label={t.cart.removeItem}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded text-slate-600"
                        aria-label={t.cart.decreaseQty}
                      >
                        <Minus size={13} />
                      </button>

                      <span className="w-7 text-center font-mono text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded text-slate-600"
                        aria-label={t.cart.increaseQty}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Sidebar */}
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24 shadow-xs">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-950 tracking-tight">{t.cart.summaryTitle}</h2>

          {/* Free shipping info */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex gap-2.5">
              <Truck size={18} className="shrink-0 text-sky-700 mt-0.5" />

              <div className="w-full">
                {shipping === 0 ? (
                  <>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                      {t.cart.freeShipping}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t.cart.freeShippingReached}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      {t.cart.remainingPrefix}<span className="font-mono text-sky-700">{remainingForFreeShipping.toFixed(2)} €</span> {t.cart.remainingForFree}
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-sky-700 rounded-full transition-[width] duration-300"
                        style={{ width: `${Math.min(100, (subtotal / SHOP_CONFIG.FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mt-5">
            <label className="block font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {t.payments.title}
            </label>

            <div className="space-y-2">
              {/* Pouzeće */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  paymentMethod === "cod"
                    ? "border-emerald-600 bg-emerald-50/70"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                    <Banknote size={15} className="text-emerald-700 shrink-0" />
                    <span>{t.payments.cod}</span>
                  </div>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 shrink-0">
                    {t.payments.codBadge}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 pl-6 leading-tight">
                  {t.payments.codDetail}
                </p>
              </button>

              {/* Keks Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod("keks")}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  paymentMethod === "keks"
                    ? "border-sky-600 bg-sky-50/70"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                    <Smartphone size={15} className="text-sky-700 shrink-0" />
                    <span>{t.payments.keks}</span>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-700 shrink-0">
                    {t.payments.keksBadge}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 pl-6 leading-tight">
                  {t.payments.keksDetail}
                </p>
              </button>

              {/* Kartice */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  paymentMethod === "card"
                    ? "border-sky-600 bg-sky-50/70"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                  <CreditCard size={15} className="text-sky-700 shrink-0" />
                  <span>{t.payments.card}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 pl-6 leading-tight">
                  {t.payments.cardDetail}
                </p>
              </button>

              {/* Virman */}
              <button
                type="button"
                onClick={() => setPaymentMethod("transfer")}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  paymentMethod === "transfer"
                    ? "border-sky-600 bg-sky-50/70"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                  <QrCode size={15} className="text-sky-700 shrink-0" />
                  <span>{t.payments.transfer}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 pl-6 leading-tight">
                  {t.payments.transferDetail}
                </p>
              </button>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-xs sm:text-sm text-slate-600">
              <span>{t.cart.subtotal}</span>
              <span className="font-mono text-slate-900 tabular-nums">{subtotal.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-slate-600">
              <span>{t.cart.shipping}</span>
              <span className="font-mono text-slate-900 tabular-nums">
                {shipping === 0 ? t.cart.freeShipping : `${shipping.toFixed(2)} €`}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-end justify-between">
                <span className="font-bold text-slate-950 text-base">{t.cart.total}</span>
                <span className="text-2xl font-bold font-mono text-slate-950 tabular-nums">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Primary Checkout CTA */}
          <button
            type="button"
            onClick={handleCheckout}
            className="tactile-press mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm"
          >
            <ShieldCheck size={18} />
            <span>
              {language === "hr"
                ? `Dovrši narudžbu (${paymentMethod === "cod" ? "Pouzeće" : "Sigurno"})`
                : `Complete Order (${paymentMethod === "cod" ? "Cash on Delivery" : "Secure Pay"})`}
            </span>
          </button>

          {/* Trust Guarantees Box */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Lock size={14} className="text-sky-700 shrink-0" />
              <span>{t.payments.sslSecure}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <PackageCheck size={14} className="text-sky-700 shrink-0" />
              <span>{t.payments.discreteGuarantee}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Truck size={14} className="text-sky-700 shrink-0" />
              <span>{t.trustBar.shipping}</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
            {t.cart.disclaimer}
          </p>

          <Link
            to="/proizvodi"
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold transition hover:bg-slate-50 text-slate-700"
          >
            {t.cart.continueShopping}
          </Link>
        </aside>
      </div>
    </main>
  );
}
