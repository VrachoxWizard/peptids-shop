import { Lock, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import PaymentMethodSelector from "./PaymentMethodSelector";
import type { PaymentMethod } from "./OrderSuccessView";
import { SHOP_CONFIG } from "../../config/shop";
import type { translations } from "../../i18n/translations";

type TranslationCart = (typeof translations)[keyof typeof translations]["cart"];
type TranslationPayments = (typeof translations)[keyof typeof translations]["payments"];
type TranslationTrustBar = (typeof translations)[keyof typeof translations]["trustBar"];

interface CartSummarySidebarProps {
  tCart: TranslationCart;
  tPayments: TranslationPayments;
  tTrustBar: TranslationTrustBar;
  language: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onCheckout: () => void;
}

export default function CartSummarySidebar({
  tCart,
  tPayments,
  tTrustBar,
  language,
  subtotal,
  shipping,
  total,
  paymentMethod,
  onSelectPaymentMethod,
  onCheckout,
}: CartSummarySidebarProps) {
  const remainingForFreeShipping = Math.max(
    0,
    SHOP_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal,
  );

  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24 shadow-xs">
      <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-950 tracking-tight">
        {tCart.summaryTitle}
      </h2>

      {/* Free shipping progress info */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
        <div className="flex gap-2.5">
          <Truck size={18} className="shrink-0 text-sky-700 mt-0.5" />

          <div className="w-full">
            {shipping === 0 ? (
              <>
                <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                  {tCart.freeShipping}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {tCart.freeShippingReached}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  {tCart.remainingPrefix}
                  <span className="font-mono text-sky-700">
                    {remainingForFreeShipping.toFixed(2)} €
                  </span>{" "}
                  {tCart.remainingForFree}
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-sky-700 rounded-full transition-[width] duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (subtotal / SHOP_CONFIG.FREE_SHIPPING_THRESHOLD) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <PaymentMethodSelector
        tPayments={tPayments}
        selectedMethod={paymentMethod}
        onSelectMethod={onSelectPaymentMethod}
      />

      {/* Pricing Totals */}
      <div className="mt-5 space-y-3">
        <div className="flex justify-between text-xs sm:text-sm text-slate-600">
          <span>{tCart.subtotal}</span>
          <span className="font-mono text-slate-900 tabular-nums">
            {subtotal.toFixed(2)} €
          </span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-slate-600">
          <span>{tCart.shipping}</span>
          <span className="font-mono text-slate-900 tabular-nums">
            {shipping === 0 ? tCart.freeShipping : `${shipping.toFixed(2)} €`}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-end justify-between">
            <span className="font-bold text-slate-950 text-base">
              {tCart.total}
            </span>
            <span className="text-2xl font-bold font-mono text-slate-950 tabular-nums">
              {total.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      {/* Primary Checkout CTA */}
      <button
        type="button"
        onClick={onCheckout}
        className="tactile-press mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm"
      >
        <ShieldCheck size={18} />
        <span>
          {language === "hr"
            ? `Dovrši narudžbu (${paymentMethod === "cod" ? "Pouzeće" : "Sigurno"})`
            : `Complete Order (${paymentMethod === "cod" ? "Cash on Delivery" : "Secure Pay"})`}
        </span>
      </button>

      {/* Trust Guarantees Box */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-medium text-slate-900">
          <Lock size={14} className="text-sky-700 shrink-0" />
          <span>{tPayments.sslSecure}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <PackageCheck size={14} className="text-sky-700 shrink-0" />
          <span>{tPayments.discreteGuarantee}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Truck size={14} className="text-sky-700 shrink-0" />
          <span>{tTrustBar.shipping}</span>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        {tCart.disclaimer}
      </p>

      <Link
        to="/proizvodi"
        className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold transition hover:bg-slate-50 text-slate-700"
      >
        {tCart.continueShopping}
      </Link>
    </aside>
  );
}
