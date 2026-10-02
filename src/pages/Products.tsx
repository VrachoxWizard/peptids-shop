import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion } from "motion/react";

import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { SHOP_CONFIG } from "../config/shop";

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
  const [prevSearch, setPrevSearch] = useState(search);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const categoryOptions = [
    { value: "Sve", label: t.catalog.allCategories },
    { value: "Peptidi", label: language === "en" ? "Peptides" : "Peptidi" },
    { value: "Istraživački spojevi", label: language === "en" ? "Research Compounds" : "Istraživački spojevi" },
    { value: "Referentni uzorci", label: language === "en" ? "Reference Standards" : "Referentni uzorci" },
  ];

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setSearchInput(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateParam("search", val);
    }, 250);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue) ||
          (product.nameEn?.toLowerCase().includes(searchValue) ?? false) ||
          product.description.toLowerCase().includes(searchValue) ||
          (product.descriptionEn?.toLowerCase().includes(searchValue) ?? false) ||
          product.category.toLowerCase().includes(searchValue) ||
          (product.categoryEn?.toLowerCase().includes(searchValue) ?? false) ||
          (product.casNumber?.toLowerCase().includes(searchValue) ?? false),
      );
    }

    if (category !== "Sve") {
      result = result.filter(
        (product) =>
          product.category === category ||
          product.categoryEn === category ||
          (category === "Peptidi" && product.category === "Peptidi") ||
          (category === "Peptides" && product.category === "Peptidi") ||
          (category === "Research Compounds" && product.category === "Istraživački spojevi") ||
          (category === "Reference Standards" && product.category === "Referentni uzorci")
      );
    }

    result = result.filter((product) => product.price <= maxPrice);

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name-asc":
        result.sort((a, b) => {
          const nameA = (language === "en" ? a.nameEn : a.name) || a.name;
          const nameB = (language === "en" ? b.nameEn : b.name) || b.name;
          return nameA.localeCompare(nameB);
        });
        break;

      case "name-desc":
        result.sort((a, b) => {
          const nameA = (language === "en" ? a.nameEn : a.name) || a.name;
          const nameB = (language === "en" ? b.nameEn : b.name) || b.name;
          return nameB.localeCompare(nameA);
        });
        break;
    }

    return result;
  }, [search, category, sort, maxPrice, language]);

  const totalPages = Math.ceil(filteredProducts.length / SHOP_CONFIG.PRODUCTS_PER_PAGE);

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

  function previousPage() {
    setCurrentPage(Math.max(effectivePage - 1, 1));
  }

  function nextPage() {
    setCurrentPage(Math.min(effectivePage + 1, totalPages));
  }

  const filtersActive =
    search !== "" ||
    category !== "Sve" ||
    sort !== "default" ||
    maxPrice !== 100;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-slate-900">
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

      {/* Search */}
      <div className="relative mb-5 sm:mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder={t.catalog.searchPlaceholder}
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 sm:pl-12 pr-4 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-700 shadow-xs"
        />
      </div>

      {/* Filteri */}
      <div className="mb-8 sm:mb-10 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <SlidersHorizontal size={18} className="text-sky-700" />

          <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">{t.catalog.filtersTitle}</h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="category-select" className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium">
              {t.catalog.categoryLabel}
            </label>

            <select
              id="category-select"
              value={category}
              onChange={(event) =>
                updateParam("category", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-700 shadow-xs"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="max-price-input" className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium">
              {t.catalog.maxPriceLabel}: <span className="font-mono text-slate-900 font-bold">{maxPrice} €</span>
            </label>

            <input
              id="max-price-input"
              type="range"
              min="0"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(event) =>
                updateParam("maxPrice", event.target.value)
              }
              className="w-full accent-sky-700 h-2 cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="sort-select" className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium">
              {t.catalog.sortLabel}
            </label>

            <select
              id="sort-select"
              value={sort}
              onChange={(event) =>
                updateParam("sort", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-700 shadow-xs"
            >
              <option value="default">{t.catalog.sortDefault}</option>

              <option value="price-low">{t.catalog.sortPriceLow}</option>

              <option value="price-high">{t.catalog.sortPriceHigh}</option>

              <option value="name-asc">{t.catalog.sortNameAsc}</option>

              <option value="name-desc">{t.catalog.sortNameDesc}</option>
            </select>
          </div>
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <X size={15} />
            {t.catalog.resetFilters}
          </button>
        )}
      </div>

      {/* Broj rezultata */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs sm:text-sm text-slate-500">
        <p>
          {t.catalog.foundCount}:{" "}
          <span className="text-slate-900 font-semibold font-mono">
            {filteredProducts.length}
          </span>
        </p>

        {totalPages > 0 && (
          <p>
            {t.catalog.page} <span className="text-slate-900 font-mono font-semibold">{effectivePage}</span> {t.catalog.of}{" "}
            <span className="text-slate-900 font-mono font-semibold">{totalPages}</span>
          </p>
        )}
      </div>

      {/* Proizvodi */}
      {paginatedProducts.length > 0 ? (
        <>
          <motion.div
            key={effectivePage + category + sort + maxPrice + search}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Paginacija"
              className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                onClick={previousPage}
                disabled={effectivePage === 1}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-4 text-xs sm:text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 text-slate-700 shadow-xs"
                aria-label="Prethodna stranica"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">{t.catalog.previousPage}</span>
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-xs sm:text-sm font-mono font-bold transition ${
                      effectivePage === pageNumber
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
                    }`}
                    aria-current={effectivePage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={nextPage}
                disabled={effectivePage === totalPages}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-4 text-xs sm:text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 text-slate-700 shadow-xs"
                aria-label="Sljedeća stranica"
              >
                <span className="hidden sm:inline">{t.catalog.nextPage}</span>
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
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
