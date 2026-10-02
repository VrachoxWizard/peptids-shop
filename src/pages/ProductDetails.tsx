import { useState } from "react";
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import ProductVisual from "../components/product/ProductVisual";
import { products } from "../data/products";
import { useCartStore } from "../store/cartStore";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { getLocalizedProduct } from "../types/product";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  const rawProduct = products.find((product) => product.slug === slug);
  const product = rawProduct ? getLocalizedProduct(rawProduct, language) : null;

  useDocumentTitle(product ? product.name : t.product.notFound);

  if (!rawProduct || !product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-4xl font-bold">{t.product.notFound}</h1>

        <Link
          to="/proizvodi"
          className="mt-6 inline-block text-sky-400 hover:text-sky-300 text-sm sm:text-base font-medium"
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

    toast.success(t.product.addedToast, {
      description: `${product.name} × ${quantity}`,
      action: {
        label: t.product.openCart,
        onClick: () => navigate("/kosarica"),
      },
    });

    setQuantity(1);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 sm:mb-10 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 min-w-0"
      >
        <Link to="/" className="transition hover:text-white shrink-0">
          {t.nav.home}
        </Link>

        <ChevronRight size={14} className="shrink-0" />

        <Link to="/proizvodi" className="transition hover:text-white shrink-0">
          {t.nav.products}
        </Link>

        <ChevronRight size={14} className="shrink-0" />

        <span className="text-zinc-300 truncate">{product.name}</span>
      </nav>

      <div className="grid gap-8 sm:gap-12 md:grid-cols-2 items-start">
        {/* Product visual */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-800">
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
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-sky-400">
            {product.category}
          </span>

          <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight break-words">
            {product.name}
          </h1>

          <p className="mt-3 sm:mt-5 text-base sm:text-lg leading-relaxed text-zinc-400">
            {product.description}
          </p>

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 border-t border-zinc-800 pt-6 sm:pt-8 text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-500">{t.product.packaging}</span>
              <span className="font-medium text-white">{product.amount}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-500">{t.product.category}</span>
              <span className="font-medium text-white">{product.category}</span>
            </div>

            {product.purity && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500">{t.product.hplcPurity}</span>
                <span className="font-mono font-semibold text-sky-400">{product.purity}</span>
              </div>
            )}

            {product.casNumber && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500">{t.product.casRegistry}</span>
                <span className="font-mono font-medium text-zinc-300">{product.casNumber}</span>
              </div>
            )}

            {product.molecularWeight && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500">{t.product.molecularWeight}</span>
                <span className="font-mono font-medium text-zinc-300">{product.molecularWeight}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-500">{t.product.purpose}</span>
              <span className="font-medium text-right text-white">{t.product.purposeValue}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-8 sm:mt-10">
            <span className="block text-xs sm:text-sm text-zinc-500">{t.product.priceLabel}</span>

            <span className="mt-0.5 sm:mt-1 inline-block text-3xl sm:text-4xl font-bold">
              {product.price.toFixed(2)}

              <span className="ml-1 text-base sm:text-lg font-normal text-zinc-500">€</span>
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-6 sm:mt-8">
            <span className="mb-2 sm:mb-3 block text-xs sm:text-sm font-medium text-zinc-400">
              {t.product.quantity}
            </span>

            <div className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900 p-1">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={t.cart.decreaseQty}
              >
                <Minus size={18} />
              </button>

              <span className="w-12 sm:w-14 text-center text-base sm:text-lg font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity === 99}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label={t.cart.increaseQty}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-5 sm:pt-6">
            <span className="text-sm sm:text-base text-zinc-500">{t.product.total}</span>

            <span className="text-xl sm:text-2xl font-bold">
              {(product.price * quantity).toFixed(2)} €
            </span>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 active:scale-[0.99]"
          >
            <ShoppingCart size={19} />
            {t.product.addToCartWithQty} {quantity > 1 ? `(${quantity})` : ""}
          </button>

          {/* Croatian buyer reassurance */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sky-500/20 bg-sky-950/20 px-3.5 py-2.5 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Truck size={14} className="text-sky-400 shrink-0" />
              {t.trustBar.shipping}
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-sky-300">
              <ShieldCheck size={14} className="text-sky-400 shrink-0" />
              {t.trustBar.payment}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
