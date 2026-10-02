import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-xl mx-auto text-center">
        <SearchX size={56} className="mx-auto text-emerald-400" />

        <p className="mt-6 text-emerald-400 font-medium">GREŠKA 404</p>

        <h1 className="mt-3 text-4xl md:text-5xl font-bold">
          Stranica nije pronađena
        </h1>

        <p className="mt-4 text-zinc-400">
          Stranica koju tražiš ne postoji ili je premještena.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 hover:bg-emerald-300 transition"
        >
          <ArrowLeft size={18} />
          Povratak na početnu
        </Link>
      </div>
    </main>
  );
}
