import React, { useState } from "react";
import { PackagePlus, X } from "lucide-react";
import type { AdminCreateBatchInput, AdminProduct } from "../../services/adminApi";

interface AdminNewBatchModalProps {
  isOpen: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSave: (data: AdminCreateBatchInput) => Promise<void>;
  isSaving: boolean;
}

function AdminNewBatchModalContent({
  product,
  onClose,
  onSave,
  isSaving,
}: {
  product: AdminProduct;
  onClose: () => void;
  onSave: (data: AdminCreateBatchInput) => Promise<void>;
  isSaving: boolean;
}) {
  const [batchNumber, setBatchNumber] = useState<string>(() => {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const prefix = product.slug.toUpperCase().split("-")[0] || "LOT";
    return `${prefix}-${year}-${randomSuffix}`;
  });
  const [stockQuantity, setStockQuantity] = useState<number>(100);
  const [purityPercentage, setPurityPercentage] = useState<string>("99.4");
  const [synthesisDate, setSynthesisDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 2);
    return expiry.toISOString().split("T")[0];
  });
  const [coaPdfUrl, setCoaPdfUrl] = useState<string>(() => {
    return `/certificates/${product.slug}-coa.pdf`;
  });
  const [isReleased, setIsReleased] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!batchNumber.trim()) {
      setError("Broj serije je obavezan.");
      return;
    }
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      setError("Zaliha ne može biti negativan broj.");
      return;
    }

    const payload: AdminCreateBatchInput = {
      productId: product.id,
      batchNumber: batchNumber.trim(),
      stockQuantity,
      purityPercentage: purityPercentage ? parseFloat(purityPercentage) : undefined,
      synthesisDate: synthesisDate || undefined,
      expiryDate: expiryDate || undefined,
      coaPdfUrl: coaPdfUrl.trim() || undefined,
      isReleased,
    };

    await onSave(payload);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="batch-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 id="batch-modal-title" className="text-sm font-bold text-slate-900">
                Nova serija za artikl
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {product.nameHr} (Trenutna zaliha: {product.stockQuantity} kom)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Zatvori prozor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Broj serije (Batch #) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="npr. BPC-2026-03"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Količina komada <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Čistoća (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={purityPercentage}
                onChange={(e) => setPurityPercentage(e.target.value)}
                placeholder="npr. 99.4"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Datum sinteze
              </label>
              <input
                type="date"
                value={synthesisDate}
                onChange={(e) => setSynthesisDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Datum isteka
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Laboratorijski CoA URL
              </label>
              <input
                type="text"
                value={coaPdfUrl}
                onChange={(e) => setCoaPdfUrl(e.target.value)}
                placeholder="/certificates/..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isReleased}
                onChange={(e) => setIsReleased(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span>Serija je puštena u promet (isReleased - odmah dostupna za narudžbe)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Unos serije..." : "Spremi seriju i dodaj zalihe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminNewBatchModal(props: AdminNewBatchModalProps) {
  if (!props.isOpen || !props.product) return null;
  return (
    <AdminNewBatchModalContent
      key={props.product.id}
      product={props.product}
      onClose={props.onClose}
      onSave={props.onSave}
      isSaving={props.isSaving}
    />
  );
}
