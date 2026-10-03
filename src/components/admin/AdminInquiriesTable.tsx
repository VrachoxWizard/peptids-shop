import { useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";
import type { AdminInquiry } from "../../services/adminApi";

interface AdminInquiriesTableProps {
  inquiries: AdminInquiry[];
  isLoading: boolean;
  onStatusChange: (
    id: number,
    status: "NEW" | "IN_PROGRESS" | "ANSWERED" | "ARCHIVED",
  ) => Promise<void>;
}

export default function AdminInquiriesTable({
  inquiries,
  isLoading,
  onStatusChange,
}: AdminInquiriesTableProps) {
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (activeStatus !== "ALL" && inq.status !== activeStatus) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = inq.name.toLowerCase().includes(query);
        const matchesEmail = inq.email.toLowerCase().includes(query);
        const matchesMsg = inq.message.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesMsg) {
          return false;
        }
      }
      return true;
    });
  }, [inquiries, activeStatus, search]);

  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === "NEW").length,
      inProgress: inquiries.filter((i) => i.status === "IN_PROGRESS").length,
      answered: inquiries.filter((i) => i.status === "ANSWERED").length,
      archived: inquiries.filter((i) => i.status === "ARCHIVED").length,
    };
  }, [inquiries]);

  function getStatusBadge(status: AdminInquiry["status"]) {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-300 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            Novi upit
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-300 rounded-full">
            <Clock className="w-3 h-3 text-amber-500" />
            U obradi
          </span>
        );
      case "ANSWERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Odgovoreno
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-300 rounded-full">
            <Archive className="w-3 h-3 text-slate-400" />
            Arhivirano
          </span>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Status Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveStatus("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeStatus === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Svi upiti ({counts.all})
          </button>
          <button
            onClick={() => setActiveStatus("NEW")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeStatus === "NEW"
                ? "bg-cyan-600 text-white"
                : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Novi ({counts.new})</span>
          </button>
          <button
            onClick={() => setActiveStatus("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeStatus === "IN_PROGRESS"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            U obradi ({counts.inProgress})
          </button>
          <button
            onClick={() => setActiveStatus("ANSWERED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeStatus === "ANSWERED"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Odgovoreno ({counts.answered})
          </button>
          <button
            onClick={() => setActiveStatus("ARCHIVED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeStatus === "ARCHIVED"
                ? "bg-slate-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Arhivirano ({counts.archived})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pretraži po imenu, emailu ili tekstu..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Datum</th>
                <th className="px-4 py-3.5">Pošiljatelj</th>
                <th className="px-4 py-3.5">Poruka upita</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    Učitavanje kontakt upita...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    Nema pronađenih upita u odabranoj kategoriji.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const isExpanded = expandedId === inq.id;
                  const dateStr = new Date(inq.createdAt).toLocaleDateString("hr-HR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={inq.id}
                      className={`hover:bg-slate-50/70 transition ${
                        inq.status === "NEW" ? "bg-cyan-50/20" : ""
                      }`}
                    >
                      {/* Datum */}
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {dateStr}
                      </td>

                      {/* Pošiljatelj */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {inq.name}
                        </div>
                        <a
                          href={`mailto:${inq.email}?subject=PeptideLab - Odgovor na upit`}
                          className="text-cyan-600 hover:text-cyan-800 font-mono text-[11px] inline-flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{inq.email}</span>
                        </a>
                      </td>

                      {/* Poruka */}
                      <td className="px-4 py-4 max-w-md">
                        <p
                          className={`text-slate-700 leading-relaxed text-xs ${
                            isExpanded ? "" : "line-clamp-2"
                          }`}
                        >
                          {inq.message}
                        </p>
                        {inq.message.length > 90 && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                            className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-800 mt-1 cursor-pointer"
                          >
                            {isExpanded ? "Prikaži manje" : "Prikaži cijelu poruku"}
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          {getStatusBadge(inq.status)}
                          <div>
                            <select
                              value={inq.status}
                              onChange={(e) =>
                                void onStatusChange(
                                  inq.id,
                                  e.target.value as AdminInquiry["status"],
                                )
                              }
                              className="text-[11px] py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                            >
                              <option value="NEW">Novo</option>
                              <option value="IN_PROGRESS">U obradi</option>
                              <option value="ANSWERED">Odgovoreno</option>
                              <option value="ARCHIVED">Arhiviraj</option>
                            </select>
                          </div>
                        </div>
                      </td>

                      {/* Akcije */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <a
                          href={`mailto:${inq.email}?subject=PeptideLab - Odgovor na Vaš upit&body=Poštovani/a ${encodeURIComponent(
                            inq.name,
                          )},%0D%0A%0D%0AHvala Vam na upitu vezanom uz PeptideLab proizvode.%0D%0A%0D%0AS poštovanjem,%0D%0APeptideLab Podrška`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Odgovori</span>
                          <ExternalLink className="w-3 h-3 text-cyan-500" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
