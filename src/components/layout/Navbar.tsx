import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";

import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  function closeMenu() {
    setMenuOpen(false);
  }

  const isCurrent = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="font-bold text-lg sm:text-xl tracking-tight shrink-0"
          >
            PEPTIDE
            <span className="text-emerald-400">LAB</span>
          </Link>

          {/* Desktop navigacija */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
            <Link
              to="/"
              className={`transition ${
                isCurrent("/")
                  ? "text-emerald-400 font-medium"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              Početna
            </Link>

            <Link
              to="/proizvodi"
              className={`transition ${
                isCurrent("/proizvod")
                  ? "text-emerald-400 font-medium"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              Proizvodi
            </Link>

            <Link
              to="/kontakt"
              className={`transition ${
                isCurrent("/kontakt")
                  ? "text-emerald-400 font-medium"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              Kontakt
            </Link>

            <Link
              to="/kosarica"
              className={`flex items-center gap-2 transition ${
                isCurrent("/kosarica")
                  ? "text-emerald-400 font-medium"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              <ShoppingCart size={18} />

              <span>Košarica</span>

              {itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-xs font-bold text-zinc-950">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile desno */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <Link
              to="/kosarica"
              onClick={closeMenu}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 hover:bg-zinc-900 transition"
              aria-label="Košarica"
            >
              <ShoppingCart size={20} />

              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[11px] font-bold text-zinc-950">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 hover:bg-zinc-900 transition"
              aria-label={menuOpen ? "Zatvori navigaciju" : "Otvori navigaciju"}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800/80 py-3">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-lg px-3.5 py-2.5 transition ${
                  isCurrent("/")
                    ? "bg-zinc-900 text-emerald-400 font-medium"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                Početna
              </Link>

              <Link
                to="/proizvodi"
                onClick={closeMenu}
                className={`rounded-lg px-3.5 py-2.5 transition ${
                  isCurrent("/proizvod")
                    ? "bg-zinc-900 text-emerald-400 font-medium"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                Proizvodi
              </Link>

              <Link
                to="/kontakt"
                onClick={closeMenu}
                className={`rounded-lg px-3.5 py-2.5 transition ${
                  isCurrent("/kontakt")
                    ? "bg-zinc-900 text-emerald-400 font-medium"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                Kontakt
              </Link>

              <Link
                to="/kosarica"
                onClick={closeMenu}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 transition ${
                  isCurrent("/kosarica")
                    ? "bg-zinc-900 text-emerald-400 font-medium"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <ShoppingCart size={18} />
                <span>Košarica</span>
                {itemCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-xs font-bold text-zinc-950">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
