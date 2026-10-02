import {
  ArrowRight,
  Beaker,
  FlaskConical,
  TestTubeDiagonal,
} from "lucide-react";

import { Link } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

export default function Home() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <main>
      {/* Hero */}
      <section className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center py-12 sm:py-20">
        <div className="text-center max-w-3xl px-4 sm:px-6">
          <p className="text-emerald-400 font-medium mb-3 sm:mb-4 text-xs sm:text-sm tracking-wider">
            RESEARCH LAB
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Istraživački spojevi nove generacije
          </h1>

          <p className="text-zinc-400 mt-4 sm:mt-6 text-base sm:text-lg">
            Demo katalog proizvoda namijenjenih isključivo razvoju i
            demonstraciji korisničkog sučelja.
          </p>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              to="/proizvodi"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 hover:bg-emerald-300 transition"
            >
              Pregled proizvoda
              <ArrowRight size={18} />
            </Link>
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
