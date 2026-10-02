import { useState } from "react";
import { Check, ChevronRight, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import ProductVisual from "../components/product/ProductVisual";
import { products } from "../data/products";
import { useCartStore } from "../store/cartStore";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { getLocalizedProduct } from "../types/product";

export default function ProductDetails() {
  const { slug } = useParams();
  const { t, language } = useTranslation();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const rawProduct = products.find((product) => product.slug === slug);
  const product = rawProduct ? getLocalizedProduct(rawProduct, language) : null;

  useDocumentTitle(product ? product.name : t.product.notFound);

  if (!rawProduct || !product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-900">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold">{t.product.notFound}</h1>

        <Link
          to="/proizvodi"
          className="mt-6 inline-block text-sky-700 hover:text-sky-800 text-sm sm:text-base font-semibold"
        >
          {t.product.backToProducts}
        </Link>
      </main>
    );
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(99, current + 1));
  }

  function handleAddToCart() {
    if (!rawProduct || !product) return;

    addItem(rawProduct, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);

    setQuantity(1);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 text-slate-900">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 sm:mb-10 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 min-w-0"
      >
        <Link to="/" className="transition hover:text-slate-900 shrink-0">
          {t.nav.home}
        </Link>

        <ChevronRight size={14} className="shrink-0 text-slate-400" />

        <Link to="/proizvodi" className="transition hover:text-slate-900 shrink-0">
          {t.nav.products}
        </Link>

        <ChevronRight size={14} className="shrink-0 text-slate-400" />

        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid gap-8 sm:gap-12 md:grid-cols-2 items-start">
        {/* Product visual */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
          <ProductVisual
            name={product.name}
            category={rawProduct.category}
            amount={product.amount}
            image={product.image}
            large
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-sky-700">
            {product.category}
          </span>

          <h1 className="font-serif mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 break-words leading-tight">
            {product.name}
          </h1>

          <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
            {product.description}
          </p>

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5 border-t border-slate-200 pt-6 text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">{t.product.packaging}</span>
              <span className="font-semibold text-slate-900 font-mono">{product.amount}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">{t.product.category}</span>
              <span className="font-medium text-slate-900">{product.category}</span>
            </div>

            {product.purity && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">{t.product.hplcPurity}</span>
                <span className="font-mono font-bold text-sky-800 tabular-nums">{product.purity}</span>
              </div>
            )}

            {product.casNumber && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">{t.product.casRegistry}</span>
                <span className="font-mono font-semibold text-slate-800 tabular-nums">{product.casNumber}</span>
              </div>
            )}

            {product.molecularWeight && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">{t.product.molecularWeight}</span>
                <span className="font-mono font-semibold text-slate-800 tabular-nums">{product.molecularWeight}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">{t.product.purpose}</span>
              <span className="font-medium text-right text-slate-900">{t.product.purposeValue}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-8">
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-mono">{t.product.priceLabel}</span>

            <span className="mt-0.5 inline-block text-3xl sm:text-4xl font-bold font-mono text-slate-950 tabular-nums">
              {product.price.toFixed(2)}
              <span className="ml-1 text-base font-normal text-slate-500">€</span>
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <span className="mb-2 block text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
              {t.product.quantity}
            </span>

            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                className="flex h-9 w-9 items-center justify-center rounded text-slate-700 hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 transition"
                aria-label={t.cart.decreaseQty}
              >
                <Minus size={16} />
              </button>

              <span className="w-12 text-center text-sm font-mono font-bold text-slate-900 tabular-nums">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity === 99}
                className="flex h-9 w-9 items-center justify-center rounded text-slate-700 hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 transition"
                aria-label={t.cart.increaseQty}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
            <span className="text-sm font-medium text-slate-500">{t.product.total}</span>

            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-950 tabular-nums">
              {(product.price * quantity).toFixed(2)} €
            </span>
          </div>

          {/* Add to cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`tactile-press mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm sm:text-base font-bold transition-colors duration-150 shadow-xs ${
              justAdded
                ? "bg-emerald-700 text-white"
                : "bg-slate-950 text-white hover:bg-slate-800"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={18} />
                <span>{language === "hr" ? "Dodano u košaricu!" : "Added to cart!"}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>{t.product.addToCartWithQty} {quantity > 1 ? `(${quantity})` : ""}</span>
              </>
            )}
          </button>

          {/* Croatian buyer reassurance */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Truck size={14} className="text-sky-700 shrink-0" />
              {t.trustBar.shipping}
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
              <ShieldCheck size={14} className="text-sky-700 shrink-0" />
              {t.trustBar.payment}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
