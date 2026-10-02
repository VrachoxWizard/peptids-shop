import { useMemo, useState } from "react";
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

const PRODUCTS_PER_PAGE = 6;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "Sve";
  const sort = searchParams.get("sort") || "default";
  const maxPrice = Number(searchParams.get("maxPrice") || 100);

  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    "Sve",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  function updateParam(key: string, value: string) {
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
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue) ||
          product.description.toLowerCase().includes(searchValue) ||
          product.category.toLowerCase().includes(searchValue),
      );
    }

    if (category !== "Sve") {
      result = result.filter((product) => product.category === category);
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
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [search, category, sort, maxPrice]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  function resetFilters() {
    setSearchParams({});
    setCurrentPage(1);
  }

  function previousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function nextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  const filtersActive =
    search !== "" ||
    category !== "Sve" ||
    sort !== "default" ||
    maxPrice !== 100;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          ANALITIČKI KATALOG
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white mt-2">
          Istraživački biokemijski spojevi
        </h1>

        <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-2xl">
          Pregledajte liofilizirane peptide, istraživačke spojeve i certificirane referentne uzorke sa specifikacijama čistoće.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5 sm:mb-6">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Pretraži prema nazivu, kategoriji ili CAS broju..."
          value={search}
          onChange={(event) =>
            updateParam("search", event.target.value)
          }
          className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 py-3.5 pl-11 sm:pl-12 pr-4 text-sm sm:text-base outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/80 focus:shadow-[0_0_20px_-5px_rgba(52,211,153,0.2)] backdrop-blur-md text-white"
        />
      </div>

      {/* Filteri */}
      <div className="mb-8 sm:mb-10 rounded-3xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <SlidersHorizontal size={18} className="text-emerald-400" />

          <h2 className="font-semibold text-base sm:text-lg text-white">Filteri kataloga</h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          <div>
            <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5 sm:mb-2">
              Kategorija
            </label>

            <select
              value={category}
              onChange={(event) =>
                updateParam("category", event.target.value)
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:text-base outline-none focus:border-emerald-400"
            >
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5 sm:mb-2">
              Maksimalna cijena: {maxPrice} €
            </label>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(event) =>
                updateParam("maxPrice", event.target.value)
              }
              className="w-full accent-emerald-400 h-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5 sm:mb-2">
              Sortiranje
            </label>

            <select
              value={sort}
              onChange={(event) =>
                updateParam("sort", event.target.value)
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:text-base outline-none focus:border-emerald-400"
            >
              <option value="default">Zadano</option>

              <option value="price-low">Cijena: najniža</option>

              <option value="price-high">Cijena: najviša</option>

              <option value="name-asc">Naziv: A-Z</option>

              <option value="name-desc">Naziv: Z-A</option>
            </select>
          </div>
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400 hover:text-white transition"
          >
            <X size={16} />
            Resetiraj filtere
          </button>
        )}
      </div>

      {/* Broj rezultata */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs sm:text-sm text-zinc-500">
        <p>
          Pronađeno proizvoda:{" "}
          <span className="text-white font-semibold">
            {filteredProducts.length}
          </span>
        </p>

        {totalPages > 0 && (
          <p>
            Stranica <span className="text-white">{currentPage}</span> od{" "}
            <span className="text-white">{totalPages}</span>
          </p>
        )}
      </div>

      {/* Proizvodi */}
      {paginatedProducts.length > 0 ? (
        <>
          <motion.div
            key={currentPage + category + sort + maxPrice + search}
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
                disabled={currentPage === 1}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-zinc-700 px-2.5 sm:px-4 text-xs sm:text-sm font-medium transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Prethodna stranica"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Prethodna</span>
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-xl border px-3 text-xs sm:text-sm font-medium transition ${
                      currentPage === pageNumber
                        ? "border-emerald-400 bg-emerald-400 text-zinc-950"
                        : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }`}
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-zinc-700 px-2.5 sm:px-4 text-xs sm:text-sm font-medium transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Sljedeća stranica"
              >
                <span className="hidden sm:inline">Sljedeća</span>
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-16 sm:py-20 px-4 text-center">
          <Search size={40} className="mx-auto text-zinc-600" />

          <h2 className="text-lg sm:text-xl font-semibold mt-5">
            Nema pronađenih proizvoda
          </h2>

          <p className="text-zinc-500 text-xs sm:text-sm mt-2">
            Pokušaj promijeniti pretragu ili filtere.
          </p>

          <button
            onClick={resetFilters}
            className="mt-6 rounded-lg bg-emerald-400 px-5 py-2.5 font-semibold text-zinc-950 hover:bg-emerald-300 transition text-sm"
          >
            Resetiraj filtere
          </button>
        </div>
      )}
    </main>
  );
}
