import { Search, SlidersHorizontal, X } from "lucide-react";
import type { translations } from "../../i18n/translations";

type TranslationCatalog = (typeof translations)[keyof typeof translations]["catalog"];

interface CategoryOption {
  value: string;
  label: string;
}

interface CatalogFiltersProps {
  t: TranslationCatalog;
  categoryOptions: CategoryOption[];
  category: string;
  sort: string;
  maxPrice: number;
  searchInput: string;
  filtersActive: boolean;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (category: string) => void;
  onPriceChange: (maxPrice: string) => void;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
}

export default function CatalogFilters({
  t,
  categoryOptions,
  category,
  sort,
  maxPrice,
  searchInput,
  filtersActive,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onResetFilters,
}: CatalogFiltersProps) {
  return (
    <>
      {/* Search Input */}
      <div className="relative mb-5 sm:mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchInput}
          onChange={onSearchChange}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 sm:pl-12 pr-4 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-700 shadow-xs"
        />
      </div>

      {/* Filter Controls Panel */}
      <div className="mb-8 sm:mb-10 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <SlidersHorizontal size={18} className="text-sky-700" />
          <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">
            {t.filtersTitle}
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category-select"
              className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium"
            >
              {t.categoryLabel}
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-700 shadow-xs"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <label
              htmlFor="max-price-input"
              className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium"
            >
              {t.maxPriceLabel}:{" "}
              <span className="font-mono text-slate-900 font-bold">
                {maxPrice} €
              </span>
            </label>
            <input
              id="max-price-input"
              type="range"
              min="0"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-full accent-sky-700 h-2 cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div>
            <label
              htmlFor="sort-select"
              className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium"
            >
              {t.sortLabel}
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-700 shadow-xs"
            >
              <option value="default">{t.sortDefault}</option>
              <option value="price-low">{t.sortPriceLow}</option>
              <option value="price-high">{t.sortPriceHigh}</option>
              <option value="name-asc">{t.sortNameAsc}</option>
              <option value="name-desc">{t.sortNameDesc}</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        {filtersActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <X size={15} />
            {t.resetFilters}
          </button>
        )}
      </div>
    </>
  );
}
