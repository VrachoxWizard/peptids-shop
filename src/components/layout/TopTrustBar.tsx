import { Banknote, Headphones, PackageCheck, Truck } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

export default function TopTrustBar() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-slate-100 border-b border-slate-200 text-slate-700 py-1.5 px-3 sm:px-6 relative z-50 overflow-hidden text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Scrollable trust strip on mobile */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto whitespace-nowrap py-0.5 w-full justify-start sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 font-medium">
            <Truck size={14} className="text-sky-700 shrink-0" />
            <span>{t.trustBar.shipping}</span>
          </div>

          <span className="hidden sm:inline-block h-3 w-px bg-slate-300 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 font-medium">
            <Banknote size={14} className="text-sky-700 shrink-0" />
            <span className="font-semibold text-slate-900">{t.trustBar.payment}</span>
          </div>

          <span className="hidden sm:inline-block h-3 w-px bg-slate-300 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 font-medium">
            <PackageCheck size={14} className="text-sky-700 shrink-0" />
            <span>{t.trustBar.discrete}</span>
          </div>

          <span className="hidden md:inline-block h-3 w-px bg-slate-300 shrink-0" aria-hidden="true" />

          <div className="hidden md:flex items-center gap-1.5 shrink-0 text-slate-600">
            <Headphones size={14} className="text-sky-700 shrink-0" />
            <span>{t.trustBar.support}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
