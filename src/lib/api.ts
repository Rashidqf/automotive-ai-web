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
    dealershipId?: string | null;
    access?: string[];
    employee?: { _id: string; dealership: string; access?: string[] };
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

export interface UserDealershipRef {
  id: string;
  name: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
  dealership: string | null;
  dealerships?: UserDealershipRef[];
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
    dealerships?: UserDealershipRef[];
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

export function assignUserDealerships(
  userId: string,
  dealershipIds: string[]
): Promise<{ success: boolean; data: { dealerships: UserDealershipRef[] }; message?: string }> {
  return apiRequest(`/admin/users/${userId}/dealerships`, {
    method: "PUT",
    body: JSON.stringify({ dealershipIds }),
  });
}

export function removeUserDealership(
  userId: string,
  dealershipId: string
): Promise<{ success: boolean; data: { dealerships: UserDealershipRef[] }; message?: string }> {
  return apiRequest(`/admin/users/${userId}/dealerships/${dealershipId}`, { method: "DELETE" });
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

// ─── Admin Dealerships ────────────────────────────────────────────────────
export interface DealershipListItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
  username: string;
  referralCode: string;
  createdAt: string;
  status: string;
}

export interface DealershipsListResponse {
  success: boolean;
  data: {
    dealerships: DealershipListItem[];
    pagination: Pagination;
  };
  message?: string;
}

export function getDealershipsList(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<DealershipsListResponse> {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search != null && params.search.trim()) sp.set("search", params.search.trim());
  const q = sp.toString();
  return apiRequest<DealershipsListResponse>(`/admin/dealerships${q ? `?${q}` : ""}`);
}

export interface DealershipDetailResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number | null;
    longitude?: number | null;
    username: string;
    referralCode: string;
    status: string;
    createdAt: string;
  };
  message?: string;
}

export function getDealershipById(id: string): Promise<DealershipDetailResponse> {
  return apiRequest<DealershipDetailResponse>(`/admin/dealerships/${id}`);
}

export interface CreateDealershipBody {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
  username?: string;
}

export interface UpdateDealershipBody {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  username?: string;
  status?: "active" | "inactive";
}

