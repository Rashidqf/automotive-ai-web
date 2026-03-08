import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Gift,
  Phone,
  Mail,
  Building2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserDetailDialog } from "@/components/users/UserDetailDialog";
import { UserVehicleCard } from "@/components/users/UserVehicleCard";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { VehicleHistoryDialog } from "@/components/vehicles/VehicleHistoryDialog";
import { toast } from "sonner";
import { useUsersList, useUpdateUser, useDeleteUser, useVehicleHistory, useAdminCreateUser, useAssignUserDealerships, useRemoveUserDealership } from "@/hooks/useUsers";
import type { UserListItem, UserVehicle } from "@/lib/api";
import type { VehicleRecord } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { AssignDealershipModal } from "@/components/users/AssignDealershipModal";

const LIMIT = 9;

const Users = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserListItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteUserItem, setDeleteUserItem] = useState<UserListItem | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [assignDealershipUser, setAssignDealershipUser] = useState<UserListItem | null>(null);

  const { data, isLoading, isError, refetch } = useUsersList({
    page,
    limit: LIMIT,
    search: searchQuery,
    status: statusFilter,
  });
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const createUserMutation = useAdminCreateUser();
  const assignDealershipsMutation = useAssignUserDealerships();
  const removeDealershipMutation = useRemoveUserDealership();
  const { data: historyData, isLoading: historyLoading } = useVehicleHistory(selectedVehicleId);

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination ?? { page: 1, limit: LIMIT, total: 0, totalPages: 1 };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleViewUser = useCallback((user: UserListItem) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: UserListItem) => {
    setEditUser(user);
    setEditDialogOpen(true);
  }, []);

  const handleEditSaved = useCallback(() => {
    toast.success("User updated successfully");
    setEditUser(null);
    setEditDialogOpen(false);
  }, []);

  const handleSaveEdit = useCallback(
    async (id: string, body: { full_name?: string; email?: string; phone_number?: string; is_active?: boolean }) => {
      await updateUserMutation.mutateAsync({ id, body });
    },
    [updateUserMutation]
  );

  const handleDeleteClick = useCallback((user: UserListItem) => {
    setDeleteUserItem(user);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteUserItem) return;
    try {
      await deleteUserMutation.mutateAsync(deleteUserItem.id);
      toast.success("User deleted successfully");
      setDeleteUserItem(null);
    } catch {
      toast.error("Failed to delete user");
    }
  }, [deleteUserItem, deleteUserMutation]);

  const handleViewVehicleHistory = useCallback((vehicle: UserVehicle) => {
    const record: VehicleRecord = {
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      ownerName: "",
      lastServiceDate: vehicle.lastOilChange.split(" ")[0] || "",
      serviceType: "Oil Change",
      serviceCenter: vehicle.serviceStation,
      isPreferred: vehicle.isPreferredStation,
      nextServiceDue: "",
      totalServices: 0,
    };
    setSelectedVehicle(record);
    setSelectedVehicleId(vehicle.id);
    setHistoryDialogOpen(true);
  }, []);

  const handleAddUserSuccess = useCallback(() => {
    toast.success("User created successfully (auto-verified, no OTP required)");
    setAddUserOpen(false);
  }, []);

  const handleOpenAssignDealership = useCallback((user: UserListItem) => {
    setAssignDealershipUser(user);
  }, []);

  const handleAssignDealershipSuccess = useCallback(() => {
    toast.success("Dealerships assigned successfully");
    setAssignDealershipUser(null);
  }, []);

  const handleRemoveDealership = useCallback(
    async (userId: string, dealershipId: string) => {
      try {
        await removeDealershipMutation.mutateAsync({ userId, dealershipId });
        toast.success("Dealership removed from user");
      } catch {
        toast.error("Failed to remove dealership");
      }
    },
    [removeDealershipMutation]
  );

  const viewUserForDialog = selectedUser
    ? {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone,
      vehicles: selectedUser.vehicles,
      status: selectedUser.status,
      createdAt: selectedUser.createdAt,
    }
    : null;

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage all registered users and their vehicle information"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[300px] flex">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, vehicle number, or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
          <Button type="submit" variant="secondary" className="ml-2">
            Search
          </Button>
        </form>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2" onClick={() => toast.info("Export: use /admin/users/export")}>
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button className="gap-2 gradient-primary text-primary-foreground" onClick={() => setAddUserOpen(true)}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Failed to load users. Check your connection and try again.
          <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Users Card Grid */}
      {!isLoading && !isError && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl bg-card p-6 shadow-card transition-all hover:shadow-elevated"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-lg font-semibold text-primary-foreground">
                    {(user.name || "?").charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{user.name || "—"}</h3>
                    <p className="text-sm text-muted-foreground">{user.email || "—"}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "badge",
                    user.status === "active" ? "badge-success" : "badge-destructive"
                  )}
                >
                  {user.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.email || "—"}</span>
                </div>
                {(user.dealerships?.length ? user.dealerships.length > 0 : user.dealership) && (
                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0 self-center" />
                    {user.dealerships?.length ? (
                      user.dealerships.map((d) => (
                        <Badge
                          key={d.id}
                          variant="secondary"
                          className="gap-1 pr-1 font-normal"
                        >
                          <span className="truncate max-w-[120px]">{d.name}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${d.name}`}
                            className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveDealership(user.id, d.id);
                            }}
                            disabled={removeDealershipMutation.isPending}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-foreground">{user.dealership ?? "—"}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Vehicles ({user.vehicles.length})
                </p>
                {user.vehicles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No vehicles</p>
                ) : (
                  user.vehicles.map((vehicle) => (
                    <UserVehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onViewHistory={handleViewVehicleHistory}
                    />
                  ))
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border flex-wrap justify-center">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleViewUser(user)}>
                  <Eye className="h-4 w-4" /> View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEditUser(user)}>
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-accent" onClick={() => handleOpenAssignDealership(user)} title="Assign to dealership">
                  <Building2 className="h-4 w-4" />
                  Assign
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-accent" onClick={() => toast.success(`Offer sent to ${user.name}`)}>
                  <Gift className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-destructive" onClick={() => handleDeleteClick(user)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && users.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No users found.</p>
      )}

      {/* Pagination */}
      {!isLoading && !isError && pagination.totalPages > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={pagination.page === p ? "default" : "outline"}
                size="sm"
                className={pagination.page === p ? "gradient-primary text-primary-foreground" : ""}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <UserDetailDialog user={viewUserForDialog} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />

      <EditUserDialog
        user={editUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSaved={handleEditSaved}
        isSaving={updateUserMutation.isPending}
        onSave={handleSaveEdit}
      />

      <AlertDialog open={!!deleteUserItem} onOpenChange={(open) => !open && setDeleteUserItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate and soft-delete {deleteUserItem?.name || "this user"}. They will no longer appear in the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VehicleHistoryDialog
        vehicle={selectedVehicle}
        open={historyDialogOpen}
        onOpenChange={(open) => {
          setHistoryDialogOpen(open);
          if (!open) setSelectedVehicleId(null);
        }}
        historyData={historyData?.data ?? null}
        historyLoading={historyLoading}
      />

      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSubmit={async (body) => {
          await createUserMutation.mutateAsync(body);
        }}
        onSuccess={handleAddUserSuccess}
        isSubmitting={createUserMutation.isPending}
      />

      <AssignDealershipModal
        user={assignDealershipUser}
        open={!!assignDealershipUser}
        onOpenChange={(open) => !open && setAssignDealershipUser(null)}
        onSuccess={handleAssignDealershipSuccess}
        onAssign={async (userId, dealershipIds) => {
          await assignDealershipsMutation.mutateAsync({ userId, dealershipIds });
        }}
        isSubmitting={assignDealershipsMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default Users;
