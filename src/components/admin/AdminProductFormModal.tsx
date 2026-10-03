import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { AdminCreateProductInput, AdminProduct } from "../../services/adminApi";

interface AdminProductFormModalProps {
  isOpen: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSave: (data: AdminCreateProductInput, id?: number) => Promise<void>;
  isSaving: boolean;
}

function AdminProductFormModalContent({
  product,
  onClose,
  onSave,
  isSaving,
}: {
  product: AdminProduct | null;
  onClose: () => void;
  onSave: (data: AdminCreateProductInput, id?: number) => Promise<void>;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<AdminCreateProductInput>(() => {
    if (product) {
      return {
        slug: product.slug,
        nameHr: product.nameHr,
        nameEn: product.nameEn || "",
        category: product.category,
        categoryEn: product.categoryEn || "",
        descriptionHr: product.descriptionHr,
        descriptionEn: product.descriptionEn || "",
        amount: product.amount,
        price: product.price,
        imageUrl: product.imageUrl || "",
        featured: product.featured,
        purity: product.purity || "",
        casNumber: product.casNumber || "",
        molecularWeight: product.molecularWeight || "",
        isActive: product.isActive,
      };
    }
    return {
      slug: "",
      nameHr: "",
      nameEn: "",
      category: "Regeneracija i oporavak",
      categoryEn: "Recovery & Tissue Repair",
      descriptionHr: "",
      descriptionEn: "",
      amount: "5mg",
      price: 49,
      imageUrl: "",
      featured: false,
      purity: "≥99.0% (HPLC)",
      casNumber: "",
      molecularWeight: "",
      isActive: true,
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function generateSlug() {
    if (!formData.nameHr) return;
    const generated = formData.nameHr
      .toLowerCase()
      .trim()
      .replace(/[čć]/g, "c")
      .replace(/đ/g, "dj")
      .replace(/š/g, "s")
      .replace(/ž/g, "z")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: generated }));
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!formData.nameHr.trim()) errors.nameHr = "Naziv na hrvatskom je obavezan.";
    if (!formData.slug.trim()) {
      errors.slug = "Slug je obavezan.";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = "Slug smije sadržavati samo mala slova, brojeve i crtice.";
    }
    if (!formData.category.trim()) errors.category = "Kategorija je obavezna.";
    if (!formData.amount.trim()) errors.amount = "Doza/količina je obavezna.";
    if (isNaN(formData.price) || formData.price <= 0) {
      errors.price = "Cijena mora biti pozitivan broj.";
    }
    if (!formData.descriptionHr.trim()) {
      errors.descriptionHr = "Opis artikla na hrvatskom je obavezan.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData, product ? product.id : undefined);
  }

  const isEdit = Boolean(product);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 id="product-modal-title" className="text-base font-bold text-slate-900">
              {isEdit ? `Uredi artikl: ${product?.nameHr}` : "Dodaj novi peptidni artikl"}
            </h2>
            <p className="text-xs text-slate-500">
              Popunite podatke o artiklu za prikaz u katalogu i povezivanje sa serijama
            </p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Naziv i Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Naziv na hrvatskom <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nameHr}
                onChange={(e) => setFormData({ ...formData, nameHr: e.target.value })}
                placeholder="npr. BPC-157 5mg"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {formErrors.nameHr && (
                <p className="text-xs text-rose-500 mt-1">{formErrors.nameHr}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Slug (URL identifikator) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-[11px] text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Generiraj iz naziva
                </button>
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                placeholder="npr. bpc-157-5mg"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {formErrors.slug && (
                <p className="text-xs text-rose-500 mt-1">{formErrors.slug}</p>
              )}
            </div>
          </div>

          {/* Kategorija i Doza */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategorija <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="npr. Regeneracija i oporavak tkiva"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {formErrors.category && (
                <p className="text-xs text-rose-500 mt-1">{formErrors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Doza / Količina <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="npr. 5mg"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {formErrors.amount && (
                <p className="text-xs text-rose-500 mt-1">{formErrors.amount}</p>
              )}
            </div>
          </div>

          {/* Cijena, Čistoća i CAS broj */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cijena (€) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {formErrors.price && (
                <p className="text-xs text-rose-500 mt-1">{formErrors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Čistoća
              </label>
              <input
                type="text"
                value={formData.purity || ""}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                placeholder="npr. ≥99.2% (HPLC)"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CAS Broj
              </label>
              <input
                type="text"
                value={formData.casNumber || ""}
                onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
                placeholder="npr. 137525-51-0"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Molekularna masa i Slika URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Molekularna masa
              </label>
              <input
                type="text"
                value={formData.molecularWeight || ""}
                onChange={(e) => setFormData({ ...formData, molecularWeight: e.target.value })}
                placeholder="npr. 1419.53 g/mol"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Putanja / URL slike
              </label>
              <input
                type="text"
                value={formData.imageUrl || ""}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="npr. /peptides/bpc-157.png"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Opis HR */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Opis artikla na hrvatskom <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.descriptionHr}
              onChange={(e) => setFormData({ ...formData, descriptionHr: e.target.value })}
              placeholder="Detaljan opis peptida, namjene za in vitro istraživanje, svojstva..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {formErrors.descriptionHr && (
              <p className="text-xs text-rose-500 mt-1">{formErrors.descriptionHr}</p>
            )}
          </div>

          {/* Checkboxes: Featured i Active */}
          <div className="flex flex-wrap items-center gap-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
              />
              <span>Istaknuti proizvod na početnoj stranici (Featured)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
              />
              <span>Aktivan u katalogu (vidljiv kupcima)</span>
            </label>
          </div>

          {/* Footer gumbi */}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Spremanje..." : isEdit ? "Ažuriraj artikl" : "Spremi novi artikl"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProductFormModal(props: AdminProductFormModalProps) {
  if (!props.isOpen) return null;
  return (
    <AdminProductFormModalContent
      key={props.product ? props.product.id : "new"}
      product={props.product}
      onClose={props.onClose}
      onSave={props.onSave}
      isSaving={props.isSaving}
    />
  );
}
