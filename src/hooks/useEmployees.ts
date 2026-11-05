"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

// ==========================================
// 1. GET ALL EMPLOYEES (Paginated list & Summary)
// ==========================================
export const useEmployees = (queryParams?: { page?: number; keyword?: string; [key: string]: any }, enabled = true) => {
  return useQuery({
    queryKey: ["employees", queryParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (queryParams?.page) params.append("page", queryParams.page.toString());
      if (queryParams?.keyword) params.append("keyword", queryParams.keyword);

      Object.keys(queryParams || {}).forEach((key) => {
        if (key !== "page" && key !== "keyword" && queryParams?.[key] !== undefined) {
          params.append(key, String(queryParams[key]));
        }
      });

      const response = await api.get(`/employees?${params.toString()}`);
      return response.data; 
    },
    enabled: Boolean(enabled),
  });
};

// ==========================================
// 2. GET SINGLE EMPLOYEE BY ID
// ==========================================
export const useEmployeeById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const response = await api.get(`/employees/${id}`);
      return response.data; 
    },
    enabled: Boolean(id) && enabled,
  });
};

// ==========================================
// 3. CREATE EMPLOYEE MUTATION
// ==========================================
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/employees", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Employee created successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create employee");
    },
  });
};

// ==========================================
// 4. UPDATE EMPLOYEE MUTATION
// ==========================================
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const response = await api.patch(`/employees/${id}`, payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Employee updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update employee");
    },
  });
};

// ==========================================
// 5. UPDATE EMPLOYEE STATUS MUTATION
// ==========================================
export const useSetEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await api.patch(`/employees/${id}/status`, { isActive });
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Employee status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update employee status");
    },
  });
};