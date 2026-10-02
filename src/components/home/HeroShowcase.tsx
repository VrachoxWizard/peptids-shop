import { motion } from "motion/react";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import ProductVisual from "../product/ProductVisual";

export default function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -inset-4 rounded-full bg-emerald-500/15 blur-3xl" />

      {/* Main showcase container */}
      <div className="relative rounded-3xl border border-white/10 bg-zinc-900/80 p-5 sm:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        {/* Top header strip */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-wider text-emerald-400">
              HPLC VALIDIRANO
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/60 px-3 py-1 font-mono text-[11px] text-zinc-400">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>ČISTOĆA ≥ 99.4%</span>
          </div>
        </div>

        {/* Visual centerpiece with subtle float */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="my-3 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40"
        >
          <ProductVisual
            name="BPC-157 Arginate"
            category="Peptidi"
            amount="10 mg"
            large
          />
        </motion.div>

        {/* Floating specification tags */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="rounded-xl border border-white/5 bg-zinc-950/50 p-2.5 text-center">
            <span className="block font-mono text-[10px] text-zinc-500 uppercase">
              CAS BROJ
            </span>
            <span className="mt-0.5 block font-mono text-xs font-medium text-zinc-200">
              137525-51-0
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-950/50 p-2.5 text-center">
            <span className="block font-mono text-[10px] text-zinc-500 uppercase">
              FORMAT
            </span>
            <span className="mt-0.5 block font-mono text-xs font-medium text-zinc-200">
              Liofilizirano
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-center">
            <span className="block font-mono text-[10px] text-emerald-400/80 uppercase">
              SKLADIŠTENJE
            </span>
            <span className="mt-0.5 block font-mono text-xs font-semibold text-emerald-300">
              -20°C Stabilno
            </span>
          </div>
        </div>

        {/* Bottom certification pill */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-zinc-950/70 px-3.5 py-2.5 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-emerald-400" />
            <span>Serija: <strong className="font-mono text-zinc-200">2026-BPC-157</strong></span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={14} />
            <span className="text-[11px] font-medium">COA Dostupan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
