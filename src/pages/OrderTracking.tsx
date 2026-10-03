import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Package,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import { trackOrder, type TrackedOrder } from "../services/orderApi";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import OrderStatusBadge from "../components/common/OrderStatusBadge";

export default function OrderTracking() {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber?: string }>();
  const { language } = useTranslation();
  useDocumentTitle(language === "en" ? "Track Order | PeptideLab" : "Praćenje narudžbe | PeptideLab");

  const [userTypedNumber, setUserTypedNumber] = useState<string | null>(null);
  const inputNumber = userTypedNumber ?? (paramOrderNumber || "");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTrack = useCallback(
    async (num: string) => {
      const clean = num.trim();
      if (!clean) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await trackOrder(clean);
        setOrder(data);
      } catch (err: unknown) {
        setOrder(null);
        setError(
          err instanceof Error
            ? err.message
            : language === "en"
            ? "Order not found."
            : "Narudžba s navedenim brojem nije pronađena.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [language],
  );

  useEffect(() => {
    if (!paramOrderNumber) return;
    let cancelled = false;

    const timer = setTimeout(() => {
      if (!cancelled) {
        void executeTrack(paramOrderNumber);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [paramOrderNumber, executeTrack]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    void executeTrack(inputNumber);
  }


  const getStepProgress = (status: TrackedOrder["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-slate-900">
      {/* Top back navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 transition"
        >
          <ArrowLeft size={16} />
          <span>{language === "en" ? "Back to Shop" : "Povratak u trgovinu"}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-800 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
          <Truck size={14} />
          <span>{language === "en" ? "Logistics & Status" : "Status pošiljke"}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950">
          {language === "en" ? "Track Your Order" : "Praćenje narudžbe"}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {language === "en"
            ? "Enter your order reference code (e.g. ORD-2026-XXXXXX) to view fulfillment updates and carrier tracking."
            : "Unesite broj narudžbe iz potvrde (npr. ORD-2026-XXXXXX) za provjeru statusa laboratorijske pripreme i dostave."}
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={inputNumber}
              onChange={(e) => setUserTypedNumber(e.target.value)}
              placeholder="ORD-2026-XXXXXX"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-700/20 focus:border-sky-700 uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputNumber.trim()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            <span>{language === "en" ? "Check Status" : "Provjeri status"}</span>
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-center text-sm mb-8 animate-fadeIn max-w-lg mx-auto">
          <p className="font-semibold">{error}</p>
          <p className="text-xs text-rose-600 mt-1">
            {language === "en"
              ? "Please verify the order number from your confirmation email."
              : "Provjerite točan unos broja narudžbe iz potvrde poslane na vaš email."}
          </p>
        </div>
      )}

      {/* Loaded Order Information */}
      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Header Card with Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block">
                {language === "en" ? "Order Reference" : "Broj narudžbe"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-950 mt-0.5">
                {order.orderNumber}
              </h2>
              <span className="text-xs text-slate-500 mt-1 block">
                {language === "en" ? "Received on: " : "Zaprimljeno: "}
                {new Date(order.createdAt).toLocaleString(language === "en" ? "en-US" : "hr-HR")}
              </span>
            </div>

            <OrderStatusBadge
              status={order.status}
              language={language}
              showIcon
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold"
            />
          </div>

          {/* Timeline visualization (if not cancelled) */}
          {order.status !== "CANCELLED" && (
            <div className="py-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 font-mono">
                {language === "en" ? "Fulfillment Timeline" : "Tijek obrade i dostave"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {[
                  {
                    step: 1,
                    title: language === "en" ? "Order Placed" : "Zaprimljeno",
                    desc: language === "en" ? "Order logged into system" : "Narudžba evidentirana",
                  },
                  {
                    step: 2,
                    title: language === "en" ? "Lab Inspection" : "U pripremi",
                    desc: language === "en" ? "Batch validation & pack" : "Pakiranje i verifikacija",
                  },
                  {
                    step: 3,
                    title: language === "en" ? "Carrier Dispatched" : "Poslano",
                    desc: language === "en" ? "Handed over to GLS" : "Predano kuriru (GLS)",
                  },
                  {
                    step: 4,
                    title: language === "en" ? "Delivered" : "Isporučeno",
                    desc: language === "en" ? "Final parcel handover" : "Uručeno primatelju",
                  },
                ].map((item) => {
                  const currentProgress = getStepProgress(order.status);
                  const isDone = item.step <= currentProgress;
                  const isCurrent = item.step === currentProgress;

                  return (
                    <div
                      key={item.step}
                      className={`p-4 rounded-xl border transition ${
                        isCurrent
                          ? "border-sky-400 bg-sky-50/50 shadow-xs"
                          : isDone
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-slate-100 bg-slate-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.step}
                        </span>
                        <span className="font-semibold text-xs text-slate-900">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Carrier Tracking Banner if Shipped */}
          {order.trackingNumber && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  {language === "en" ? "Carrier Tracking (GLS)" : "Kod za praćenje pošiljke"}
                </span>
                <p className="text-base sm:text-lg font-mono font-bold mt-0.5">
                  {order.trackingNumber}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {language === "en"
                    ? "Express parcel delivery with real-time GPS tracking."
                    : "Ekspresna dostava pošiljke uz SMS i email obavijest."}
                </p>
              </div>

              <a
                href={`https://gls-group.eu/HR/hr/pracenje-posiljke?match=${encodeURIComponent(
                  order.trackingNumber,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition"
              >
                <span>{language === "en" ? "Track on GLS Portal" : "Otvori GLS praćenje"}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Ordered items breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-mono flex items-center gap-1.5">
              <Package size={14} />
              <span>{language === "en" ? "Ordered Items" : "Stavke narudžbe"}</span>
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 sm:p-4 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-slate-900 block">{item.name}</span>
                    <span className="text-slate-500 text-xs">
                      {item.quantity} × {item.unitPrice.toFixed(2)} €
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {item.totalPrice.toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="mt-3 p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{language === "en" ? "Subtotal" : "Iznos artikala"}</span>
                <span className="font-mono">{order.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === "en" ? "Shipping" : "Dostava (GLS)"}</span>
                <span className="font-mono">{order.shippingFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-slate-950 pt-2 border-t border-slate-200 text-sm sm:text-base">
                <span>{language === "en" ? "Total" : "Ukupno"}</span>
                <span className="font-mono">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
