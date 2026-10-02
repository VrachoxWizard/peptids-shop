import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import BentoCategories from "../components/home/BentoCategories";
import HeroShowcase from "../components/home/HeroShowcase";
import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";

export default function Home() {
  const { t } = useTranslation();
  useDocumentTitle();
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <main>
      {/* Asymmetric Split Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24 min-h-[calc(100dvh-4rem)] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {t.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.08] text-white">
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-[55ch] leading-relaxed">
                {t.hero.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/proizvodi"
                  className="tactile-press inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20"
                >
                  {t.hero.ctaExplore}
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/kontakt"
                  className="tactile-press inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-6 py-3.5 font-medium text-zinc-200 hover:border-white/20 hover:bg-zinc-800 backdrop-blur-sm"
                >
                  <FileText size={17} className="text-zinc-400" />
                  {t.hero.ctaSpecs}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-6 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-sm sm:text-base font-bold">
                    <ShieldCheck size={16} />
                    <span>{t.hero.metricPurity}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.hero.metricPurityLabel}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-zinc-200 font-mono text-sm sm:text-base font-bold">
                    <Sparkles size={16} className="text-emerald-400" />
                    <span>{t.hero.metricLyophilized}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.hero.metricLyophilizedLabel}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-zinc-200 font-mono text-sm sm:text-base font-bold">
                    <span>{t.hero.metricCoa}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{t.hero.metricCoaLabel}</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Column */}
            <div className="lg:col-span-5">
              <HeroShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid 2.0 Kategorije */}
      <BentoCategories />

      {/* Istaknuti proizvodi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <p className="text-emerald-400 font-medium text-xs sm:text-sm tracking-wider">
              {t.featured.badge}
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1.5 sm:mt-2">
              {t.featured.title}
            </h2>

            <p className="text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-base">
              {t.featured.description}
            </p>
          </div>

          <Link
            to="/proizvodi"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-sm sm:text-base transition"
          >
            {t.featured.viewAll}
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
