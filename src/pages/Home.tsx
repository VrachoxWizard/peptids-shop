import { ArrowRight } from "lucide-react";
import { FlaskConical, TestTubeDiagonal, Beaker } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-3xl px-6">
          <p className="text-emerald-400 font-medium mb-4">RESEARCH LAB</p>

          <h1 className="text-5xl md:text-6xl font-bold">
            Istraživački spojevi nove generacije
          </h1>

          <p className="text-zinc-400 mt-6 text-lg">
            Demo katalog proizvoda namijenjenih isključivo razvoju i
            demonstraciji korisničkog sučelja.
          </p>

          <Link
            to="/proizvodi"
            className="inline-flex items-center gap-2 mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 hover:bg-emerald-300 transition"
          >
            Pregled proizvoda
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Kategorije */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-emerald-400 font-medium">KATEGORIJE</p>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Istraži kategorije
          </h2>

          <p className="text-zinc-400 mt-3">
            Brzo pronađi proizvode prema vrsti.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/proizvodi?category=Peptidi"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-emerald-400 transition"
          >
            <FlaskConical size={32} className="text-emerald-400" />

            <h3 className="text-xl font-semibold mt-5">Peptidi</h3>

            <p className="text-zinc-400 text-sm mt-2">
              Demo laboratorijski peptidi iz kataloga.
            </p>

            <span className="inline-flex items-center gap-2 mt-5 text-sm text-emerald-400">
              Pregled kategorije
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/proizvodi?category=Istraživački%20spojevi"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-emerald-400 transition"
          >
            <TestTubeDiagonal size={32} className="text-emerald-400" />

            <h3 className="text-xl font-semibold mt-5">Istraživački spojevi</h3>

            <p className="text-zinc-400 text-sm mt-2">
              Fiktivni spojevi za razvoj demo webshopa.
            </p>

            <span className="inline-flex items-center gap-2 mt-5 text-sm text-emerald-400">
              Pregled kategorije
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/proizvodi?category=Referentni%20uzorci"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-emerald-400 transition"
          >
            <Beaker size={32} className="text-emerald-400" />

            <h3 className="text-xl font-semibold mt-5">Referentni uzorci</h3>

            <p className="text-zinc-400 text-sm mt-2">
              Demo referentni uzorci za laboratorijski katalog.
            </p>

            <span className="inline-flex items-center gap-2 mt-5 text-sm text-emerald-400">
              Pregled kategorije
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* Istaknuti proizvodi */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-emerald-400 font-medium">ISTAKNUTO</p>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Istaknuti proizvodi
            </h2>

            <p className="text-zinc-400 mt-3">
              Pogledaj neke od proizvoda iz našeg demo kataloga.
            </p>
          </div>

          <Link
            to="/proizvodi"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition"
          >
            Pogledaj sve proizvode
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
