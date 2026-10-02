import { CheckCircle2, ShieldCheck } from "lucide-react";
import ProductVisual from "../product/ProductVisual";
import { useTranslation } from "../../i18n/useTranslation";

export default function HeroShowcase() {
  const { t, language } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Swiss Pharma Specimen Card */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        {/* Top header strip */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-700 uppercase">
              {t.hero.showcaseBadge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700 font-medium">
            <ShieldCheck size={14} className="text-sky-700" />
            <span>{t.hero.showcasePurity}</span>
          </div>
        </div>

        {/* Visual centerpiece */}
        <div className="my-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 p-2">
          <ProductVisual
            name="BPC-157 Arginate"
            category={language === "en" ? "Peptides" : "Peptidi"}
            amount="10 mg"
            image="/images/products/bpc-157-arginate.jpg"
            large
          />
        </div>

        {/* Technical Specification Strip - Flat Swiss Table Layout */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-3 text-center">
          <div className="px-2">
            <span className="block font-mono text-[10px] uppercase text-slate-400 tracking-wider">
              {t.hero.casNumber}
            </span>
            <span className="mt-1 block font-mono text-xs font-semibold text-slate-800 tabular-nums">
              137525-51-0
            </span>
          </div>

          <div className="px-2">
            <span className="block font-mono text-[10px] uppercase text-slate-400 tracking-wider">
              {t.hero.format}
            </span>
            <span className="mt-1 block font-mono text-xs font-semibold text-slate-800">
              {t.hero.formatValue}
            </span>
          </div>

          <div className="px-2">
            <span className="block font-mono text-[10px] uppercase text-slate-400 tracking-wider">
              {t.hero.storage}
            </span>
            <span className="mt-1 block font-mono text-xs font-semibold text-sky-800">
              {t.hero.storageValue}
            </span>
          </div>
        </div>

        {/* Bottom certification row */}
        <div className="mt-3.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400">{t.hero.batch}:</span>
            <strong className="text-slate-900 font-semibold">2026-BPC-157</strong>
          </div>
          <div className="flex items-center gap-1 text-sky-700 font-medium">
            <CheckCircle2 size={14} />
            <span className="text-[11px]">{t.hero.coaAvailable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
