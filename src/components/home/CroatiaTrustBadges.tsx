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
      tag: "Radni dan 9-17h",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 border-b border-white/5 bg-slate-950/60 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-sky-500/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/50 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-sky-300 backdrop-blur-md mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>{t.croatiaTrust.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {t.croatiaTrust.title}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t.croatiaTrust.description}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                data-testid={card.testId}
                className="liquid-glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-950/60 text-sky-400 shadow-sm shadow-sky-500/20">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full border border-sky-500/20 bg-sky-950/40 px-2.5 py-0.5 text-[10px] font-mono text-sky-300">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
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
