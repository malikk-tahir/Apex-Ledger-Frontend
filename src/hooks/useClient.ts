import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";
import { ClientFormValues } from "@/schemaValidators/clientSchema"; 

// 1. Get All Clients (with Pagination, Search, and Filters)
export const useClients = (page: number = 1, searchQuery?: string, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["clients", page, searchQuery, filters],
    queryFn: async () => {
      // Build query string dynamically matching your ApiFeatures backend
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (searchQuery) params.append("keyword", searchQuery);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });
      }

      const response = await api.get(`/clients?${params.toString()}`);
      return response.data; // Returns { success, totalCount, totalPages, currentPage, resultsPerPage, data }
    },
    placeholderData: (previousData) => previousData, // Keeps previous page data while loading new page smoothly
  });
};

// 2. Get Single Client by ID
export const useClientById = (clientId?: string) => {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}`);
      return response.data?.data;
    },
    enabled: Boolean(clientId),
  });
};

// 3. Create Client Mutation
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: ClientFormValues) => {
      const response = await api.post("/clients", clientData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Client Created Successfully");

      // Invalidate and refetch client listings
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed To Create Client"
      );
    },
  });
};

// 4. Update Client Mutation
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...clientData }: { id: string } & Partial<ClientFormValues>) => {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Client Updated Successfully");

      // Invalidate specific client and general client lists
      queryClient.invalidateQueries({
        queryKey: ["client", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed To Update Client"
      );
    },
  });
};