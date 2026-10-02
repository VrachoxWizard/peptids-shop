import { ChevronLeft, ChevronRight } from "lucide-react";
import type { translations } from "../../i18n/translations";

type TranslationCatalog = (typeof translations)[keyof typeof translations]["catalog"];

interface CatalogPaginationProps {
  t: TranslationCatalog;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CatalogPagination({
  t,
  currentPage,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginacija"
      className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-4 text-xs sm:text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 text-slate-700 shadow-xs"
        aria-label="Prethodna stranica"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">{t.previousPage}</span>
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`h-10 min-w-10 rounded-lg border px-3 text-xs sm:text-sm font-mono font-bold transition ${
              currentPage === pageNumber
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
            }`}
            aria-current={currentPage === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-4 text-xs sm:text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 text-slate-700 shadow-xs"
        aria-label="Sljedeća stranica"
      >
        <span className="hidden sm:inline">{t.nextPage}</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
