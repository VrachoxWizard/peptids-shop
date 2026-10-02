import { ArrowRight, Beaker, CheckCircle2, FlaskConical, Shield, TestTubeDiagonal } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";

export default function BentoCategories() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t.bento.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white mt-2">
            {t.bento.title}
          </h2>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
            {t.bento.description}
          </p>
        </div>

        <Link
          to="/proizvodi"
          className="tactile-press inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
        >
          {t.bento.viewAll}
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Bento Grid 2.0 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Tile 1: Hero Bento Card (Peptidi) - Spans 2 Columns on LG */}
        <Link
          to="/proizvodi?category=Peptidi"
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-7 sm:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl lg:col-span-2 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.15)] flex flex-col justify-between min-h-[300px]"
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

          {/* Top Row: Icon + Badge */}
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 shadow-lg backdrop-blur">
              <FlaskConical size={28} />
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/60 px-3.5 py-1 font-mono text-xs font-medium text-emerald-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>{t.bento.purityTag}</span>
            </div>
          </div>

          {/* Center Info */}
          <div className="my-6">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition">
              {t.bento.peptidesTitle}
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
              {t.bento.peptidesDesc}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-medium text-zinc-400">
            <span className="font-mono text-zinc-500">{t.bento.peptidesCount}</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
              {t.bento.peptidesAction}
              <ArrowRight size={15} />
            </span>
          </div>
        </Link>

        {/* Tile 2: Vertical Metric Card (Istraživački spojevi) - Spans 1 Column */}
        <Link
          to="/proizvodi?category=Istraživački%20spojevi"
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.15)] flex flex-col justify-between min-h-[300px]"
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

          {/* Top Row: Icon + Status */}
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-950/40 text-violet-400 shadow-lg backdrop-blur">
              <TestTubeDiagonal size={28} />
            </div>

            <span className="font-mono text-[11px] font-semibold text-violet-300 rounded-full border border-violet-500/30 bg-violet-950/40 px-2.5 py-1">
              {t.bento.compoundsBadge}
            </span>
          </div>

          {/* Center Info */}
          <div className="my-6">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-violet-300 transition">
              {t.bento.compoundsTitle}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {t.bento.compoundsDesc}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-medium text-zinc-400">
            <span className="font-mono text-zinc-500">{t.bento.compoundsCount}</span>
            <span className="inline-flex items-center gap-1.5 text-violet-400 font-semibold group-hover:translate-x-1 transition-transform">
              {t.bento.compoundsAction}
              <ArrowRight size={15} />
            </span>
          </div>
        </Link>

        {/* Tile 3: Wide Horizon Card (Referentni uzorci) - Spans Full Width */}
        <Link
          to="/proizvodi?category=Referentni%20uzorci"
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-7 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl lg:col-span-3 transition-all duration-300 hover:border-sky-500/40 hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.15)]"
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute right-12 bottom-0 h-48 w-96 rounded-full bg-sky-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-400 shadow-lg backdrop-blur">
                <Beaker size={28} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sky-300 transition">
                    {t.bento.referenceTitle}
                  </h3>
                  <span className="hidden sm:inline-flex rounded-full border border-sky-500/30 bg-sky-950/40 px-2.5 py-0.5 font-mono text-[10px] text-sky-300">
                    {t.bento.referenceBadge}
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                  {t.bento.referenceDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden xl:flex items-center gap-2 rounded-xl border border-white/5 bg-zinc-950/60 px-3.5 py-2 font-mono text-xs text-zinc-400">
                <Shield size={14} className="text-sky-400" />
                <span>{t.bento.referenceCas}</span>
              </div>

              <span className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 group-hover:bg-sky-300 transition shadow-md">
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
