import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeesList,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  updateEmployeeAccess,
  deleteEmployee,
  type CreateEmployeeBody,
} from "@/lib/api";

const EMPLOYEES_KEY = "admin-employees";

export function useEmployeesList(params: {
  page?: number;
  limit?: number;
  search?: string;
  dealershipId?: string | null;
  adminOnly?: boolean;
}) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, "list", params.page, params.limit, params.search, params.dealershipId, params.adminOnly],
    queryFn: () =>
      getEmployeesList({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        dealershipId: params.dealershipId || undefined,
        adminOnly: params.adminOnly,
      }),
  });
}

export function useEmployeeById(id: string | null) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, "detail", id],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEmployeeBody) => createEmployee(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateEmployeeBody> & { status?: string } }) =>
      updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}

export function useUpdateEmployeeAccessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, access }: { id: string; access: string[] }) => updateEmployeeAccess(id, access),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}
