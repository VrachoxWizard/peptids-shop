import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Edit,
  Eye,
  EyeOff,
  Package,
  PackagePlus,
  Plus,
  Search,
} from "lucide-react";
import type { AdminProduct } from "../../services/adminApi";
import StockBadge from "../product/StockBadge";

interface AdminProductsManagerProps {
  products: AdminProduct[];
  isLoading: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: AdminProduct) => void;
  onAddBatch: (product: AdminProduct) => void;
  onToggleActive: (product: AdminProduct) => void;
}

export default function AdminProductsManager({
  products,
  isLoading,
  onAddProduct,
  onEditProduct,
  onAddBatch,
  onToggleActive,
}: AdminProductsManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStockFilter, setSelectedStockFilter] = useState("ALL");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = p.nameHr.toLowerCase().includes(query);
        const matchesSlug = p.slug.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesCas = p.casNumber?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesSlug && !matchesCategory && !matchesCas) {
          return false;
        }
      }

      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }

      if (selectedStockFilter === "OUT_OF_STOCK" && p.stockQuantity > 0) {
        return false;
      }
      if (selectedStockFilter === "LOW_STOCK" && (p.stockQuantity === 0 || p.stockQuantity >= 20)) {
        return false;
      }
      if (selectedStockFilter === "IN_STOCK" && p.stockQuantity < 20) {
        return false;
      }

      return true;
    });
  }, [products, search, selectedCategory, selectedStockFilter]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive).length;
    const outOfStock = products.filter((p) => p.stockQuantity === 0).length;
    const totalStock = products.reduce((acc, p) => acc + p.stockQuantity, 0);
    return { total, active, outOfStock, totalStock };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ukupno artikala</span>
            <Package className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-[11px] text-slate-400 mt-1">U bazi i CMS katalogu</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aktivno u trgovini</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-[11px] text-slate-400 mt-1">Dostupno za kupce na webu</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ukupna zaliha</span>
            <Boxes className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalStock} kom</p>
          <p className="text-[11px] text-slate-400 mt-1">Sve puštene serije skladišta</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rasprodano</span>
            <AlertTriangle className={`w-4 h-4 ${stats.outOfStock > 0 ? "text-rose-600" : "text-slate-400"}`} />
          </div>
          <p className={`text-2xl font-bold ${stats.outOfStock > 0 ? "text-rose-600" : "text-slate-900"}`}>
            {stats.outOfStock}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Potrebna nova serija / sinteza</p>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Pretraživanje */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži artikl po nazivu, slug-u ili CAS broju..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Filter kategorije */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer text-slate-700"
          >
            <option value="ALL">Sve kategorije</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Filter stanja zaliha */}
          <select
            value={selectedStockFilter}
            onChange={(e) => setSelectedStockFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer text-slate-700"
          >
            <option value="ALL">Sva stanja zalihe</option>
            <option value="IN_STOCK">Dostupno odmah (20+)</option>
            <option value="LOW_STOCK">Zadnji komadi (&lt;20)</option>
            <option value="OUT_OF_STOCK">Rasprodano (0)</option>
          </select>
        </div>

        {/* Action Button: Dodaj novi artikl */}
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Dodaj novi artikl</span>
        </button>
      </div>

      {/* Tablica artikala */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Artikl</th>
                <th className="px-4 py-3.5">Kategorija</th>
                <th className="px-4 py-3.5">Cijena</th>
                <th className="px-4 py-3.5">Zaliha skladišta</th>
                <th className="px-4 py-3.5">Aktivna serija</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Učitavanje kataloga artikala...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Nema pronađenih artikala koji odgovaraju pretrazi.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/70 transition ${
                      !p.isActive ? "bg-slate-50/40 opacity-70" : ""
                    }`}
                  >
                    {/* Artikl */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.nameHr}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 text-sm">
                              {p.nameHr}
                            </span>
                            {p.featured && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded">
                                Istaknuto
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            /{p.slug} • {p.amount}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kategorija */}
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-lg">
                        {p.category}
                      </span>
                    </td>

                    {/* Cijena */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 text-sm">
                        {p.price.toFixed(2)} €
                      </span>
                    </td>

                    {/* Zaliha */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <StockBadge stockQuantity={p.stockQuantity} />
                        <div className="text-[11px] font-mono text-slate-500">
                          {p.stockQuantity} kom na stanju
                        </div>
                      </div>
                    </td>

                    {/* Aktivna serija */}
                    <td className="px-4 py-3.5">
                      {p.currentBatch ? (
                        <div className="text-[11px] space-y-0.5">
                          <div className="font-mono font-bold text-slate-800">
                            {p.currentBatch.batchNumber}
                          </div>
                          <div className="text-slate-400">
                            {p.currentBatch.purityPercentage
                              ? `Čistoća ${p.currentBatch.purityPercentage}%`
                              : "Provjerena čistoća"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">
                          Nema unesene serije
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Vidljivo kupcima
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-300 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Deaktivirano
                        </span>
                      )}
                    </td>

                    {/* Akcije */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onAddBatch(p)}
                          title="Dodaj novu seriju / zalihu"
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition cursor-pointer"
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                          <span>Nova serija</span>
                        </button>

                        <button
                          onClick={() => onEditProduct(p)}
                          title="Uredi podatke artikla"
                          className="p-1.5 text-slate-600 hover:text-cyan-700 bg-slate-100 hover:bg-cyan-50 border border-slate-200 rounded-lg transition cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleActive(p)}
                          title={p.isActive ? "Deaktiviraj artikl" : "Aktiviraj artikl"}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            p.isActive
                              ? "text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border-slate-200"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                          }`}
                        >
                          {p.isActive ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
