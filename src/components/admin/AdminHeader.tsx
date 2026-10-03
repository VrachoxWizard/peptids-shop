import {
  LogOut,
  MessageSquare,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

export type AdminTab = "orders" | "catalog" | "inquiries";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  inquiriesCount?: number;
}

export default function AdminHeader({
  activeTab,
  onTabChange,
  isLoading,
  onRefresh,
  onLogout,
  inquiriesCount = 0,
}: AdminHeaderProps) {
  const tabs = [
    {
      id: "orders" as const,
      label: "Narudžbe",
      icon: ShoppingCart,
    },
    {
      id: "catalog" as const,
      label: "Katalog & Skladište",
      icon: Package,
    },
    {
      id: "inquiries" as const,
      label: "Kontakt upiti",
      icon: MessageSquare,
      badge: inquiriesCount > 0 ? inquiriesCount : undefined,
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                PeptideLab CMS
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-full">
                Sustav Aktivan
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Administracija narudžbi, kataloga peptida, serija i upita
            </p>
          </div>
        </div>

        {/* Tab navigacija */}
        <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-sm shadow-cyan-900/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isActive
                        ? "bg-cyan-800 text-cyan-100"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Osvježi podatke"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Odjava</span>
          </button>
        </div>
      </div>
    </header>
  );
}
