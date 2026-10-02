import { Banknote, Headphones, PackageCheck, Truck } from "lucide-react";
import { useTranslation } from "../../i18n/useTranslation";

export default function CroatiaTrustBadges() {
  const { t } = useTranslation();

  const trustCards = [
    {
      id: "cod",
      testId: "trust-badge-cod",
      icon: Banknote,
      title: t.croatiaTrust.codTitle,
      description: t.croatiaTrust.codDesc,
      tag: "Bez rizika",
    },
    {
      id: "delivery",
      testId: "trust-badge-delivery",
      icon: Truck,
      title: t.croatiaTrust.deliveryTitle,
      description: t.croatiaTrust.deliveryDesc,
      tag: "EU skladište",
    },
    {
      id: "discrete",
      testId: "trust-badge-discrete",
      icon: PackageCheck,
      title: t.croatiaTrust.discreteTitle,
      description: t.croatiaTrust.discreteDesc,
      tag: "Termo-zaštita",
    },
    {
      id: "support",
      testId: "trust-badge-support",
      icon: Headphones,
      title: t.croatiaTrust.supportTitle,
      description: t.croatiaTrust.supportDesc,
      tag: "Radni dan 9–17h",
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-sky-700 mb-2">
            <span>Švicarski & EU standardi</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            {t.croatiaTrust.title}
          </h2>

          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.croatiaTrust.description}
          </p>
        </div>

        {/* 4 Pillars - Swiss Horizontal Analytical Split Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
          {trustCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                data-testid={card.testId}
                className="p-6 sm:p-7 flex flex-col justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-700">
                      <Icon size={20} />
                    </div>

                    <span className="font-mono text-[11px] font-semibold text-slate-600 border border-slate-200 bg-slate-50 rounded-md px-2 py-0.5">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
