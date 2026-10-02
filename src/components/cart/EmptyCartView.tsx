import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { translations } from "../../i18n/translations";

type TranslationCart = (typeof translations)[keyof typeof translations]["cart"];

interface EmptyCartViewProps {
  tCart: TranslationCart;
}

export default function EmptyCartView({ tCart }: EmptyCartViewProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
          <ShoppingCart size={28} />
        </div>

        <h1 className="font-serif mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {tCart.emptyTitle}
        </h1>

        <p className="mt-2.5 text-sm text-slate-600">{tCart.emptyDesc}</p>

        <Link
          to="/proizvodi"
          className="tactile-press mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 text-sm shadow-xs"
        >
          {tCart.viewCatalog}
        </Link>
      </div>
    </main>
  );
}
