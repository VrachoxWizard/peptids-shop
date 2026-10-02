import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FlaskConical, Globe, Menu, ShoppingCart, X } from "lucide-react";
import { motion } from "motion/react";

import { useCartStore } from "../../store/cartStore";
import { useTranslation } from "../../i18n/useTranslation";
import TopTrustBar from "./TopTrustBar";

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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Gornja traka povjerenja za kupce u Hrvatskoj i regiji */}
      <TopTrustBar />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="font-bold text-lg sm:text-xl tracking-tight shrink-0 flex items-center gap-2 text-slate-900 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700 shadow-xs">
              <FlaskConical size={18} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 font-serif text-lg leading-tight font-bold tracking-tight text-slate-950">
                <span>{t.nav.brand}</span>
                <span className="text-sky-700 font-sans font-extrabold text-sm tracking-wider uppercase ml-0.5">
                  {t.nav.brandHighlight}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-medium hidden sm:block">
                {t.nav.standardsBadge}
              </span>
            </div>
          </Link>

          {/* Desktop navigacija */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
            <Link
              to="/"
              className={`transition font-medium py-1 ${
                isCurrent("/")
                  ? "text-sky-700 font-semibold border-b-2 border-sky-700"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {t.nav.home}
            </Link>

            <Link
              to="/proizvodi"
              className={`transition font-medium py-1 ${
                isCurrent("/proizvod")
                  ? "text-sky-700 font-semibold border-b-2 border-sky-700"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {t.nav.products}
            </Link>

            <Link
              to="/kontakt"
              className={`transition font-medium py-1 ${
                isCurrent("/kontakt")
                  ? "text-sky-700 font-semibold border-b-2 border-sky-700"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {t.nav.contact}
            </Link>

            <Link
              to="/kosarica"
              className={`flex items-center gap-2 transition font-medium py-1 ${
                isCurrent("/kosarica")
                  ? "text-sky-700 font-semibold border-b-2 border-sky-700"
                  : "text-slate-600 hover:text-slate-950"
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
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 font-mono text-[11px] font-bold text-white shadow-xs"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Language Switcher Desktop */}
            <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLanguage("hr")}
                className={`rounded-full px-2.5 py-1 font-semibold transition ${
                  language === "hr"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                HR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-2.5 py-1 font-semibold transition ${
                  language === "en"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
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
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
              aria-label={t.nav.toggleLang}
            >
              <Globe size={14} />
              <span>{language.toUpperCase()}</span>
            </button>

            <Link
              to="/kosarica"
              onClick={closeMenu}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
              aria-label={t.nav.cart}
            >
              <ShoppingCart size={18} />

              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-slate-900 px-1 font-mono text-[10px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 bg-white">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-lg px-3.5 py-2.5 transition font-medium text-sm ${
                  isCurrent("/")
                    ? "bg-sky-50 text-sky-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.home}
              </Link>

              <Link
                to="/proizvodi"
                onClick={closeMenu}
                className={`rounded-lg px-3.5 py-2.5 transition font-medium text-sm ${
                  isCurrent("/proizvod")
                    ? "bg-sky-50 text-sky-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.products}
              </Link>

              <Link
                to="/kontakt"
                onClick={closeMenu}
                className={`rounded-lg px-3.5 py-2.5 transition font-medium text-sm ${
                  isCurrent("/kontakt")
                    ? "bg-sky-50 text-sky-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.contact}
              </Link>

              <Link
                to="/kosarica"
                onClick={closeMenu}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 transition font-medium text-sm ${
                  isCurrent("/kosarica")
                    ? "bg-sky-50 text-sky-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ShoppingCart size={18} />
                <span>{t.nav.cart}</span>
                {itemCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-xs font-bold text-white font-mono">
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
