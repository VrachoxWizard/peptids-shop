import { ArrowRight, Beaker, CheckCircle2, FlaskConical, TestTubeDiagonal } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";

export default function BentoCategories() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-sky-700">
            <span>{t.bento.badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2">
            {t.bento.title}
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl">
            {t.bento.description}
          </p>
        </div>

        <Link
          to="/proizvodi"
          className="tactile-press inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-800 transition"
        >
          {t.bento.viewAll}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Swiss Architectural Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tile 1: Peptidi - Spans 2 Columns on LG */}
        <Link
          to="/proizvodi?category=Peptidi"
          className="group rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between min-h-[280px] lg:col-span-2"
        >
          {/* Top Row: Icon + Badge */}
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-700">
              <FlaskConical size={24} />
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-medium text-slate-700">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>{t.bento.purityTag}</span>
            </div>
          </div>

          {/* Center Info */}
          <div className="my-5">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 group-hover:text-sky-800 transition">
              {t.bento.peptidesTitle}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
              {t.bento.peptidesDesc}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
            <span className="font-mono text-slate-500">{t.bento.peptidesCount}</span>
            <span className="inline-flex items-center gap-1.5 text-sky-700 font-semibold group-hover:translate-x-1 transition-transform">
              {t.bento.peptidesAction}
              <ArrowRight size={15} />
            </span>
          </div>
        </Link>

        {/* Tile 2: Istraživački spojevi - Spans 1 Column */}
        <Link
          to="/proizvodi?category=Istraživački%20spojevi"
          className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between min-h-[280px]"
        >
          {/* Top Row: Icon + Status */}
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
              <TestTubeDiagonal size={24} />
            </div>

            <span className="font-mono text-[11px] font-semibold text-slate-700 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1">
              {t.bento.compoundsBadge}
            </span>
          </div>

          {/* Center Info */}
          <div className="my-5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-sky-800 transition">
              {t.bento.compoundsTitle}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.bento.compoundsDesc}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
            <span className="font-mono text-slate-500">{t.bento.compoundsCount}</span>
            <span className="inline-flex items-center gap-1.5 text-sky-700 font-semibold group-hover:translate-x-1 transition-transform">
              {t.bento.compoundsAction}
              <ArrowRight size={15} />
            </span>
          </div>
        </Link>

        {/* Tile 3: Referentni uzorci - Spans Full Width */}
        <Link
          to="/proizvodi?category=Referentni%20uzorci"
          className="group rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs hover:border-slate-400 hover:shadow-md transition-all lg:col-span-3"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <Beaker size={24} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-sky-800 transition">
                    {t.bento.referenceTitle}
                  </h3>
                  <span className="hidden sm:inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                    {t.bento.referenceBadge}
                  </span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {t.bento.referenceDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white group-hover:bg-slate-800 transition shadow-xs">
                {t.bento.referenceAction}
                <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
