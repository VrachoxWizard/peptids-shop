import type { AdminOrderSummary } from "../../services/adminApi";
import OrderStatusBadge from "../common/OrderStatusBadge";

interface AdminOrdersTableProps {
  orders: AdminOrderSummary[];
  totalOrdersCount?: number;
  onSelectOrder: (id: string) => void;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Pouzeće",
  keks: "Keks Pay",
  transfer: "Virman / HUB3",
};

export default function AdminOrdersTable({
  orders,
  totalOrdersCount,
  onSelectOrder,
}: AdminOrdersTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Broj narudžbe</th>
              <th className="py-3 px-4">Datum</th>
              <th className="py-3 px-4">Kupac & Kontakt</th>
              <th className="py-3 px-4">Način plaćanja</th>
              <th className="py-3 px-4">Iznos</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Praćenje (GLS)</th>
              <th className="py-3 px-4 text-right">Akcija</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Nema narudžbi koje odgovaraju odabranim kriterijima.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => onSelectOrder(order.id)}
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-cyan-950">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("hr-HR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">
                      {order.customerName}
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {order.total.toFixed(2)} {order.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {order.trackingNumber ? (
                      <span className="text-cyan-800 font-medium">
                        {order.shippingCarrier || "GLS"}: {order.trackingNumber}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order.id);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-medium transition shadow-2xs cursor-pointer"
                    >
                      Pregled
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>Prikazano: {orders.length} narudžbi</span>
        <span>Ukupno u sustavu: {totalOrdersCount ?? orders.length}</span>
      </div>
    </div>
  );
}
