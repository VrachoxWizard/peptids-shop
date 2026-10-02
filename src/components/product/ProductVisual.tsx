import { FlaskConical } from "lucide-react";

type ProductVisualProps = {
  name: string;
  category: string;
  amount: string;
  large?: boolean;
};

export default function ProductVisual({
  name,
  category,
  amount,
  large = false,
}: ProductVisualProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 ${
        large ? "min-h-[500px]" : "aspect-square"
      }`}
    >
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Decorative lines */}
      <div className="absolute left-6 top-6 text-[10px] tracking-[0.3em] text-zinc-600">
        RESEARCH SERIES
      </div>

      <div className="absolute bottom-6 right-6 text-[10px] tracking-[0.3em] text-zinc-700">
        LAB USE
      </div>

      {/* Vial */}
      <div
        className={`relative flex flex-col items-center ${
          large ? "scale-125" : ""
        }`}
      >
        {/* Cap */}
        <div className="h-6 w-20 rounded-t-md border border-zinc-600 bg-zinc-700 shadow-lg" />

        {/* Bottle */}
        <div className="relative flex h-40 w-28 flex-col items-center justify-center rounded-b-2xl border border-zinc-600 bg-gradient-to-b from-zinc-800/90 to-zinc-950 shadow-2xl backdrop-blur">
          <FlaskConical size={26} className="mb-3 text-emerald-400" />

          <span className="text-center text-[10px] font-bold tracking-widest text-white">
            PEPTIDELAB
          </span>

          <div className="my-3 h-px w-16 bg-zinc-700" />

          <span className="max-w-[80px] truncate text-[9px] font-medium text-zinc-300">
            {name}
          </span>

          <span className="mt-1 text-[9px] text-emerald-400">{amount}</span>
        </div>

        {/* Shadow */}
        <div className="mt-5 h-4 w-24 rounded-full bg-black/50 blur-md" />
      </div>

      {/* Category */}
      <span className="absolute bottom-5 left-5 rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-[10px] text-zinc-400 backdrop-blur">
        {category}
      </span>
    </div>
  );
}
