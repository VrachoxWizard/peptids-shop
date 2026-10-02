import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";

import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="font-bold text-xl">
            PEPTIDE
            <span className="text-emerald-400">LAB</span>
          </Link>

          {/* Desktop navigacija */}
          <div className="hidden md:flex items-center gap-7 text-sm">
            <Link to="/" className="text-zinc-300 hover:text-white transition">
              Početna
            </Link>

            <Link
              to="/proizvodi"
              className="text-zinc-300 hover:text-white transition"
            >
              Proizvodi
            </Link>

            <Link
              to="/kontakt"
              className="text-zinc-300 hover:text-white transition"
            >
              Kontakt
            </Link>

            <Link
              to="/kosarica"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
            >
              <ShoppingCart size={18} />

              <span>Košarica</span>

              {itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-xs font-bold text-zinc-950">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile desno */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/kosarica"
              onClick={closeMenu}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800"
              aria-label="Košarica"
            >
              <ShoppingCart size={20} />

              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-xs font-bold text-zinc-950">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 hover:bg-zinc-900 transition"
              aria-label="Otvori navigaciju"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800 py-4">
            <div className="flex flex-col">
              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
              >
                Početna
              </Link>

              <Link
                to="/proizvodi"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
              >
                Proizvodi
              </Link>

              <Link
                to="/kontakt"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
              >
                Kontakt
              </Link>

              <Link
                to="/kosarica"
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
              >
                <ShoppingCart size={18} />
                Košarica
                {itemCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-xs font-bold text-zinc-950">
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
