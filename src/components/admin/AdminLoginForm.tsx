import React from "react";
import { AlertCircle, Lock, RefreshCw, ShieldCheck } from "lucide-react";

interface AdminLoginFormProps {
  keyInput: string;
  onKeyChange: (value: string) => void;
  onLogin: (e: React.FormEvent) => void;
  isLoading: boolean;
  authError: string | null;
}

export default function AdminLoginForm({
  keyInput,
  onKeyChange,
  onLogin,
  isLoading,
  authError,
}: AdminLoginFormProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-4 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            PeptideLab Kontrolni Panel
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Autentifikacija za upravljanje narudžbama i serijama istraživačkih spojeva.
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-5">
          <div>
            <label
              htmlFor="admin-key-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Administratorski tajni ključ
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-key-input"
                type="password"
                value={keyInput}
                onChange={(e) => onKeyChange(e.target.value)}
                placeholder="Unesite ADMIN_API_KEY..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-700 font-mono text-sm"
                autoFocus
                required
              />
            </div>
          </div>

          {authError && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-cyan-950 hover:bg-cyan-900 text-white font-medium rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Provjera vjerodajnica...</span>
              </>
            ) : (
              <span>Prijavi se u sustav</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-400 font-mono">
            Sigurnosni protokol: Timing-Safe SHA & Rate Limit Guard
          </span>
        </div>
      </div>
    </div>
  );
}
