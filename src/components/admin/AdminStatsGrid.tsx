import { Clock, Package, Truck } from "lucide-react";
import type { AdminDashboardStats } from "../../services/adminApi";

interface AdminStatsGridProps {
  stats: AdminDashboardStats | null;
}

export default function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Čeka isporuku
          </span>
          <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">
          {stats.pendingFulfillment}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Narudžbe sa statusom Potvrđeno
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Ukupno narudžbi
          </span>
          <span className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">
          {stats.totalOrders}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Evidentirano u bazi podataka
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Ukupna bruto vrijednost
          </span>
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900 font-mono">
          {stats.totalRevenue.toFixed(2)} {stats.currency}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Promet kroz webshop
        </p>
      </div>
    </div>
  );
}
