import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();
  useDocumentTitle(t.notFound.title);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto text-center rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700">
          <SearchX size={28} />
        </div>

        <p className="mt-5 text-sky-700 font-mono font-semibold text-xs tracking-wider uppercase">
          {t.notFound.badge}
        </p>

        <h1 className="font-serif mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
          {t.notFound.title}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          {t.notFound.description}
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            to="/"
            className="tactile-press inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition text-sm shadow-xs"
          >
            <ArrowLeft size={16} />
            {t.notFound.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
