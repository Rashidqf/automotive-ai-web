import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import {
  useWorkshopsList,
  useCreateWorkshop,
  useUpdateWorkshop,
  useDeleteWorkshop,
} from "@/hooks/useWorkshops";
import type { WorkshopListItem, WorkshopDaySchedule } from "@/lib/api";
import { Wrench, Plus, MoreVertical, Edit, Trash2, Search, MapPin, Star } from "lucide-react";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const defaultHours: WorkshopDaySchedule[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  openTime: "08:00",
  closeTime: "18:00",
  isClosed: false,
}));

type WorkshopFormData = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  phone: string;
  waitTime: string;
  status: "active" | "inactive";
  specialties: string;
  hours: WorkshopDaySchedule[];
};

const emptyForm: WorkshopFormData = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  latitude: "",
  longitude: "",
  phone: "",
  waitTime: "",
  status: "active",
  specialties: "",
  hours: defaultHours.map((h) => ({ ...h })),
};

interface WorkshopsTabProps {
  dealershipId: string;
}

export function WorkshopsTab({ dealershipId }: WorkshopsTabProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useWorkshopsList({
    dealershipId,
    page: 1,
    limit: 50,
    search: searchTerm || undefined,
  });
  const workshops: WorkshopListItem[] = data?.data?.workshops ?? [];

  const createMutation = useCreateWorkshop();
  const updateMutation = useUpdateWorkshop();
  const deleteMutation = useDeleteWorkshop();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopListItem | null>(null);
  const [formData, setFormData] = useState<WorkshopFormData>(emptyForm);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<WorkshopListItem | null>(null);

  const openCreate = () => {
    setEditingWorkshop(null);
    setFormData({
      ...emptyForm,
      hours: defaultHours.map((h) => ({ ...h })),
    });
    setIsDialogOpen(true);
  };

  const openEdit = (w: WorkshopListItem) => {
    setEditingWorkshop(w);
    const hours =
      w.hours?.length === 7
        ? w.hours
        : defaultHours.map((d) => {
            const existing = w.hours?.find((h) => h.dayOfWeek === d.dayOfWeek);
            return existing
              ? { dayOfWeek: d.dayOfWeek, openTime: existing.openTime ?? "08:00", closeTime: existing.closeTime ?? "18:00", isClosed: !!existing.isClosed }
              : { ...d };
          });
    setFormData({
      name: w.name,
      address: w.address,
      city: w.city ?? "",
      state: w.state ?? "",
      zipCode: w.zipCode ?? "",
      latitude: w.latitude != null ? String(w.latitude) : "",
      longitude: w.longitude != null ? String(w.longitude) : "",
      phone: w.phone ?? "",
      waitTime: w.waitTime ?? "",
      status: (w.status as "active" | "inactive") || "active",
      specialties: Array.isArray(w.specialties) ? w.specialties.join(", ") : "",
      hours,
    });
    setIsDialogOpen(true);
  };

  const setHour = (dayOfWeek: number, field: keyof WorkshopDaySchedule, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      hours: prev.hours.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      ),
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      toast({ title: "Validation Error", description: "Name and address are required.", variant: "destructive" });
      return;
    }
    const payload = {
      dealership: dealershipId,
      name: formData.name.trim(),
      address: formData.address.trim(),
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      zipCode: formData.zipCode.trim() || undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      phone: formData.phone.trim() || undefined,
      waitTime: formData.waitTime.trim() || undefined,
      status: formData.status,
      specialties: formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hours: formData.hours,
    };
    try {
      if (editingWorkshop) {
        await updateMutation.mutateAsync({ id: editingWorkshop.id, body: payload });
        toast({ title: "Workshop Updated", description: `${formData.name} has been updated.` });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Workshop Added", description: `${formData.name} has been added.` });
      }
      setFormData(emptyForm);
      setEditingWorkshop(null);
      setIsDialogOpen(false);
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: (e as Error)?.message || "Failed to save workshop.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (w: WorkshopListItem) => {
    setWorkshopToDelete(w);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!workshopToDelete) return;
    try {
      await deleteMutation.mutateAsync(workshopToDelete.id);
      toast({ title: "Workshop Removed", description: `${workshopToDelete.name} has been removed.` });
      setWorkshopToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: (e as Error)?.message || "Failed to delete workshop.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{workshops.length}</p>
                <p className="text-xs text-muted-foreground">Workshops</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Workshops</h2>
          <div className="flex gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button className="gap-2" onClick={openCreate} disabled={createMutation.isPending}>
              <Plus className="h-4 w-4" />
              Add Workshop
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No workshops yet. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  workshops.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-medium">{w.name}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                          {[w.address, w.city, w.state].filter(Boolean).join(", ")}
                        </span>
                      </TableCell>
                      <TableCell>{w.phone || "—"}</TableCell>
                      <TableCell>
                        {w.rating != null ? (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-warning fill-warning" />
                            {w.rating} ({w.reviewCount})
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={w.status === "active" ? "default" : "secondary"}>{w.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => openEdit(w)}>
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => openDeleteDialog(w)}
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
          </div>
        )}
      </div>

      {/* Add/Edit Workshop Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingWorkshop ? "Edit Workshop" : "Add Workshop"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Workshop name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                placeholder="Zip"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude (for distance)</Label>
                <Input
                  id="latitude"
                  placeholder="e.g. 37.4"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude (for distance)</Label>
                <Input
                  id="longitude"
                  placeholder="e.g. -122.1"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitTime">Wait Time (e.g. Same day, 1-2 days)</Label>
              <Input
                id="waitTime"
                placeholder="Same day"
                value={formData.waitTime}
                onChange={(e) => setFormData({ ...formData, waitTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (comma-separated)</Label>
              <Input
                id="specialties"
                placeholder="EV Certified, Recall Service"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hours (per day)</Label>
              <div className="rounded border p-3 space-y-2 max-h-48 overflow-y-auto">
                {formData.hours.map((h) => (
                  <div key={h.dayOfWeek} className="flex items-center gap-2 flex-wrap">
                    <span className="w-10 text-sm font-medium">{DAY_NAMES[h.dayOfWeek]}</span>
                    <Checkbox
                      checked={!!h.isClosed}
                      onCheckedChange={(c) => setHour(h.dayOfWeek, "isClosed", !!c)}
                    />
                    <Label className="text-xs text-muted-foreground">Closed</Label>
                    {!h.isClosed && (
                      <>
                        <Input
                          type="time"
                          className="w-24 h-8"
                          value={h.openTime || "08:00"}
                          onChange={(e) => setHour(h.dayOfWeek, "openTime", e.target.value)}
                        />
                        <span className="text-muted-foreground">–</span>
                        <Input
                          type="time"
                          className="w-24 h-8"
                          value={h.closeTime || "18:00"}
                          onChange={(e) => setHour(h.dayOfWeek, "closeTime", e.target.value)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                className="rounded border px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingWorkshop ? "Update Workshop" : "Add Workshop"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workshop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{workshopToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
