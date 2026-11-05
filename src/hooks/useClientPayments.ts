"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

// ==========================================
// 1. GET ALL PAYMENTS (Paginated list)
// ==========================================
export const useClientPayments = (
  clientId: string,
  queryParams?: { page?: number; keyword?: string }
) => {
  return useQuery({
    queryKey: ["client-payments", clientId, queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (queryParams?.page) params.append("page", queryParams.page.toString());
      if (queryParams?.keyword) params.append("keyword", queryParams.keyword);

      const response = await api.get(`/clients/${clientId}/payments?${params.toString()}`);
      return response.data; // returns { success, totalCount, totalPages, currentPage, resultsPerPage, data: payments }
    },
    enabled: Boolean(clientId),
  });
};

// ==========================================
// 2. GET MONTHLY LEDGER (For Retainer Clients)
// ==========================================
export const useClientMonthlyLedger = (clientId: string, enabled = true) => {
  return useQuery({
    queryKey: ["client-monthly-ledger", clientId],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}/payments/ledger`);
      return response.data; // returns { success, summary, data: months }
    },
    enabled: Boolean(clientId) && enabled,
  });
};

// ==========================================
// 3. GET PAYMENTS FOR A SPECIFIC MONTH
// ==========================================
export const useMonthPayments = (clientId: string, monthYear: string, enabled = true) => {
  return useQuery({
    queryKey: ["client-month-payments", clientId, monthYear],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}/payments/month/${monthYear}`);
      return response.data; // returns { success, month, data: payments }
    },
    enabled: Boolean(clientId) && Boolean(monthYear) && enabled,
  });
};

// ==========================================
// 4. ADD PAYMENT MUTATION (Handles FormData & File)
// ==========================================
export const useAddClientPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, formData }: { clientId: string; formData: FormData }) => {
      const response = await api.post(`/clients/${clientId}/payments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Payment recorded successfully!");
      queryClient.invalidateQueries({ queryKey: ["client-payments", variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ["client-monthly-ledger", variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ["client-month-payments", variables.clientId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to record payment");
    },
  });
};

// ==========================================
// 5. UPDATE PAYMENT MUTATION
// ==========================================
export const useUpdateClientPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, formData }: { paymentId: string; formData: FormData }) => {
      const response = await api.put(`/client-payments/${paymentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Payment record updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["client-payments"] });
      queryClient.invalidateQueries({ queryKey: ["client-monthly-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["client-month-payments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update payment");
    },
  });
};

// ==========================================
// 6. DELETE PAYMENT MUTATION
// ==========================================
export const useDeleteClientPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await api.delete(`/client-payments/${paymentId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Payment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["client-payments"] });
      queryClient.invalidateQueries({ queryKey: ["client-monthly-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["client-month-payments"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete payment");
    },
  });
};