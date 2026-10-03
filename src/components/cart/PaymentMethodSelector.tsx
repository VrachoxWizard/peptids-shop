import { Banknote, QrCode, Smartphone } from "lucide-react";
import type { PaymentMethod } from "./OrderSuccessView";
import type { translations } from "../../i18n/translations";

type TranslationPayments = (typeof translations)[keyof typeof translations]["payments"];

interface PaymentMethodSelectorProps {
  tPayments: TranslationPayments;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  tPayments,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  const paymentOptions: Array<{
    id: PaymentMethod;
    label: string;
    badge?: string;
    detail: string;
    icon: React.ReactNode;
    selectedStyle: string;
    iconColor: string;
    badgeStyle?: string;
  }> = [
    {
      id: "cod",
      label: tPayments.cod,
      badge: tPayments.codBadge,
      detail: tPayments.codDetail,
      icon: <Banknote size={15} className="text-emerald-700 shrink-0" />,
      selectedStyle: "border-emerald-600 bg-emerald-50/70",
      iconColor: "text-emerald-700",
      badgeStyle: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "keks",
      label: tPayments.keks,
      badge: tPayments.keksBadge,
      detail: tPayments.keksDetail,
      icon: <Smartphone size={15} className="text-sky-700 shrink-0" />,
      selectedStyle: "border-sky-600 bg-sky-50/70",
      iconColor: "text-sky-700",
      badgeStyle: "bg-slate-100 text-slate-700",
    },
    {
      id: "transfer",
      label: tPayments.transfer,
      detail: tPayments.transferDetail,
      icon: <QrCode size={15} className="text-sky-700 shrink-0" />,
      selectedStyle: "border-sky-600 bg-sky-50/70",
      iconColor: "text-sky-700",
    },
  ];

  return (
    <div className="mt-5">
      <label className="block font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {tPayments.title}
      </label>

      <div className="space-y-2">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectMethod(opt.id)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                isSelected
                  ? opt.selectedStyle
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {opt.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold shrink-0 ${opt.badgeStyle || ""}`}
                  >
                    {opt.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-600 pl-6 leading-tight">
                {opt.detail}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
