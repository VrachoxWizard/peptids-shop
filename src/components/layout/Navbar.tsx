import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Menu, ShoppingCart, X } from "lucide-react";
import { motion } from "motion/react";

import { useCartStore } from "../../store/cartStore";
import { useTranslation } from "../../i18n/useTranslation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="font-bold text-lg sm:text-xl tracking-tight shrink-0 flex items-center gap-1.5"
          >
            <span>{t.nav.brand}</span>
            <span className="text-emerald-400 font-extrabold">{t.nav.brandHighlight}</span>
          </Link>

          {/* Desktop navigacija */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
            <Link
              to="/"
              className={`transition font-medium ${
                isCurrent("/")
                  ? "text-emerald-400"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {t.nav.home}
            </Link>

            <Link
              to="/proizvodi"
              className={`transition font-medium ${
                isCurrent("/proizvod")
                  ? "text-emerald-400"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {t.nav.products}
            </Link>

            <Link
              to="/kontakt"
              className={`transition font-medium ${
                isCurrent("/kontakt")
                  ? "text-emerald-400"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {t.nav.contact}
            </Link>

            <Link
              to="/kosarica"
              className={`flex items-center gap-2 transition font-medium ${
                isCurrent("/kosarica")
                  ? "text-emerald-400"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              <ShoppingCart size={17} />
              <span>{t.nav.cart}</span>

              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 font-mono text-[11px] font-bold text-zinc-950 shadow-sm shadow-emerald-500/30"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Language Switcher Desktop */}
            <div className="flex items-center rounded-full border border-white/10 bg-zinc-900/80 p-0.5 text-xs font-mono backdrop-blur-md">
              <button
                type="button"
                onClick={() => setLanguage("hr")}
                className={`rounded-full px-2.5 py-1 font-semibold transition ${
                  language === "hr"
                    ? "bg-emerald-400 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                HR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-2.5 py-1 font-semibold transition ${
                  language === "en"
                    ? "bg-emerald-400 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile desno */}
          <div className="flex md:hidden items-center gap-2">
            {/* Language Switcher Mobile */}
            <button
              type="button"
              onClick={() => setLanguage(language === "hr" ? "en" : "hr")}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/80 px-2.5 text-xs font-mono font-bold text-emerald-400"
              aria-label={t.nav.toggleLang}
            >
              <Globe size={14} />
              <span>{language.toUpperCase()}</span>
            </button>

            <Link
              to="/kosarica"
              onClick={closeMenu}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-zinc-300 transition"
              aria-label={t.nav.cart}
            >
              <ShoppingCart size={18} />

              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-emerald-400 px-1 font-mono text-[10px] font-bold text-zinc-950"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-zinc-300 transition"
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-3">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-xl px-3.5 py-2.5 transition font-medium ${
                  isCurrent("/")
                    ? "bg-zinc-900 text-emerald-400"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {t.nav.home}
              </Link>

              <Link
                to="/proizvodi"
                onClick={closeMenu}
                className={`rounded-xl px-3.5 py-2.5 transition font-medium ${
                  isCurrent("/proizvod")
                    ? "bg-zinc-900 text-emerald-400"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {t.nav.products}
              </Link>

              <Link
                to="/kontakt"
                onClick={closeMenu}
                className={`rounded-xl px-3.5 py-2.5 transition font-medium ${
                  isCurrent("/kontakt")
                    ? "bg-zinc-900 text-emerald-400"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {t.nav.contact}
              </Link>

              <Link
                to="/kosarica"
                onClick={closeMenu}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 transition font-medium ${
                  isCurrent("/kosarica")
                    ? "bg-zinc-900 text-emerald-400"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <ShoppingCart size={18} />
                <span>{t.nav.cart}</span>
                {itemCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-xs font-bold text-zinc-950 font-mono">
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
