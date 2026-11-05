import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client"; 
import { toast } from "sonner"; 

export const useTransactions = (queryParams?: { page?: number; startDate?: string; endDate?: string; [key: string]: any }) => {
  return useQuery({
    queryKey: ["transactions", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (queryParams?.page) params.append("page", queryParams.page.toString());
      if (queryParams?.startDate) params.append("startDate", queryParams.startDate);
      if (queryParams?.endDate) params.append("endDate", queryParams.endDate);

      Object.keys(queryParams || {}).forEach((key) => {
        if (key !== "page" && key !== "startDate" && key !== "endDate" && queryParams?.[key] !== undefined) {
          params.append(key, String(queryParams[key]));
        }
      });

      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data; // returns { success, totalRecords, resultsPerPage, currentPage, totalPages, data: transactions }
    },
  });
};

// 2. Get Transaction Summary (Incoming, Outgoing, Net Balance)
export const useTransactionSummary = (queryParams?: { startDate?: string; endDate?: string; [key: string]: any }) => {
  return useQuery({
    queryKey: ["transaction-summary", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (queryParams?.startDate) params.append("startDate", queryParams.startDate);
      if (queryParams?.endDate) params.append("endDate", queryParams.endDate);

      Object.keys(queryParams || {}).forEach((key) => {
        if (key !== "startDate" && key !== "endDate" && queryParams?.[key] !== undefined) {
          params.append(key, String(queryParams[key]));
        }
      });

      const response = await api.get(`/transactions/summary?${params.toString()}`);
      return response.data; // returns { success, summary: { totalIncoming, totalOutgoing, netBalance } }
    },
  });
};

// 3. Add New Transaction (Supports multipart/form-data for file upload)
export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/transactions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Transaction added successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-summary"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add transaction");
    },
  });
};

// 4. Delete Transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Transaction deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-summary"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete transaction");
    },
  });
};