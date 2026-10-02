import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();
  useDocumentTitle(t.notFound.title);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto text-center rounded-3xl border border-white/10 bg-zinc-900/60 p-8 sm:p-12 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
          <SearchX size={32} />
        </div>

        <p className="mt-5 sm:mt-6 text-emerald-400 font-mono font-semibold text-xs sm:text-sm tracking-wider">
          {t.notFound.badge}
        </p>

        <h1 className="mt-2 sm:mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {t.notFound.title}
        </h1>

        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
          {t.notFound.description}
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            to="/"
            className="tactile-press inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 hover:bg-emerald-300 transition text-sm sm:text-base shadow-md shadow-emerald-500/20"
          >
            <ArrowLeft size={18} />
            {t.notFound.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
