import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDealershipsList,
  getDealershipById,
  createDealership,
  updateDealership,
  deleteDealership,
  type CreateDealershipBody,
  type UpdateDealershipBody,
} from "@/lib/api";

const DEALERSHIPS_KEY = "admin-dealerships";

export function useDealershipsList(params: {
  page: number;
  limit: number;
  search: string;
}) {
  return useQuery({
    queryKey: [DEALERSHIPS_KEY, "list", params.page, params.limit, params.search],
    queryFn: () =>
      getDealershipsList({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
      }),
  });
}

export function useDealershipById(id: string | null) {
  return useQuery({
    queryKey: [DEALERSHIPS_KEY, "detail", id],
    queryFn: () => getDealershipById(id!),
    enabled: !!id,
  });
}

export function useCreateDealership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDealershipBody) => createDealership(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEALERSHIPS_KEY] });
    },
  });
}

export function useUpdateDealership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateDealershipBody }) =>
      updateDealership(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEALERSHIPS_KEY] });
    },
  });
}

export function useDeleteDealership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDealership(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEALERSHIPS_KEY] });
    },
  });
}
