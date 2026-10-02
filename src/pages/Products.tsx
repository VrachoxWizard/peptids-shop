import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Sve");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(100);

  const categories = [
    "Sve",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Pretraga
    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue) ||
          product.description.toLowerCase().includes(searchValue) ||
          product.category.toLowerCase().includes(searchValue),
      );
    }

    // Kategorija
    if (category !== "Sve") {
      result = result.filter((product) => product.category === category);
    }

    // Maksimalna cijena
    result = result.filter((product) => product.price <= maxPrice);

    // Sortiranje
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

  function resetFilters() {
    setSearch("");
    setCategory("Sve");
    setSort("default");
    setMaxPrice(100);
  }

  const filtersActive =
    search !== "" ||
    category !== "Sve" ||
    sort !== "default" ||
    maxPrice !== 100;

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Naslov */}
      <div className="mb-10">
        <p className="text-emerald-400 font-medium">KATALOG</p>

        <h1 className="text-4xl font-bold mt-2">Istraživački proizvodi</h1>

        <p className="text-zinc-400 mt-3">
          Demo katalog istraživačkih proizvoda.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Pretraži proizvode..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-4 outline-none transition placeholder:text-zinc-600 focus:border-emerald-400"
        />
      </div>

      {/* Filteri */}
      <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal size={18} className="text-emerald-400" />

          <h2 className="font-semibold">Filteri</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Kategorija */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Kategorija
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-400"
            >
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Cijena */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Maksimalna cijena: {maxPrice} €
            </label>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* Sortiranje */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Sortiranje
            </label>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-400"
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
            className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
          >
            <X size={16} />
            Resetiraj filtere
          </button>
        )}
      </div>

      {/* Broj rezultata */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500">
          Pronađeno proizvoda:{" "}
          <span className="text-white font-semibold">
            {filteredProducts.length}
          </span>
        </p>
      </div>

      {/* Proizvodi */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-20 text-center">
          <Search size={40} className="mx-auto text-zinc-600" />

          <h2 className="text-xl font-semibold mt-5">
            Nema pronađenih proizvoda
          </h2>

          <p className="text-zinc-500 mt-2">
            Pokušaj promijeniti pretragu ili filtere.
          </p>

          <button
            onClick={resetFilters}
            className="mt-6 rounded-lg bg-emerald-400 px-5 py-2 font-semibold text-zinc-950 hover:bg-emerald-300 transition"
          >
            Resetiraj filtere
          </button>
        </div>
      )}
    </main>
  );
}
