import { FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 sm:mt-24 border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-white"
            >
              <FlaskConical size={22} className="text-emerald-400" />
              {t.nav.brand}
              <span className="text-emerald-400">{t.nav.brandHighlight}</span>
            </Link>

            <p className="mt-3 sm:mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-zinc-500">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Navigacija */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-zinc-200">{t.footer.navTitle}</h3>

            <div className="mt-3 sm:mt-4 flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <Link
                to="/"
                className="text-zinc-400 hover:text-white transition"
              >
                {t.nav.home}
              </Link>

              <Link
                to="/proizvodi"
                className="text-zinc-400 hover:text-white transition"
              >
                {t.nav.products}
              </Link>

              <Link
                to="/kosarica"
                className="text-zinc-400 hover:text-white transition"
              >
                {t.nav.cart}
              </Link>

              <Link
                to="/kontakt"
                className="text-zinc-400 hover:text-white transition"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>

          {/* Informacije */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-zinc-200">{t.footer.infoTitle}</h3>

            <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-500">
              <p>{t.footer.info1}</p>

              <p>{t.footer.info2}</p>

              <p>{t.footer.info3}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col gap-3 border-t border-zinc-800 pt-6 text-xs sm:text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {t.footer.copyright}</p>

          <p>{t.footer.builtAs}</p>
        </div>
      </div>
    </footer>
  );
}
