import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, FileText, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import ProductVisual from "../components/product/ProductVisual";
import StockBadge from "../components/product/StockBadge";
import CoAModal from "../components/product/CoAModal";
import { products as fallbackProducts } from "../data/products";
import { fetchProductBySlug } from "../services/catalogApi";
import { useCartStore } from "../store/cartStore";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { getLocalizedProduct, type Product } from "../types/product";

export default function ProductDetails() {
  const { slug } = useParams();
  const { t, language } = useTranslation();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isCoaOpen, setIsCoaOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rawProduct, setRawProduct] = useState<Product | null>(() => {
    return fallbackProducts.find((product) => product.slug === slug) || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!rawProduct);

  useEffect(() => {
    if (!slug) return;
    let isCancelled = false;
    void fetchProductBySlug(slug, language).then((prod) => {
      if (!isCancelled) {
        setRawProduct(prod);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [slug, language]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const addItem = useCartStore((state) => state.addItem);

  const product = rawProduct ? getLocalizedProduct(rawProduct, language) : null;

  useDocumentTitle(product ? product.name : t.product.notFound);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-900 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-10 w-96 bg-slate-200 rounded mb-8" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </main>
    );
  }

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
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
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
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-sky-700">
              {product.category}
            </span>
            <StockBadge inStock={rawProduct.inStock} stockQuantity={rawProduct.stockQuantity} />
          </div>

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
          {rawProduct.inStock === false || rawProduct.stockQuantity === 0 ? (
            <button
              type="button"
              disabled
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm sm:text-base font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            >
              <span>{language === "en" ? "Sold Out" : "Trenutno rasprodano"}</span>
            </button>
          ) : (
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
                  <span>{t.product.addedToast}</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>{t.product.addToCartWithQty} {quantity > 1 ? `(${quantity})` : ""}</span>
                </>
              )}
            </button>
          )}

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

          {/* Certificate of Analysis (CoA) Action Banner */}
          <div className="mt-4 p-3.5 rounded-xl border border-sky-100 bg-sky-50/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                <FileText size={17} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {language === "en" ? "Certificate of Analysis (CoA)" : "Certifikat analize (CoA)"}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {language === "en" ? "HPLC purity verification & MS assay" : "Verifikacija čistoće serije HPLC kromatografijom"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCoaOpen(true)}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer shrink-0"
            >
              {language === "en" ? "View CoA" : "Pregledaj CoA"}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Certificate of Analysis Modal */}
      <CoAModal
        isOpen={isCoaOpen}
        onClose={() => setIsCoaOpen(false)}
        product={product}
      />
    </main>
  );
}
