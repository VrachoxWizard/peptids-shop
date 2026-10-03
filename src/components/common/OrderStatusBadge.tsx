import React from "react";
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";

export type OrderStatus =
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  language?: "hr" | "en";
  className?: string;
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<
  string,
  {
    labelHr: string;
    labelEn: string;
    bg: string;
    icon: React.ElementType;
  }
> = {
  CONFIRMED: {
    labelHr: "Potvrđeno",
    labelEn: "Confirmed",
    bg: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Clock,
  },
  PROCESSING: {
    labelHr: "U pripremi",
    labelEn: "Processing",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    icon: RefreshCw,
  },
  SHIPPED: {
    labelHr: "Poslano",
    labelEn: "Shipped",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Truck,
  },
  DELIVERED: {
    labelHr: "Isporučeno",
    labelEn: "Delivered",
    bg: "bg-teal-50 text-teal-700 border-teal-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    labelHr: "Otkazano",
    labelEn: "Cancelled",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
};

export default function OrderStatusBadge({
  status,
  language = "hr",
  className = "",
  showIcon = false,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    labelHr: status,
    labelEn: status,
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  };

  const Icon = config.icon;
  const label = language === "en" ? config.labelEn : config.labelHr;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}
