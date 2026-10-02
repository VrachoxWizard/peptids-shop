import {
  ArrowRight,
  Beaker,
  FileText,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  TestTubeDiagonal,
} from "lucide-react";

import { Link } from "react-router-dom";

import HeroShowcase from "../components/home/HeroShowcase";
import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

export default function Home() {
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
                  LABORATORIJSKI STANDARD ČISTOĆE ≥ 99%
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.08] text-white">
                Precizni biokemijski spojevi za istraživanja
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-[55ch] leading-relaxed">
                Katalog visokopročišćenih liofiliziranih peptida i referentnih analitičkih standarda. Svaka serija popraćena je HPLC kromatografskim profilom i masenom spektrometrijom.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/proizvodi"
                  className="tactile-press inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20"
                >
                  Istraži katalog
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/kontakt"
                  className="tactile-press inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-6 py-3.5 font-medium text-zinc-200 hover:border-white/20 hover:bg-zinc-800 backdrop-blur-sm"
                >
                  <FileText size={17} className="text-zinc-400" />
                  Zatraži specifikacije
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-6 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-sm sm:text-base font-bold">
                    <ShieldCheck size={16} />
                    <span>≥99%</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">HPLC Čistoća</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-zinc-200 font-mono text-sm sm:text-base font-bold">
                    <Sparkles size={16} className="text-emerald-400" />
                    <span>Liofilizirano</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">Zaštićen integritet</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-zinc-200 font-mono text-sm sm:text-base font-bold">
                    <span>COA</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">Verificirana serija</p>
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

      {/* Kategorije */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <p className="text-emerald-400 font-medium text-xs sm:text-sm tracking-wider">
            KATEGORIJE
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1.5 sm:mt-2">
            Istraži kategorije
          </h2>

          <p className="text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-base">
            Brzo pronađi proizvode prema vrsti.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <Link
            to="/proizvodi?category=Peptidi"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 hover:border-emerald-400 transition"
          >
            <FlaskConical size={32} className="text-emerald-400" />

            <h3 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-5">
              Peptidi
            </h3>

            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              Demo laboratorijski peptidi iz kataloga.
            </p>

            <span className="inline-flex items-center gap-2 mt-4 sm:mt-5 text-xs sm:text-sm text-emerald-400 font-medium">
              Pregled kategorije
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/proizvodi?category=Istraživački%20spojevi"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 hover:border-emerald-400 transition"
          >
            <TestTubeDiagonal size={32} className="text-emerald-400" />

            <h3 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-5">
              Istraživački spojevi
            </h3>

            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              Fiktivni spojevi za razvoj demo webshopa.
            </p>

            <span className="inline-flex items-center gap-2 mt-4 sm:mt-5 text-xs sm:text-sm text-emerald-400 font-medium">
              Pregled kategorije
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/proizvodi?category=Referentni%20uzorci"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 hover:border-emerald-400 transition"
          >
            <Beaker size={32} className="text-emerald-400" />

            <h3 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-5">
              Referentni uzorci
            </h3>

            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              Demo referentni uzorci za laboratorijski katalog.
            </p>

            <span className="inline-flex items-center gap-2 mt-4 sm:mt-5 text-xs sm:text-sm text-emerald-400 font-medium">
              Pregled kategorije
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* Istaknuti proizvodi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <p className="text-emerald-400 font-medium text-xs sm:text-sm tracking-wider">
              ISTAKNUTO
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1.5 sm:mt-2">
              Istaknuti proizvodi
            </h2>

            <p className="text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-base">
              Odabrani proizvodi iz našeg demo kataloga.
            </p>
          </div>

          <Link
            to="/proizvodi"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-sm sm:text-base transition"
          >
            Pogledaj sve proizvode
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
