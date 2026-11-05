"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

// ==========================================
// 1. GET PAGINATED SALARIES FOR AN EMPLOYEE
// ==========================================
export const useEmployeeSalaries = (
  employeeId: string,
  queryParams?: { page?: number; salaryMonth?: string; [key: string]: any },
  enabled = true
) => {
  return useQuery({
    queryKey: ["employee-salaries", employeeId, queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (queryParams?.page) params.append("page", queryParams.page.toString());
      if (queryParams?.salaryMonth) params.append("salaryMonth", queryParams.salaryMonth);

      Object.keys(queryParams || {}).forEach((key) => {
        if (key !== "page" && key !== "salaryMonth" && queryParams?.[key] !== undefined) {
          params.append(key, String(queryParams[key]));
        }
      });

      // Hits router.route('/:id').get(getEmployeeSalaries) where :id is the employeeId
      const response = await api.get(`/salaries/${employeeId}?${params.toString()}`);
      return response.data; // returns { success, totalRecords, resultsPerPage, currentPage, totalPages, data: salaries }
    },
    enabled: Boolean(employeeId) && enabled,
  });
};

// ==========================================
// 2. PAY SALARY MUTATION (Handles FormData & File)
// ==========================================
export const usePaySalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ salaryId, formData }: { salaryId: string; formData: FormData }) => {
      const response = await api.patch(`/salaries/${salaryId}/pay`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Salary marked as paid successfully!");
      queryClient.invalidateQueries({ queryKey: ["employee-salaries"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to pay salary");
    },
  });
};

// ==========================================
// 3. UNDO SALARY PAYMENT MUTATION
// ==========================================
export const useUndoSalaryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (salaryId: string) => {
      const response = await api.patch(`/salaries/${salaryId}/undo`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Salary payment undone!");
      queryClient.invalidateQueries({ queryKey: ["employee-salaries"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to undo salary payment");
    },
  });
};