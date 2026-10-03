import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  type AdminInquiry,
  fetchAdminInquiries,
  updateAdminInquiryStatus,
} from "../../services/adminApi";

export function useAdminInquiries(adminKey: string) {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState<boolean>(false);

  const loadInquiries = useCallback(
    async (key = adminKey) => {
      if (!key) return;
      setIsLoadingInquiries(true);
      try {
        const data = await fetchAdminInquiries(key);
        setInquiries(data);
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Neuspjelo dohvaćanje upita",
        );
      } finally {
        setIsLoadingInquiries(false);
      }
    },
    [adminKey],
  );

  const handleInquiryStatusChange = useCallback(
    async (
      id: number,
      status: "NEW" | "IN_PROGRESS" | "ANSWERED" | "ARCHIVED",
    ) => {
      if (!adminKey) return;
      try {
        await updateAdminInquiryStatus(adminKey, id, status);
        toast.success("Status upita ažuriran.");
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
        );
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Greška pri ažuriranju upita",
        );
      }
    },
    [adminKey],
  );

  const newInquiriesCount = useMemo(() => {
    return inquiries.filter((i) => i.status === "NEW").length;
  }, [inquiries]);

  const resetInquiriesState = useCallback(() => {
    setInquiries([]);
  }, []);

  return {
    inquiries,
    isLoadingInquiries,
    loadInquiries,
    handleInquiryStatusChange,
    newInquiriesCount,
    resetInquiriesState,
  };
}
