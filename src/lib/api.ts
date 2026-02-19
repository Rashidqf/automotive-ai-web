/**
 * API client for automotive-ai-api (admin dashboard).
 * Uses Bearer token from localStorage (key: auth_token).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://automotive-ai-api.onrender.com/api/v1";

const getToken = (): string | null => localStorage.getItem("auth_token");

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "Request failed") as Error & { status?: number; code?: string };
    err.status = res.status;
    err.code = data?.code;
    throw err;
  }
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export interface LoginResponse {
  success: boolean;
  data?: { token: string; user: { id: string; email: string; full_name?: string; userType: string } };
  message?: string;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface GetMeResponse {
  success: boolean;
  data: {
    id: string;
    full_name?: string;
    email?: string;
    userType: string;
    [key: string]: unknown;
  };
}

export function getMe(): Promise<GetMeResponse> {
  return apiRequest<GetMeResponse>("/auth/me");
}

// ─── Admin Users ───────────────────────────────────────────────────────────
export interface UserVehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  lastOilChange: string;
  serviceStation: string;
  isPreferredStation: boolean;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
  dealership: string | null;
  vehiclesCount: number;
  vehicles: UserVehicle[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersListResponse {
  success: boolean;
  data: {
    users: UserListItem[];
    pagination: Pagination;
  };
  message?: string;
}

export function getUsersList(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<UsersListResponse> {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search != null && params.search.trim()) sp.set("search", params.search.trim());
  if (params.status != null && params.status !== "all") sp.set("status", params.status);
  const q = sp.toString();
  return apiRequest<UsersListResponse>(`/admin/users${q ? `?${q}` : ""}`);
}

export interface UserDetailResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "active" | "inactive";
    createdAt: string;
    image?: unknown;
    dealership: string | null;
    vehicles: (UserVehicle & { vin?: string; year?: number; make?: string; model?: string; lastServiceDate?: string; preferredServiceCenter?: string })[];
  };
  message?: string;
}

export function getUserById(id: string): Promise<UserDetailResponse> {
  return apiRequest<UserDetailResponse>(`/admin/users/${id}`);
}

export interface UpdateUserBody {
  full_name?: string;
  email?: string;
  phone_number?: string;
  is_active?: boolean;
}

export function updateUser(id: string, body: UpdateUserBody): Promise<{ success: boolean; data: unknown; message?: string }> {
  return apiRequest(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteUser(id: string): Promise<{ success: boolean; data: null; message?: string }> {
  return apiRequest(`/admin/users/${id}`, { method: "DELETE" });
}

// ─── Admin Vehicle History (service history, recalls, NHTSA, maintenance) ───
export interface VehicleHistoryEntry {
  id: string;
  date: string;
  type: string;
  serviceCenter: string;
  isPreferred: boolean;
  cost?: string;
  notes?: string;
}

export interface RecallEntry {
  id: string;
  campaignNumber: string;
  component: string;
  summary: string;
  status: string;
}

export interface MaintenanceEntry {
  id: string;
  item: string;
  dueDate: string;
  mileage: string;
  priority: string;
}

export interface VehicleHistoryResponse {
  success: boolean;
  data: {
    vehicle: { id: string; vehicleNumber: string; vehicleType: string; vin: string; year: number; make: string; model: string };
    serviceHistory: VehicleHistoryEntry[];
    recalls: RecallEntry[];
    nhtsaRecalls: RecallEntry[];
    upcomingMaintenance: MaintenanceEntry[];
  };
  message?: string;
}

export function getVehicleHistory(vehicleId: string): Promise<VehicleHistoryResponse> {
  return apiRequest<VehicleHistoryResponse>(`/admin/vehicles/${vehicleId}/history`);
}

// ─── Admin Create User (auto-verified, no OTP) ───
export interface AdminCreateUserBody {
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  userType: "user" | "admin" | "dealership" | "employee";
  dealership?: string;
  designation?: string;
  access?: string[];
}

export function adminCreateUser(body: AdminCreateUserBody): Promise<{ success: boolean; data: { user: unknown }; message?: string }> {
  return apiRequest(`/auth/admin/create-user`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export { getToken };
