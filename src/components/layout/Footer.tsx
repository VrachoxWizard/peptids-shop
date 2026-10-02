import { FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold"
            >
              <FlaskConical size={22} className="text-emerald-400" />
              PEPTIDE
              <span className="text-emerald-400">LAB</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
              Demo frontend katalog za prikaz modernog laboratorijskog i
              istraživačkog webshop sučelja.
            </p>
          </div>

          {/* Navigacija */}
          <div>
            <h3 className="font-semibold">Navigacija</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="text-zinc-500 hover:text-white transition"
              >
                Početna
              </Link>

              <Link
                to="/proizvodi"
                className="text-zinc-500 hover:text-white transition"
              >
                Proizvodi
              </Link>

              <Link
                to="/kosarica"
                className="text-zinc-500 hover:text-white transition"
              >
                Košarica
              </Link>

              <Link
                to="/kontakt"
                className="text-zinc-500 hover:text-white transition"
              >
                Kontakt
              </Link>
            </div>
          </div>

          {/* Informacije */}
          <div>
            <h3 className="font-semibold">Informacije</h3>

            <div className="mt-4 space-y-3 text-sm text-zinc-500">
              <p>Demo aplikacija za razvoj korisničkog sučelja.</p>

              <p>Kupnja i stvarna narudžba nisu omogućene.</p>

              <p>Svi proizvodi u katalogu su fiktivni demo podaci.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-zinc-800 pt-6 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} PeptideLab Demo</p>

          <p>Izrađeno kao frontend projekt.</p>
        </div>
      </div>
    </footer>
  );
}
