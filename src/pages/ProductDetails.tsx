import { useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import ProductVisual from "../components/product/ProductVisual";
import { products } from "../data/products";
import { useCartStore } from "../store/cartStore";
import { useTranslation } from "../i18n/useTranslation";
import { getLocalizedProduct } from "../types/product";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  const rawProduct = products.find((product) => product.slug === slug);

  if (!rawProduct) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-4xl font-bold">{t.product.notFound}</h1>

        <Link
          to="/proizvodi"
          className="mt-6 inline-block text-emerald-400 hover:text-emerald-300 text-sm sm:text-base"
        >
          {t.product.backToProducts}
        </Link>
      </main>
    );
  }

  const product = getLocalizedProduct(rawProduct, language);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(99, current + 1));
  }

  function handleAddToCart() {
    if (!rawProduct) return;

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
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-emerald-400">
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
                <span className="font-mono font-semibold text-emerald-400">{product.purity}</span>
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
                aria-label="Smanji količinu"
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
                aria-label="Povećaj količinu"
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-zinc-950 transition hover:bg-emerald-300 active:scale-[0.99]"
          >
            <ShoppingCart size={19} />
            {t.product.addToCartWithQty} {quantity > 1 ? `(${quantity})` : ""}
          </button>
        </div>
      </div>
    </main>
  );
}
