import { useState } from "react";
import { Beaker, Droplets, FlaskConical, TestTubeDiagonal } from "lucide-react";

type ProductVisualProps = {
  name: string;
  category: string;
  amount: string;
  image?: string;
  large?: boolean;
  thumbnail?: boolean;
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
  if (category === "Peptidi" || category === "Peptides") {
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
  }

  if (category === "Istraživački spojevi" || category === "Research Compounds") {
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
  }

  if (category === "Referentni uzorci" || category === "Reference Standards") {
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
  }

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

export default function ProductVisual({
  name,
  category,
  amount,
  image,
  large = false,
  thumbnail = false,
}: ProductVisualProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const style = getCategoryStyle(category);
  const hasRealImage = Boolean(image) && !imageFailed;

  if (thumbnail) {
    return (
      <div
        className={`relative flex h-full w-full aspect-square items-center justify-center overflow-hidden bg-gradient-to-br ${style.background}`}
      >
        {hasRealImage ? (
          <img
            src={image}
            alt={name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <>
            {/* Ambient glow */}
            <div
              className={`absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl ${style.glow}`}
            />
            {/* Styled icon container representing vial */}
            <div
              className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border shadow-lg backdrop-blur ${style.label} ${style.accent}`}
            >
              {style.icon}
            </div>
          </>
        )}

        {/* Series code badge */}
        <div
          className={`absolute bottom-2 left-2 z-10 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider backdrop-blur-md ${style.accentSoft} ${style.accent}`}
        >
          {style.code}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${style.background} ${
        large ? "min-h-[340px] sm:min-h-[440px] md:min-h-[500px]" : "aspect-square"
      }`}
    >
      {hasRealImage ? (
        <>
          <img
            src={image}
            alt={name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-center transition duration-700"
          />
          {/* Subtle gradient vignette to blend with dark interface */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/40" />
        </>
      ) : (
        <>
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

          {/* Product vector vial fallback */}
          <div
            className={`relative flex flex-col items-center transition duration-500 ${
              large ? "scale-105 sm:scale-115 md:scale-125" : ""
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
        </>
      )}

      {/* Top metadata */}
      <div className="absolute left-3.5 top-3.5 sm:left-5 sm:top-5 z-10">
        <p className="text-[8px] sm:text-[9px] font-medium tracking-[0.28em] text-zinc-400 drop-shadow">
          PEPTIDELAB
        </p>
        <p
          className={`mt-0.5 text-[9px] sm:text-[10px] font-bold tracking-[0.22em] ${style.accent} drop-shadow`}
        >
          {style.code} SERIES
        </p>
      </div>

      {/* Serial */}
      <div className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 text-right z-10">
        <p className="text-[8px] sm:text-[9px] tracking-[0.2em] text-zinc-400 drop-shadow">SAMPLE</p>
        <p className="mt-0.5 font-mono text-[9px] sm:text-[10px] text-zinc-300 drop-shadow">
          #{String(name.length * 173).padStart(4, "0")}
        </p>
      </div>

      {/* Category badge */}
      <div
        className={`absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5 z-10 max-w-[55%] truncate rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[9px] sm:text-[10px] font-semibold backdrop-blur-md shadow-md ${style.label} ${style.accent}`}
      >
        {category}
      </div>

      {/* Amount badge */}
      <div className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-10 shrink-0 rounded-full border border-white/10 bg-zinc-950/80 px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[9px] sm:text-[10px] text-zinc-200 backdrop-blur-md shadow-md">
        {amount}
      </div>
    </div>
  );
}
