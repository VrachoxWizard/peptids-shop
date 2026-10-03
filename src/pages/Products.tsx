import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "motion/react";

import ProductCard from "../components/product/ProductCard";
import CatalogFilters from "../components/catalog/CatalogFilters";
import CatalogPagination from "../components/catalog/CatalogPagination";
import { fetchProducts } from "../services/catalogApi";
import { products as fallbackProducts } from "../data/products";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { SHOP_CONFIG } from "../config/shop";
import { filterAndSortProducts } from "../utils/productFilters";
import type { Product } from "../types/product";

export default function Products() {
  const { t, language } = useTranslation();
  useDocumentTitle(t.catalog.title);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "Sve";
  const sort = searchParams.get("sort") || "default";
  const maxPrice = Number(searchParams.get("maxPrice") || 100);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(search);
  const [loadedProducts, setLoadedProducts] = useState<Product[]>(fallbackProducts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchProducts(
          {
            search,
            category,
            sort,
            maxPrice,
          },
          language,
        );
        if (!isCancelled) {
          setLoadedProducts(res.items);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }
    void load();
    return () => {
      isCancelled = true;
    };
  }, [search, category, sort, maxPrice, language]);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams);

      const isDefault =
        value === "" ||
        value === "Sve" ||
        value === "default" ||
        (key === "maxPrice" && value === "100");

      if (isDefault) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      setSearchParams(newParams);
      setCurrentPage(1);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => {
      updateParam("search", searchInput);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput, search, updateParam]);

  const categoryOptions = [
    { value: "Sve", label: t.catalog.allCategories },
    { value: "Peptidi", label: language === "en" ? "Peptides" : "Peptidi" },
    {
      value: "Istraživački spojevi",
      label: language === "en" ? "Research Compounds" : "Istraživački spojevi",
    },
    {
      value: "Referentni uzorci",
      label: language === "en" ? "Reference Standards" : "Referentni uzorci",
    },
  ];

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(loadedProducts, {
      search,
      category,
      maxPrice,
      sort,
    });
  }, [loadedProducts, search, category, sort, maxPrice]);

  const totalPages = Math.ceil(
    filteredProducts.length / SHOP_CONFIG.PRODUCTS_PER_PAGE,
  );
  const effectivePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const startIndex = (effectivePage - 1) * SHOP_CONFIG.PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + SHOP_CONFIG.PRODUCTS_PER_PAGE,
  );

  function resetFilters() {
    setSearchInput("");
    setSearchParams({});
    setCurrentPage(1);
  }

  const filtersActive =
    search !== "" ||
    category !== "Sve" ||
    sort !== "default" ||
    maxPrice !== 100;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-slate-900">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-sky-700">
          <span>{t.catalog.badge}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mt-2">
          {t.catalog.title}
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl">
          {t.catalog.description}
        </p>
      </div>

      {/* Filter controls */}
      <CatalogFilters
        t={t.catalog}
        categoryOptions={categoryOptions}
        category={category}
        sort={sort}
        maxPrice={maxPrice}
        searchInput={searchInput}
        filtersActive={filtersActive}
        onSearchChange={(e) => setSearchInput(e.target.value)}
        onCategoryChange={(val) => updateParam("category", val)}
        onPriceChange={(val) => updateParam("maxPrice", val)}
        onSortChange={(val) => updateParam("sort", val)}
        onResetFilters={resetFilters}
      />

      {/* Results Count & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs sm:text-sm text-slate-500">
        <p>
          {t.catalog.foundCount}:{" "}
          <span className="text-slate-900 font-semibold font-mono">
            {filteredProducts.length}
          </span>
        </p>

        {totalPages > 0 && (
          <p>
            {t.catalog.page}{" "}
            <span className="text-slate-900 font-mono font-semibold">
              {effectivePage}
            </span>{" "}
            {t.catalog.of}{" "}
            <span className="text-slate-900 font-mono font-semibold">
              {totalPages}
            </span>
          </p>
        )}
      </div>

      {/* Products Grid or Empty State */}
      {paginatedProducts.length > 0 ? (
        <>
          <motion.div
            key={effectivePage + category + sort + maxPrice + search}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${
              isLoading ? "opacity-60 pointer-events-none" : "opacity-100"
            }`}
          >
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          <CatalogPagination
            t={t.catalog}
            currentPage={effectivePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-16 sm:py-20 px-4 text-center">
          <Search size={36} className="mx-auto text-slate-400" />
          <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-5">
            {t.catalog.noResultsTitle}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            {t.catalog.noResultsDesc}
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800 transition text-sm shadow-xs"
          >
            {t.catalog.resetFilters}
          </button>
        </div>
      )}
    </main>
  );
}
