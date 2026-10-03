import { LogOut, RefreshCw, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  isLoading,
  onRefresh,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                PeptideLab Sustav za Narudžbe
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-full">
                Aktivan
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pregled pošiljki, dodijeljenih serija i HUB3 virmana
            </p>
          </div>
        </div>

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
