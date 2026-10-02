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
      background: "from-sky-50/70 via-white to-slate-100",
      glow: "bg-sky-500/10",
      accent: "text-sky-800",
      accentSoft: "bg-sky-50",
      cap: "from-sky-700 to-sky-900",
      bottle: "from-white via-slate-50 to-slate-100",
      border: "border-slate-200",
      label: "border-slate-200 bg-white shadow-xs",
      icon: <FlaskConical size={24} />,
      code: "PEP",
    };
  }

  if (category === "Istraživački spojevi" || category === "Research Compounds") {
    return {
      background: "from-slate-50 via-white to-slate-100",
      glow: "bg-slate-400/10",
      accent: "text-slate-800",
      accentSoft: "bg-slate-100",
      cap: "from-slate-700 to-slate-900",
      bottle: "from-white via-slate-50 to-slate-100",
      border: "border-slate-200",
      label: "border-slate-200 bg-white shadow-xs",
      icon: <TestTubeDiagonal size={24} />,
      code: "CMP",
    };
  }

  if (category === "Referentni uzorci" || category === "Reference Standards") {
    return {
      background: "from-blue-50/60 via-white to-slate-100",
      glow: "bg-blue-400/10",
      accent: "text-blue-800",
      accentSoft: "bg-blue-50",
      cap: "from-blue-700 to-blue-900",
      bottle: "from-white via-slate-50 to-slate-100",
      border: "border-slate-200",
      label: "border-slate-200 bg-white shadow-xs",
      icon: <Beaker size={24} />,
      code: "REF",
    };
  }

  return {
    background: "from-slate-50 via-white to-slate-100",
    glow: "bg-slate-300/10",
    accent: "text-slate-800",
    accentSoft: "bg-slate-100",
    cap: "from-slate-700 to-slate-900",
    bottle: "from-white via-slate-50 to-slate-100",
    border: "border-slate-200",
    label: "border-slate-200 bg-white shadow-xs",
    icon: <Droplets size={24} />,
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
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-lg border ${style.label} ${style.accent}`}
          >
            {style.icon}
          </div>
        )}

        {/* Series code badge */}
        <div
          className={`absolute bottom-2 left-2 z-10 rounded border border-slate-200 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider bg-white/90 text-slate-700 shadow-xs`}
        >
          {style.code}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${style.background} ${
        large ? "min-h-[340px] sm:min-h-[440px] md:min-h-[480px]" : "aspect-square"
      }`}
    >
      {hasRealImage ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover object-center transition duration-500"
        />
      ) : (
        <>
          {/* Subtle background grid */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Product vector vial */}
          <div
            className={`relative flex flex-col items-center transition duration-300 ${
              large ? "scale-105 sm:scale-110" : ""
            }`}
          >
            {/* Cap top */}
            <div
              className={`relative h-6 w-20 rounded-t-md border bg-gradient-to-b shadow-sm ${style.cap} border-slate-600`}
            >
              <div className="absolute left-2 right-2 top-0.5 h-px bg-white/30" />
            </div>

            {/* Metal crimp seal */}
            <div className="h-2.5 w-16 border-x border-slate-400 bg-slate-300" />

            {/* Bottle body */}
            <div
              className={`relative flex h-40 w-28 flex-col items-center overflow-hidden rounded-b-2xl border bg-gradient-to-b shadow-sm ${style.bottle} ${style.border}`}
            >
              {/* Glass reflection */}
              <div className="absolute left-2 top-3 h-20 w-1.5 rounded-full bg-white/80" />

              {/* Label */}
              <div
                className={`relative z-10 mt-4 w-[88%] rounded-md border px-2.5 py-2.5 text-center ${style.label}`}
              >
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-md ${style.accentSoft} ${style.accent}`}
                >
                  {style.icon}
                </div>

                <div className="mt-1.5 font-mono text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                  {category}
                </div>

                <div className="mt-0.5 font-bold text-xs text-slate-900 truncate">
                  {name}
                </div>

                <div className="mt-1 font-mono text-[10px] font-bold text-sky-800">
                  {amount}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Series code badge */}
      <div className="absolute bottom-3 left-3 z-10 rounded-md border border-slate-200 bg-white/95 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-slate-700 shadow-xs">
        {style.code} · HIGH PURITY
      </div>
    </div>
  );
}
