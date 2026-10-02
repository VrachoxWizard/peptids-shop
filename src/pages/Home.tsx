import {
  ArrowRight,
  CheckCircle2,
  FileText,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import BentoCategories from "../components/home/BentoCategories";
import CroatiaTrustBadges from "../components/home/CroatiaTrustBadges";
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
    <main className="bg-white text-slate-900">
      {/* Swiss Pharma Asymmetrical Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 rounded-md shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.08]">
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-[55ch] leading-relaxed">
                {t.hero.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/proizvodi"
                  className="tactile-press inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3.5 font-semibold text-white hover:bg-slate-800 shadow-sm"
                >
                  {t.hero.ctaExplore}
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/kontakt"
                  className="tactile-press inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                >
                  <FileText size={17} className="text-slate-500" />
                  {t.hero.ctaSpecs}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-sky-700 font-mono text-sm sm:text-base font-bold tabular-nums">
                    <ShieldCheck size={16} />
                    <span>{t.hero.metricPurity}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{t.hero.metricPurityLabel}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-900 font-mono text-sm sm:text-base font-bold">
                    <FlaskConical size={16} className="text-sky-700" />
                    <span>{t.hero.metricLyophilized}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{t.hero.metricLyophilizedLabel}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-900 font-mono text-sm sm:text-base font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>{t.hero.metricCoa}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{t.hero.metricCoaLabel}</p>
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

      {/* 4 Stupa povjerenja za kupce u Hrvatskoj i regiji */}
      <CroatiaTrustBadges />

      {/* Bento Grid 2.0 Kategorije */}
      <BentoCategories />

      {/* Istaknuti proizvodi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <p className="text-sky-700 font-mono text-xs font-semibold uppercase tracking-wider">
              {t.featured.badge}
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mt-1.5">
              {t.featured.title}
            </h2>

            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl">
              {t.featured.description}
            </p>
          </div>

          <Link
            to="/proizvodi"
            className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-800 font-semibold text-sm sm:text-base transition"
          >
            {t.featured.viewAll}
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
