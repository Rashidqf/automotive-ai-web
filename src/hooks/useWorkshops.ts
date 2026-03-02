import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkshopsList,
  createWorkshop,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop,
  type CreateWorkshopBody,
} from "@/lib/api";

const WORKSHOPS_KEY = "admin-workshops";

export function useWorkshopsList(params: {
  dealershipId: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: [WORKSHOPS_KEY, "list", params.dealershipId, params.page, params.limit, params.search],
    queryFn: () =>
      getWorkshopsList({
        dealershipId: params.dealershipId,
        page: params.page,
        limit: params.limit,
        search: params.search,
      }),
    enabled: !!params.dealershipId,
  });
}

export function useWorkshopById(id: string | null) {
  return useQuery({
    queryKey: [WORKSHOPS_KEY, "detail", id],
    queryFn: () => getWorkshopById(id!),
    enabled: !!id,
  });
}

export function useCreateWorkshop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateWorkshopBody) => createWorkshop(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [WORKSHOPS_KEY] }),
  });
}

export function useUpdateWorkshop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateWorkshopBody> }) => updateWorkshop(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [WORKSHOPS_KEY] }),
  });
}

export function useDeleteWorkshop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWorkshop(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [WORKSHOPS_KEY] }),
  });
}
