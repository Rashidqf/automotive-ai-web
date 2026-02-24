import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsersList,
  getUserById,
  updateUser,
  deleteUser,
  getVehicleHistory,
  adminCreateUser,
  assignUserDealerships,
  removeUserDealership,
  type UpdateUserBody,
  type UserListItem,
  type AdminCreateUserBody,
} from "@/lib/api";

const USERS_KEY = "admin-users";
const VEHICLE_HISTORY_KEY = "admin-vehicle-history";

export function useUsersList(params: {
  page: number;
  limit: number;
  search: string;
  status: string;
}) {
  return useQuery({
    queryKey: [USERS_KEY, "list", params.page, params.limit, params.search, params.status],
    queryFn: () =>
      getUsersList({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        status: params.status === "all" ? undefined : params.status,
      }),
  });
}

export function useUserById(id: string | null) {
  return useQuery({
    queryKey: [USERS_KEY, "detail", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserBody }) => updateUser(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useVehicleHistory(vehicleId: string | null) {
  return useQuery({
    queryKey: [VEHICLE_HISTORY_KEY, vehicleId],
    queryFn: () => getVehicleHistory(vehicleId!),
    enabled: !!vehicleId,
  });
}

export function useAdminCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminCreateUserBody) => adminCreateUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useAssignUserDealerships() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, dealershipIds }: { userId: string; dealershipIds: string[] }) =>
      assignUserDealerships(userId, dealershipIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useRemoveUserDealership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, dealershipId }: { userId: string; dealershipId: string }) =>
      removeUserDealership(userId, dealershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}