export function createDealership(body: CreateDealershipBody): Promise<{ success: boolean; data: unknown; message?: string }> {
  return apiRequest("/admin/dealerships", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateDealership(id: string, body: UpdateDealershipBody): Promise<{ success: boolean; data: unknown; message?: string }> {
  return apiRequest(`/admin/dealerships/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteDealership(id: string): Promise<{ success: boolean; data: null; message?: string }> {
  return apiRequest(`/admin/dealerships/${id}`, { method: "DELETE" });
}

// ─── Admin Employees ───────────────────────────────────────────────────────
export interface EmployeeListItem {
  id: string;
  name: string;
  designation: string;
  joiningDate?: string;
  status: string;
  createdAt: string;
  access?: string[];
  dealershipName?: string;
  dealershipId?: string;
  hasLogin?: boolean;
  createdById?: string;
  createdByRole?: string;
  createdByName?: string;
}

export interface EmployeesListResponse {
  success: boolean;
  data: {
    employees: EmployeeListItem[];
    pagination: Pagination;
  };
  message?: string;
}

export function getEmployeesList(params: {
  page?: number;
  limit?: number;
  search?: string;
  dealershipId?: string;
  adminOnly?: boolean;
}): Promise<EmployeesListResponse> {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search != null && params.search.trim()) sp.set("search", params.search.trim());
  if (params.dealershipId != null) sp.set("dealershipId", params.dealershipId);
  if (params.adminOnly === true) sp.set("adminOnly", "1");
  const q = sp.toString();
  return apiRequest<EmployeesListResponse>(`/admin/employees${q ? `?${q}` : ""}`);
}

export interface CreateEmployeeBody {
  dealership?: string;
  name: string;
  designation?: string;
  email?: string;
  phone?: string;
  password?: string;
  joiningDate?: string | null;
  access?: string[];
}

export function createEmployee(body: CreateEmployeeBody): Promise<{ success: boolean; data: unknown; message?: string }> {
  return apiRequest("/admin/employees", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getEmployeeById(id: string): Promise<{ success: boolean; data: EmployeeListItem & { email?: string; phone?: string; dealership?: unknown }; message?: string }> {
  return apiRequest(`/admin/employees/${id}`);
}

export function updateEmployee(id: string, body: Partial<CreateEmployeeBody> & { status?: string }): Promise<{ success: boolean; data: unknown; message?: string }> {
  return apiRequest(`/admin/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function updateEmployeeAccess(id: string, access: string[]): Promise<{ success: boolean; data: unknown; message?: string }> {
  return apiRequest(`/admin/employees/${id}/access`, {
    method: "PATCH",
    body: JSON.stringify({ access }),
  });
}

export function deleteEmployee(id: string): Promise<{ success: boolean; data: null; message?: string }> {
  return apiRequest(`/admin/employees/${id}`, { method: "DELETE" });
}

// ─── VIN Decode (NHTSA via mob-app) ────────────────────────────────────────
export interface VinDecodeResult {
  success: boolean;
  data?: {
    vin: string;
    year: number | null;
    make: string | null;
    model: string | null;
    trim?: string | null;
    bodyClass?: string | null;
    vehicleType?: string | null;
    [key: string]: unknown;
  };
  message?: string;
}

export function decodeVin(vin: string): Promise<VinDecodeResult> {
  const clean = vin.replace(/\s+/g, "").toUpperCase();
  return apiRequest<VinDecodeResult>(`/mob-app/vin/decode/${encodeURIComponent(clean)}`);
}

// ─── Service Bulletins (dealership) ────────────────────────────────────────
export interface ServiceBulletinItem {
  id: string;
  customerId?: string;
  customerName?: string;
  vin: string;
  vehicleInfo: string;
  serviceType: string;
  description?: string;
  date: string;
  nextDueDate: string | null;
  mileageAtService: number;
  status: "pending" | "completed" | "overdue";
  notes?: string;
  createdAt: string;
}

export interface ServiceBulletinsListResponse {
  success: boolean;
  data: {
    bulletins: ServiceBulletinItem[];
    pagination: Pagination;
  };
  message?: string;
}

export function getServiceBulletins(params: {
  dealershipId: string;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  upcoming?: boolean;
}): Promise<ServiceBulletinsListResponse> {
  const sp = new URLSearchParams();
  if (params.dealershipId) sp.set("dealershipId", params.dealershipId);
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.status && ["pending", "completed", "overdue"].includes(params.status)) sp.set("status", params.status);
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.upcoming) sp.set("upcoming", "1");
  const q = sp.toString();
  return apiRequest<ServiceBulletinsListResponse>(`/admin/service-bulletins${q ? `?${q}` : ""}`);
}

export interface CreateServiceBulletinBody {
  dealership?: string;
  vin: string;
  vehicleInfo?: string;
  customerName?: string;
  customerId?: string | null;
  serviceType: string;
  description?: string;
  date: string;
  nextDueDate?: string | null;
  mileageAtService?: number;
  status?: "pending" | "completed" | "overdue";
  notes?: string;
}

export function createServiceBulletin(body: CreateServiceBulletinBody): Promise<{ success: boolean; data: { id: string }; message?: string }> {
  return apiRequest("/admin/service-bulletins", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Workshops (dealership) ────────────────────────────────────────────────
export interface WorkshopDaySchedule {
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
}

export interface WorkshopListItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  hours: WorkshopDaySchedule[];
  specialties: string[];
  waitTime: string;
  status: string;
  rating: number | null;
  reviewCount: number;
  createdAt: string;
}

export interface WorkshopsListResponse {
  success: boolean;
  data: { workshops: WorkshopListItem[]; pagination: Pagination };
  message?: string;
}

export function getWorkshopsList(params: {
  dealershipId: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<WorkshopsListResponse> {
  const sp = new URLSearchParams();
  if (params.dealershipId) sp.set("dealershipId", params.dealershipId);
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search?.trim()) sp.set("search", params.search.trim());
  const q = sp.toString();
  return apiRequest<WorkshopsListResponse>(`/admin/workshops${q ? `?${q}` : ""}`);
}

export interface CreateWorkshopBody {
  dealership?: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  hours?: WorkshopDaySchedule[];
  specialties?: string[];
  waitTime?: string;
  status?: "active" | "inactive";
}

export function createWorkshop(body: CreateWorkshopBody): Promise<{ success: boolean; data: { id: string }; message?: string }> {
  return apiRequest("/admin/workshops", { method: "POST", body: JSON.stringify(body) });
}

export function getWorkshopById(id: string): Promise<{ success: boolean; data: WorkshopListItem; message?: string }> {
  return apiRequest(`/admin/workshops/${id}`);
}

export function updateWorkshop(id: string, body: Partial<CreateWorkshopBody>): Promise<{ success: boolean; data: unknown; message?: string }> {
  return apiRequest(`/admin/workshops/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteWorkshop(id: string): Promise<{ success: boolean; data: null; message?: string }> {
  return apiRequest(`/admin/workshops/${id}`, { method: "DELETE" });
}

export { getToken };
