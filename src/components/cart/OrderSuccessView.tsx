import { useState } from "react";
import {
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  QrCode,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Hub3PaymentSlip } from "../../services/orderApi";
import type { translations } from "../../i18n/translations";

type TranslationCart = (typeof translations)[keyof typeof translations]["cart"];
type TranslationPayments = (typeof translations)[keyof typeof translations]["payments"];
type TranslationTrustBar = (typeof translations)[keyof typeof translations]["trustBar"];

export type PaymentMethod = "cod" | "keks" | "transfer";

interface OrderSuccessViewProps {
  tCart: TranslationCart;
  tPayments: TranslationPayments;
  tTrustBar: TranslationTrustBar;
  order: {
    orderNumber?: string;
    total: number;
    paymentMethod: PaymentMethod;
    paymentDetails?: Hub3PaymentSlip | null;
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
  const [copied, setCopied] = useState(false);

  const orderNumber = order.orderNumber || "ORD-2026-PREVIEW";

  const paymentLabels: Record<PaymentMethod, string> = {
    cod: tPayments.cod,
    keks: tPayments.keks,
    transfer: tPayments.transfer,
  };

  function copyPaymentData() {
    const text = `Primatelj: PeptideLab d.o.o.\nIBAN: HR1234567890123456789\nModel: HR00\nPoziv na broj: ${orderNumber}\nIznos: ${order.total.toFixed(2)} EUR\nOpis: Narudžba ${orderNumber}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Podaci za plaćanje kopirani u međuspremnik!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="font-serif mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
          {tCart.orderSuccessTitle}
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          {order.paymentMethod === "cod"
            ? "Vaša narudžba je zabilježena u laboratorijskom logističkom sustavu. Plaćanje pouzećem kuriru (gotovina ili kartica) pri preuzimanju."
            : order.paymentMethod === "transfer"
            ? "Vaša narudžba je zabilježena. Molimo izvršite uplatu prema dolje navedenim podacima ili skenirajte 2D crtični kod."
            : "Vaša narudžba je zabilježena. Molimo dovršite uplatu putem Keks Pay / Aircash aplikacije."}
        </p>

        {/* Order Number Badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-xs sm:text-sm font-bold text-slate-900">
          <span className="text-slate-500 font-sans font-medium">Broj narudžbe:</span>
          <span className="text-sky-800">{orderNumber}</span>
        </div>

        {/* Order Details Summary Box */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 text-left space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">{tCart.total}:</span>
            <strong className="font-mono text-slate-950 text-base sm:text-lg">
              {order.total.toFixed(2)} €
            </strong>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">{tPayments.title}:</span>
            <span className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
              {order.paymentMethod === "cod" && <Banknote size={15} className="text-emerald-700" />}
              {order.paymentMethod === "keks" && <Smartphone size={15} className="text-sky-700" />}
              {order.paymentMethod === "transfer" && <QrCode size={15} className="text-sky-700" />}
              {paymentLabels[order.paymentMethod]}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200 pt-2.5 text-slate-600">
            <span className="text-slate-500">Isporuka:</span>
            <span className="font-medium text-slate-900 inline-flex items-center gap-1.5">
              <Truck size={14} className="text-sky-700" />
              <span>{tTrustBar.shipping}</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-emerald-800 border-t border-slate-200 pt-2.5">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} />
              <span>Regulatorni status:</span>
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              RUO ZABILJEŽENO
            </span>
          </div>
        </div>

        {/* HUB3 / Virman Uplatnica Prikaz (Ako je odabran transfer) */}
        {order.paymentMethod === "transfer" && (
          <div className="mt-6 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/60 p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200/80 pb-3">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-sky-800" />
                <h3 className="font-bold text-sm text-slate-950 font-serif">
                  Podaci za uplatu (Virman / HUB3 2D barkod)
                </h3>
              </div>
              <button
                type="button"
                onClick={copyPaymentData}
                className="tactile-press inline-flex items-center gap-1.5 rounded-md bg-white border border-sky-300 px-2.5 py-1 text-xs font-semibold text-sky-800 hover:bg-sky-50 shadow-2xs"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? "Kopirano!" : "Kopiraj podatke"}</span>
              </button>
            </div>

            <div className="grid gap-2 text-xs sm:text-sm font-mono text-slate-800">
              <div className="flex justify-between py-1 border-b border-sky-100">
                <span className="text-slate-500 font-sans">Primatelj:</span>
                <span className="font-semibold text-right">PeptideLab d.o.o., Zagreb</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-100">
                <span className="text-slate-500 font-sans">IBAN primatelja:</span>
                <span className="font-bold text-sky-950 text-right">HR12 3456 7890 1234 5678 9</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-100">
                <span className="text-slate-500 font-sans">Model i poziv na broj:</span>
                <span className="font-bold text-slate-950 text-right">HR00 {orderNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-100">
                <span className="text-slate-500 font-sans">Iznos:</span>
                <span className="font-bold text-slate-950 text-right text-sm">
                  {order.total.toFixed(2)} EUR
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-sans">Opis plaćanja:</span>
                <span className="text-right">Narudžba {orderNumber}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-1">
              Podatke možete prepisati u mobilno bankarstvo (m-zaba, George, PBZ) ili uplatiti u pošti/banci. Pošiljka se šalje odmah po evidentiranju uplate.
            </p>
          </div>
        )}

        {/* Keks Pay Upute */}
        {order.paymentMethod === "keks" && (
          <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50/60 p-4 text-left text-xs sm:text-sm space-y-1.5 text-slate-800">
            <div className="flex items-center gap-2 font-bold text-sky-900">
              <Smartphone size={16} />
              <span>Keks Pay / Aircash upute</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Otvorite Keks Pay ili Aircash aplikaciju, odaberite plaćanje na IBAN:{" "}
              <strong className="font-mono text-slate-950">HR12 3456 7890 1234 5678 9</strong> s pozivom na broj:{" "}
              <strong className="font-mono text-slate-950">{orderNumber}</strong>.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/proizvodi"
            onClick={onContinueShopping}
            className="tactile-press w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 text-sm shadow-xs"
          >
            {tCart.continueShopping}
          </Link>
        </div>
      </div>
    </main>
  );
}
