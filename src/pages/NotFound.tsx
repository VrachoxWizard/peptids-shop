import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto text-center">
        <SearchX size={52} className="mx-auto text-emerald-400" />

        <p className="mt-5 sm:mt-6 text-emerald-400 font-medium text-xs sm:text-sm tracking-wider">
          GREŠKA 404
        </p>

        <h1 className="mt-2 sm:mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Stranica nije pronađena
        </h1>

        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-400">
          Stranica koju tražiš ne postoji ili je premještena.
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 hover:bg-emerald-300 transition text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            Povratak na početnu
          </Link>
        </div>
      </div>
    </main>
  );
}
