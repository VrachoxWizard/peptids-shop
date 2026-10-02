import { FlaskConical, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/useTranslation";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 sm:mt-24 border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Top Colophon Block: Entity & Direct Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-200">
          <div className="lg:col-span-5 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-serif font-bold tracking-tight text-slate-950"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700">
                <FlaskConical size={18} />
              </div>
              <span>{t.nav.brand}</span>
              <span className="text-sky-700 font-sans font-extrabold text-sm uppercase tracking-wider">
                {t.nav.brandHighlight}
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              {t.footer.brandDesc}
            </p>

            <div className="pt-2 font-mono text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">
                {t.footer.distributionCenter}
              </p>
              <p>
                {t.footer.customerSupport}{" "}
                <strong className="text-slate-900">+385 1 4828 111</strong>{" "}
                {t.footer.workingHours}
              </p>
              <p>Email: podrska@peptidelab.hr</p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Inline Navigation & Section Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs sm:text-sm font-medium">
              <Link to="/" className="text-slate-700 hover:text-sky-800 transition">
                {t.nav.home}
              </Link>
              <Link to="/proizvodi" className="text-slate-700 hover:text-sky-800 transition">
                {t.nav.products}
              </Link>
              <Link to="/kosarica" className="text-slate-700 hover:text-sky-800 transition">
                {t.nav.cart}
              </Link>
              <Link to="/kontakt" className="text-slate-700 hover:text-sky-800 transition">
                {t.nav.contact}
              </Link>
            </div>

            {/* Courier & Payment Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {t.footer.deliveryPartners}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-bold text-slate-800 shadow-xs">
                    GLS Hrvatska
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-bold text-slate-800 shadow-xs">
                    DPD Croatia
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                    {t.footer.parcelLockers}
                  </span>
                </div>
              </div>

              <div>
                <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {t.footer.paymentPartners}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-bold text-emerald-800">
                    {t.footer.codPartner}
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-bold text-slate-800 shadow-xs">
                    Keks Pay
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                    Aircash
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600">
                    Visa / Mastercard
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600">
                    {t.footer.bankSlip}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Research Notice / Disclaimer */}
        <div className="py-6 border-b border-slate-200">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 leading-relaxed">
            <ShieldAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">{t.footer.regulatoryTitle}</strong>
              {t.footer.regulatoryBody}
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} PeptideLab d.o.o. {t.footer.rightsReserved} Zagreb, Hrvatska.</p>
          <p className="font-mono text-[11px] text-slate-400">
            Swiss & EU Pharma Research Standards · ISO 9001:2015 Compliant HPLC
          </p>
        </div>
      </div>
    </footer>
  );
}
