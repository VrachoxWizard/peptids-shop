import { Beaker, Droplets, FlaskConical, TestTubeDiagonal } from "lucide-react";

type ProductVisualProps = {
  name: string;
  category: string;
  amount: string;
  large?: boolean;
};

type CategoryStyle = {
  background: string;
  glow: string;
  accent: string;
  accentSoft: string;
  cap: string;
  bottle: string;
  border: string;
  label: string;
  icon: React.ReactNode;
  code: string;
};

function getCategoryStyle(category: string): CategoryStyle {
  switch (category) {
    case "Peptidi":
      return {
        background: "from-emerald-950/80 via-zinc-900 to-zinc-950",
        glow: "bg-emerald-400/20",
        accent: "text-emerald-400",
        accentSoft: "bg-emerald-400/10",
        cap: "from-emerald-700 to-emerald-950",
        bottle: "from-emerald-950/70 via-zinc-900 to-zinc-950",
        border: "border-emerald-500/30",
        label: "border-emerald-500/30 bg-emerald-400/5",
        icon: <FlaskConical size={28} />,
        code: "PEP",
      };

    case "Istraživački spojevi":
      return {
        background: "from-violet-950/80 via-zinc-900 to-zinc-950",
        glow: "bg-violet-500/20",
        accent: "text-violet-400",
        accentSoft: "bg-violet-400/10",
        cap: "from-violet-700 to-violet-950",
        bottle: "from-violet-950/70 via-zinc-900 to-zinc-950",
        border: "border-violet-500/30",
        label: "border-violet-500/30 bg-violet-400/5",
        icon: <TestTubeDiagonal size={28} />,
        code: "CMP",
      };

    case "Referentni uzorci":
      return {
        background: "from-sky-950/80 via-zinc-900 to-zinc-950",
        glow: "bg-sky-400/20",
        accent: "text-sky-400",
        accentSoft: "bg-sky-400/10",
        cap: "from-sky-700 to-sky-950",
        bottle: "from-sky-950/70 via-zinc-900 to-zinc-950",
        border: "border-sky-500/30",
        label: "border-sky-500/30 bg-sky-400/5",
        icon: <Beaker size={28} />,
        code: "REF",
      };

    default:
      return {
        background: "from-zinc-800 via-zinc-900 to-zinc-950",
        glow: "bg-zinc-400/10",
        accent: "text-zinc-300",
        accentSoft: "bg-zinc-400/10",
        cap: "from-zinc-600 to-zinc-800",
        bottle: "from-zinc-800 via-zinc-900 to-zinc-950",
        border: "border-zinc-600",
        label: "border-zinc-700 bg-zinc-900/50",
        icon: <Droplets size={28} />,
        code: "LAB",
      };
  }
}

export default function ProductVisual({
  name,
  category,
  amount,
  large = false,
}: ProductVisualProps) {
  const style = getCategoryStyle(category);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${style.background} ${
        large ? "min-h-[520px]" : "aspect-square"
      }`}
    >
      {/* Ambient glow */}
      <div
        className={`absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${style.glow}`}
      />

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top metadata */}
      <div className="absolute left-5 top-5">
        <p className="text-[9px] font-medium tracking-[0.28em] text-zinc-500">
          PEPTIDELAB
        </p>

        <p
          className={`mt-1 text-[10px] font-bold tracking-[0.22em] ${style.accent}`}
        >
          {style.code} SERIES
        </p>
      </div>

      {/* Serial */}
      <div className="absolute right-5 top-5 text-right">
        <p className="text-[9px] tracking-[0.2em] text-zinc-600">SAMPLE</p>

        <p className="mt-1 font-mono text-[10px] text-zinc-500">
          #{String(name.length * 173).padStart(4, "0")}
        </p>
      </div>

      {/* Product vial */}
      <div
        className={`relative flex flex-col items-center transition duration-500 ${
          large ? "scale-125" : ""
        }`}
      >
        {/* Cap top */}
        <div
          className={`relative h-7 w-24 rounded-t-lg border bg-gradient-to-b shadow-xl ${style.cap} ${style.border}`}
        >
          <div className="absolute left-2 right-2 top-1 h-px bg-white/15" />
          <div className="absolute bottom-1 left-2 right-2 h-px bg-black/30" />
        </div>

        {/* Metal neck */}
        <div className={`h-3 w-20 border-x bg-zinc-700/80 ${style.border}`} />

        {/* Bottle */}
        <div
          className={`relative flex h-44 w-32 flex-col items-center overflow-hidden rounded-b-3xl border bg-gradient-to-b shadow-2xl backdrop-blur ${style.bottle} ${style.border}`}
        >
          {/* Glass shine */}
          <div className="absolute left-3 top-4 h-24 w-2 rounded-full bg-white/10 blur-[1px]" />

          <div className="absolute right-4 top-6 h-16 w-px bg-white/5" />

          {/* Liquid glow */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-14 ${style.accentSoft}`}
          />

          {/* Label */}
          <div
            className={`relative z-10 mt-5 w-[88%] rounded-lg border px-3 py-3 text-center backdrop-blur ${style.label}`}
          >
            <div
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${style.accentSoft} ${style.accent}`}
            >
              {style.icon}
            </div>

            <p className="mt-2 text-[9px] font-bold tracking-[0.18em] text-white">
              PEPTIDELAB
            </p>

            <div className="my-2 h-px bg-white/10" />

            <p className="truncate text-[9px] font-medium text-zinc-200">
              {name}
            </p>

            <p className={`mt-1 text-[10px] font-bold ${style.accent}`}>
              {amount}
            </p>
          </div>

          {/* Bottom markings */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <span className="font-mono text-[7px] text-zinc-600">LOT 2026</span>

            <span className="font-mono text-[7px] text-zinc-600">R&D</span>
          </div>
        </div>

        {/* Shadow */}
        <div className="mt-5 h-5 w-28 rounded-full bg-black/60 blur-md" />
      </div>

      {/* Category badge */}
      <div
        className={`absolute bottom-5 left-5 rounded-full border px-3 py-1.5 text-[10px] font-medium backdrop-blur ${style.label} ${style.accent}`}
      >
        {category}
      </div>

      {/* Amount badge */}
      <div className="absolute bottom-5 right-5 rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1.5 text-[10px] text-zinc-400 backdrop-blur">
        {amount}
      </div>
    </div>
  );
}
