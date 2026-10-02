import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { translations } from "../../i18n/translations";

type TranslationCart = (typeof translations)[keyof typeof translations]["cart"];
type TranslationPayments = (typeof translations)[keyof typeof translations]["payments"];
type TranslationTrustBar = (typeof translations)[keyof typeof translations]["trustBar"];

export type PaymentMethod = "cod" | "keks" | "card" | "transfer";

interface OrderSuccessViewProps {
  tCart: TranslationCart;
  tPayments: TranslationPayments;
  tTrustBar: TranslationTrustBar;
  order: {
    total: number;
    paymentMethod: PaymentMethod;
  };
  onContinueShopping: () => void;
}

export default function OrderSuccessView({
  tCart,
  tPayments,
  tTrustBar,
  order,
  onContinueShopping,
}: OrderSuccessViewProps) {
  const paymentLabels: Record<PaymentMethod, string> = {
    cod: tPayments.cod,
    keks: tPayments.keks,
    card: tPayments.card,
    transfer: tPayments.transfer,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center max-w-lg mx-auto rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle2 size={32} />
        </div>

        <h1 className="font-serif mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {tCart.orderSuccessTitle}
        </h1>

        <p className="mt-2.5 text-sm text-slate-600">
          {order.paymentMethod === "cod"
            ? tCart.orderSuccessCodDesc
            : tCart.orderSuccessSecureDesc}
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">{tCart.total}:</span>
            <strong className="font-mono text-slate-900 text-sm">
              {order.total.toFixed(2)} €
            </strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">{tPayments.title}:</span>
            <span className="font-semibold text-slate-900">
              {paymentLabels[order.paymentMethod]}
            </span>
          </div>

          <div className="flex justify-between border-t border-slate-200 pt-2 text-emerald-800">
            <span className="font-medium">{tTrustBar.shipping}</span>
          </div>
        </div>

        <Link
          to="/proizvodi"
          onClick={onContinueShopping}
          className="tactile-press mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 text-sm shadow-xs"
        >
          {tCart.continueShopping}
        </Link>
      </div>
    </main>
  );
}
