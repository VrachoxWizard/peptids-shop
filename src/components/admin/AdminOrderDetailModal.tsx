import {
  Building2,
  CheckCircle2,
  Copy,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Truck,
  X,
} from "lucide-react";
import type { AdminOrderDetail } from "../../services/adminApi";

interface AdminOrderDetailModalProps {
  isOpen: boolean;
  selectedOrder: AdminOrderDetail | null;
  isLoadingDetail: boolean;
  onClose: () => void;
  editingStatus: string;
  onStatusChange: (status: string) => void;
  editingCarrier: string;
  onCarrierChange: (carrier: string) => void;
  editingTracking: string;
  onTrackingChange: (tracking: string) => void;
  onSaveStatus: () => void;
  isUpdating: boolean;
  onCopyGlsLabel: () => void;
}

export default function AdminOrderDetailModal({
  isOpen,
  selectedOrder,
  isLoadingDetail,
  onClose,
  editingStatus,
  onStatusChange,
  editingCarrier,
  onCarrierChange,
  editingTracking,
  onTrackingChange,
  onSaveStatus,
  isUpdating,
  onCopyGlsLabel,
}: AdminOrderDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl">
        {isLoadingDetail || !selectedOrder ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-cyan-800" />
            <span>Učitavanje detalja narudžbe...</span>
          </div>
        ) : (
          <div>
            {/* Header modala */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold font-mono text-slate-900">
                    {selectedOrder.order.orderNumber}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    RUO Izjava Verificirana
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Zaprimljeno:{" "}
                  {new Date(selectedOrder.order.createdAt).toLocaleString("hr-HR")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Fulfillment upravljač */}
              <div className="p-4 bg-cyan-50/60 border border-cyan-100 rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-700" />
                  Status Isporuke i Praćenje Pošiljke
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Status narudžbe
                    </label>
                    <select
                      value={editingStatus}
                      onChange={(e) => onStatusChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-cyan-800"
                    >
                      <option value="CONFIRMED">Potvrđeno (CONFIRMED)</option>
                      <option value="PROCESSING">U pripremi (PROCESSING)</option>
                      <option value="SHIPPED">Poslano (SHIPPED)</option>
                      <option value="DELIVERED">Isporučeno (DELIVERED)</option>
                      <option value="CANCELLED">Otkazano (CANCELLED)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kurirska služba
                    </label>
                    <select
                      value={editingCarrier}
                      onChange={(e) => onCarrierChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-cyan-800"
                    >
                      <option value="GLS">GLS Croatia</option>
                      <option value="DPD">DPD Croatia</option>
                      <option value="HP Paket24">Hrvatska Pošta (Paket24)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kod za praćenje (Tracking)
                    </label>
                    <input
                      type="text"
                      value={editingTracking}
                      onChange={(e) => onTrackingChange(e.target.value)}
                      placeholder="npr. 123456789"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-cyan-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={onSaveStatus}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdating ? "Spremanje..." : "Ažuriraj status i praćenje"}
                  </button>
                </div>
              </div>

              {/* Kupac i Podaci za dostavu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Podaci za dostavu
                    </span>
                    <button
                      onClick={onCopyGlsLabel}
                      className="flex items-center gap-1 text-[11px] text-cyan-800 hover:text-cyan-950 font-medium cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiraj za GLS</span>
                    </button>
                  </div>

                  {selectedOrder.shippingAddress && (
                    <div className="text-xs space-y-1 text-slate-800 font-sans">
                      <p className="font-semibold text-sm">
                        {selectedOrder.shippingAddress.recipientName}
                      </p>
                      <p>{selectedOrder.shippingAddress.streetAddress}</p>
                      <p>
                        {selectedOrder.shippingAddress.postalCode}{" "}
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.country}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-slate-600 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedOrder.shippingAddress.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedOrder.order.customerEmail}</span>
                      </div>

                      {selectedOrder.shippingAddress.companyName && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            R1: {selectedOrder.shippingAddress.companyName} (OIB:{" "}
                            {selectedOrder.shippingAddress.companyOib})
                          </span>
                        </div>
                      )}

                      {selectedOrder.shippingAddress.deliveryInstructions && (
                        <p className="mt-2 text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                          Napomena dostavljaču: "
                          {selectedOrder.shippingAddress.deliveryInstructions}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Plaćanje & Sukladnost
                  </span>
                  <div className="text-xs space-y-2 text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Način plaćanja:</span>
                      <span className="font-semibold uppercase text-slate-900">
                        {selectedOrder.order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Status uplate:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedOrder.order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Iznos stavki:</span>
                      <span className="font-mono">
                        {selectedOrder.order.subtotal.toFixed(2)} EUR
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Dostava:</span>
                      <span className="font-mono">
                        {selectedOrder.order.shippingFee.toFixed(2)} EUR
                      </span>
                    </div>
                    <div className="flex justify-between py-1 text-sm font-bold text-slate-900">
                      <span>Ukupno:</span>
                      <span className="font-mono">
                        {selectedOrder.order.total.toFixed(2)} EUR
                      </span>
                    </div>
                    <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-[11px]">
                      Prihvaćen RUO uvjet:{" "}
                      {new Date(
                        selectedOrder.order.ruoAcceptedAt,
                      ).toLocaleString("hr-HR")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Naručeni peptidi i dodijeljene serije */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span>Naručeni Istraživački Peptidi & Serije</span>
                  <span className="text-[11px] font-mono lowercase">
                    {selectedOrder.items.length} stavka/i
                  </span>
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-4">Proizvod</th>
                      <th className="py-2 px-4">Dodijeljena Serija (LOT)</th>
                      <th className="py-2 px-4 text-center">Čistoća</th>
                      <th className="py-2 px-4 text-center">Količina</th>
                      <th className="py-2 px-4 text-right">Ukupno</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {item.productName}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-cyan-800">
                          {item.batchNumber ? (
                            <span className="bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                              {item.batchNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Nije dodijeljeno</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          {item.purityPercentage ? (
                            <span className="text-emerald-700 font-bold">
                              {item.purityPercentage.toFixed(1)}%
                            </span>
                          ) : (
                            "≥98.0%"
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold">
                          {item.quantity} kom
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {item.totalPrice.toFixed(2)} EUR
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Audit Trail zapis */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50/50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Dnevnik Revizije (Audit Log)
                </span>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-600 max-h-36 overflow-y-auto">
                  {selectedOrder.auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2 bg-white border border-slate-200 rounded flex justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-slate-800 mr-2">
                          {log.action}
                        </span>
                        <span className="text-slate-500">{log.details}</span>
                      </div>
                      <span className="text-slate-400 shrink-0">
                        {new Date(log.createdAt).toLocaleTimeString("hr-HR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
