import React from "react";
import { Search } from "lucide-react";

interface AdminOrdersFilterBarProps {
  activeStatusFilter: string;
  onFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const STATUS_TABS = [
  { label: "Sve", value: "ALL" },
  { label: "Potvrđeno", value: "CONFIRMED" },
  { label: "U obradi", value: "PROCESSING" },
  { label: "Poslano", value: "SHIPPED" },
  { label: "Isporučeno", value: "DELIVERED" },
  { label: "Otkazano", value: "CANCELLED" },
];

export default function AdminOrdersFilterBar({
  activeStatusFilter,
  onFilterChange,
  searchQuery,
  onSearchQueryChange,
  onSearch,
}: AdminOrdersFilterBarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter tabovi */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeStatusFilter === tab.value
                  ? "bg-cyan-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tražilica */}
        <form onSubmit={onSearch} className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Traži broj, ime, tel..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-800"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition cursor-pointer"
          >
            Traži
          </button>
        </form>
      </div>
    </div>
  );
}
