import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, MapPin, Building2, Edit, Trash2, MoreVertical, Eye, Copy, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DealershipListItem } from "@/lib/api";
import {
  useDealershipsList,
  useCreateDealership,
  useUpdateDealership,
  useDeleteDealership,
} from "@/hooks/useDealerships";

const PAGE_SIZE = 20;

type FormData = {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  username: string;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  password: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  latitude: "",
  longitude: "",
  username: "",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return iso;
  }
}

const Dealerships = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDealership, setEditingDealership] = useState<DealershipListItem | null>(null);
  const [dealershipToDelete, setDealershipToDelete] = useState<DealershipListItem | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useDealershipsList({
    page,
    limit: PAGE_SIZE,
    search: searchTerm,
  });
  const createMutation = useCreateDealership();
  const updateMutation = useUpdateDealership();
  const deleteMutation = useDeleteDealership();

  const dealerships = useMemo(() => data?.data?.dealerships ?? [], [data]);
  const pagination = data?.data?.pagination;

  const handleViewDealership = (dealership: DealershipListItem) => {
    navigate(`/dealerships/${dealership.id}`);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData((prev) => ({
            ...prev,
            latitude: String(lat),
            longitude: String(lng),
          }));
          toast({
            title: "Location set",
            description: `Lat: ${lat.toFixed(4)}, Long: ${lng.toFixed(4)}`,
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const handleOpenCreate = () => {
    setEditingDealership(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (dealership: DealershipListItem) => {
    setEditingDealership(dealership);
    setFormData({
      name: dealership.name,
      email: "",
      password: "",
      address: dealership.address,
      city: dealership.city,
      state: dealership.state,
      zipCode: dealership.zipCode,
      latitude: dealership.latitude != null ? String(dealership.latitude) : "",
      longitude: dealership.longitude != null ? String(dealership.longitude) : "",
      username: dealership.username,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Dealership name is required.",
        variant: "destructive",
      });
      return;
    }
    if (!editingDealership) {
      if (!formData.email.trim() || !formData.password) {
        toast({
          title: "Validation Error",
          description: "Email and password are required for new dealership.",
          variant: "destructive",
        });
        return;
      }
      if (formData.password.length < 6) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 6 characters.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
        toast({
          title: "Validation Error",
          description: "Address, city, state and ZIP are required.",
          variant: "destructive",
        });
        return;
      }
    }

    const lat = formData.latitude ? parseFloat(formData.latitude) : undefined;
    const lng = formData.longitude ? parseFloat(formData.longitude) : undefined;
    if (formData.latitude && (Number.isNaN(lat) || Number.isNaN(lng))) {
      toast({
        title: "Validation Error",
        description: "Latitude and longitude must be valid numbers.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingDealership) {
        await updateMutation.mutateAsync({
          id: editingDealership.id,
          body: {
            name: formData.name.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zipCode: formData.zipCode.trim(),
            username: formData.username.trim() || undefined,
            latitude: lat ?? null,
            longitude: lng ?? null,
          },
        });
        toast({
          title: "Dealership Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          username: formData.username.trim() || undefined,
          latitude: lat ?? undefined,
          longitude: lng ?? undefined,
        });
        toast({
          title: "Dealership Created",
          description: `${formData.name} has been added successfully.`,
        });
      }
      setFormData(emptyForm);
      setEditingDealership(null);
      setIsDialogOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      toast({
        title: editingDealership ? "Update failed" : "Create failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!dealershipToDelete) return;
    try {
      await deleteMutation.mutateAsync(dealershipToDelete.id);
      toast({
        title: "Dealership Deleted",
        description: `${dealershipToDelete.name} has been removed.`,
      });
      setDealershipToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      toast({
        title: "Delete failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (dealership: DealershipListItem) => {
    setDealershipToDelete(dealership);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout title="Dealerships" subtitle="Manage your dealership network">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button className="gap-2" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            Add Dealership
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dealerships..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <p>Failed to load dealerships.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Referral Link</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealerships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No dealerships found.
                    </TableCell>
                  </TableRow>
                ) : (
                  dealerships.map((dealership) => (
                    <TableRow key={dealership.id} className="group">
                      <TableCell className="font-medium">{dealership.name}</TableCell>
                      <TableCell>
                        {dealership.city}, {dealership.state} {dealership.zipCode}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[180px]">
                            {`${window.location.origin}/r/${dealership.referralCode}`}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                `${window.location.origin}/r/${dealership.referralCode}`
                              );
                              toast({
                                title: "Link Copied",
                                description: "Referral link copied to clipboard.",
                              });
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{dealership.username}</TableCell>
                      <TableCell>{formatDate(dealership.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={dealership.status === "active" ? "default" : "secondary"}
                        >
                          {dealership.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleViewDealership(dealership)}
                            >
                              <Eye className="h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => handleOpenEdit(dealership)}
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => openDeleteDialog(dealership)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-2">
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {editingDealership ? "Edit Dealership" : "Create New Dealership"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dealership Name *</Label>
              <Input
                id="name"
                placeholder="Enter dealership name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {!editingDealership && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="dealer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password * (min 6 characters)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="90001"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="dealer_username (optional)"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 34.0522"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. -118.2437"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleUseCurrentLocation}
            >
              <MapPin className="h-4 w-4" />
              Use Current Location
            </Button>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingDealership ? "Update Dealership" : "Create Dealership"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dealership</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{dealershipToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Dealerships;
