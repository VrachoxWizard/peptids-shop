import { useTranslation } from "../../i18n/useTranslation";

interface StockBadgeProps {
  inStock?: boolean;
  stockQuantity?: number;
  className?: string;
}

export default function StockBadge({
  inStock = true,
  stockQuantity,
  className = "",
}: StockBadgeProps) {
  const { language } = useTranslation();

  const isSoldOut = inStock === false || stockQuantity === 0;
  const isLowStock = !isSoldOut && stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 5;

  if (isSoldOut) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium border bg-rose-50 text-rose-800 border-rose-200 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        {language === "en" ? "Out of Stock" : "Rasprodano"}
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium border bg-amber-50 text-amber-800 border-amber-200 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        {language === "en" ? `Only ${stockQuantity} left` : `Zadnjih ${stockQuantity} kom.`}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium border bg-emerald-50 text-emerald-800 border-emerald-200 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {language === "en" ? "In Stock" : "Dostupno odmah"}
    </span>
  );
}
