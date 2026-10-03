import { CheckCircle2, Download, FileText, Printer, Shield, X } from "lucide-react";
import type { Product } from "../../types/product";
import { useTranslation } from "../../i18n/useTranslation";

interface CoAModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function CoAModal({ isOpen, onClose, product }: CoAModalProps) {
  const { language } = useTranslation();

  if (!isOpen) return null;

  const batchNumber = product.currentBatch?.batchNumber || `LOT-2026-${product.slug.slice(0, 3).toUpperCase()}-01`;
  const purity = product.purity || "≥99.2% (HPLC)";
  const today = new Date().toISOString().split("T")[0];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-950">
                {language === "en" ? "Certificate of Analysis (CoA)" : "Certifikat analize (CoA)"}
              </h2>
              <p className="text-xs font-mono text-slate-500">Ref: {batchNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-950 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              title={language === "en" ? "Print / Save PDF" : "Ispis / Spremi PDF"}
            >
              <Printer size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate Paper Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 text-xs sm:text-sm print:p-0">
          {/* Lab Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-slate-950 tracking-tight">
                <Shield className="w-5 h-5 text-sky-800" />
                <span>PeptideLab Analytical Services</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Swiss Quality Standards • HPLC & ESI-MS High Resolution Testing
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-600">
              <span className="font-semibold block text-slate-900">CERT-AN-2026</span>
              <span>ISO 9001:2015 Compliant</span>
            </div>
          </div>

          {/* Compound Specifications Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {language === "en" ? "Sample Identification" : "Identifikacija uzorka"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Naziv spoja:</span>
                <span className="font-semibold text-slate-950">{product.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Serija (Batch):</span>
                <span className="font-mono font-bold text-sky-900">{batchNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">CAS broj:</span>
                <span className="font-mono text-slate-800">{product.casNumber || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Molekularna masa:</span>
                <span className="font-mono text-slate-800">{product.molecularWeight || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Količina u bočici:</span>
                <span className="font-mono text-slate-800">{product.amount}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Datum analize:</span>
                <span className="font-mono text-slate-800">{today}</span>
              </div>
            </div>
          </div>

          {/* Analytical Test Results Table */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {language === "en" ? "Analytical Assay Results" : "Rezultati analitičkog ispitivanja"}
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="bg-slate-100/70 p-2.5 grid grid-cols-3 text-[11px] font-semibold text-slate-600 font-mono">
                <span>Parametar</span>
                <span>Kriterij specifikacije</span>
                <span>Izmjereni rezultat</span>
              </div>
              <div className="p-2.5 grid grid-cols-3 text-xs items-center">
                <span className="font-medium text-slate-900">Izgled liofilizata</span>
                <span className="text-slate-500">Bijeli homogeni prah</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} /> Odgovara
                </span>
              </div>
              <div className="p-2.5 grid grid-cols-3 text-xs items-center">
                <span className="font-medium text-slate-900">HPLC Čistoća</span>
                <span className="text-slate-500">≥ 98.0%</span>
                <span className="font-mono font-bold text-sky-800 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600" /> {purity}
                </span>
              </div>
              <div className="p-2.5 grid grid-cols-3 text-xs items-center">
                <span className="font-medium text-slate-900">Masena spektrometrija (MS)</span>
                <span className="text-slate-500">Teorijska ± 1 Da</span>
                <span className="font-mono text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Potvrđeno
                </span>
              </div>
              <div className="p-2.5 grid grid-cols-3 text-xs items-center">
                <span className="font-medium text-slate-900">Bakterijski endotoksini</span>
                <span className="text-slate-500">&lt; 0.05 EU/mg</span>
                <span className="font-mono text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> &lt; 0.01 EU/mg
                </span>
              </div>
            </div>
          </div>

          {/* Visual HPLC Chromatogram Representation */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-slate-700 uppercase">
                RP-HPLC Chromatogram (214 nm)
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Peak Area: 99.42%
              </span>
            </div>
            {/* Stylized vector SVG chromatogram */}
            <div className="h-28 w-full bg-white rounded-lg border border-slate-200 p-2 flex items-end">
              <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
                {/* Baseline grid */}
                <line x1="0" y1="90" x2="500" y2="90" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="200" y1="10" x2="200" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="350" y1="10" x2="350" y2="90" stroke="#f1f5f9" strokeWidth="1" />

                {/* Main sharp peptide peak at RT=11.4 min */}
                <path
                  d="M 0 90 L 150 90 Q 185 89 215 88 L 240 10 L 250 88 Q 280 89 320 90 L 500 90"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <circle cx="240" cy="10" r="3" fill="#0369a1" />
                <text x="248" y="20" fontSize="9" fill="#0369a1" fontFamily="monospace">
                  RT: 11.42 min
                </text>
              </svg>
            </div>
          </div>

          {/* Signoff & Seal */}
          <div className="flex items-end justify-between border-t border-slate-200 pt-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">Status verifikacije:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={14} /> Odobreno za laboratorijska istraživanja (RUO)
              </span>
            </div>
            <div className="text-right">
              <div className="font-serif italic font-bold text-slate-800 text-sm">
                Dr. sc. M. Horvat, mag. pharm.
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                Voditelj analitičke kontrole kvalitete
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 rounded-b-2xl">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download size={15} />
            <span>{language === "en" ? "Download / Print CoA" : "Preuzmi / Ispiši certifikat"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
