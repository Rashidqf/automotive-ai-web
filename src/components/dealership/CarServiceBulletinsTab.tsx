import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  decodeVin,
  getServiceBulletins,
  createServiceBulletin,
  type VinDecodeResult,
  type ServiceBulletinItem,
  type CreateServiceBulletinBody,
} from "@/lib/api";
import {
  Search,
  Car,
  Plus,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";

const serviceTypes = [
  "Oil Change",
  "Brake Maintenance",
  "Brake Inspection",
  "Tire Rotation",
  "Tire Replacement",
  "Transmission Service",
  "Coolant Flush",
  "Air Filter Replacement",
  "Spark Plug Replacement",
  "Battery Check/Replacement",
  "Alignment",
  "General Inspection",
  "Recall Service",
  "Other",
];

const PAGE_SIZE = 10;

interface CarServiceBulletinsTabProps {
  dealershipId: string;
}

export function CarServiceBulletinsTab({ dealershipId }: CarServiceBulletinsTabProps) {
  const { toast } = useToast();
  const [vinSearch, setVinSearch] = useState("");
  const [vinLoading, setVinLoading] = useState(false);
  const [decodedVehicle, setDecodedVehicle] = useState<VinDecodeResult["data"] | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [newBulletin, setNewBulletin] = useState({
    serviceType: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    nextDueDate: "",
    mileageAtService: "",
    notes: "",
    status: "completed" as "pending" | "completed" | "overdue",
  });

  const [statusTab, setStatusTab] = useState<"all" | "completed" | "pending" | "overdue" | "upcoming">("all");
  const [page, setPage] = useState(1);
  const [bulletinsData, setBulletinsData] = useState<{
    bulletins: ServiceBulletinItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  } | null>(null);
  const [bulletinsLoading, setBulletinsLoading] = useState(false);

  const fetchBulletins = async (p: number, status: typeof statusTab) => {
    setBulletinsLoading(true);
    try {
      const res = await getServiceBulletins({
        dealershipId,
        page: p,
        limit: PAGE_SIZE,
        status: status === "all" || status === "upcoming" ? undefined : status,
        upcoming: status === "upcoming" ? true : false,
      });
      setBulletinsData({
        bulletins: res.data.bulletins,
        pagination: res.data.pagination,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: (e as Error)?.message || "Failed to load service bulletins",
        variant: "destructive",
      });
    } finally {
      setBulletinsLoading(false);
    }
  };

  useEffect(() => {
    fetchBulletins(page, statusTab);
  }, [dealershipId, statusTab, page]);

  const handleVinSearch = async () => {
    const vin = vinSearch.replace(/\s+/g, "").toUpperCase();
    if (vin.length !== 17) {
      toast({
        title: "Invalid VIN",
        description: "VIN must be exactly 17 characters.",
        variant: "destructive",
      });
      return;
    }
    setVinLoading(true);
    setSearchPerformed(true);
    setDecodedVehicle(null);
    try {
      const res = await decodeVin(vin);
      if (res.success && res.data) {
        setDecodedVehicle(res.data);
      } else {
        toast({
          title: "VIN not found",
          description: (res as { message?: string }).message || "No vehicle data found for this VIN.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Search failed",
        description: (e as Error)?.message || "Could not decode VIN.",
        variant: "destructive",
      });
      setDecodedVehicle(null);
    } finally {
      setVinLoading(false);
    }
  };

  const vehicleInfoString = decodedVehicle
    ? [decodedVehicle.year, decodedVehicle.make, decodedVehicle.model].filter(Boolean).join(" ")
    : "";

  const handleOpenAddDialog = () => {
    if (!decodedVehicle) return;
    setNewBulletin({
      serviceType: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      nextDueDate: "",
      mileageAtService: "",
      notes: "",
      status: "completed",
    });
    setShowAddDialog(true);
  };

  const handleAddBulletin = async () => {
    if (!decodedVehicle || !newBulletin.serviceType || !newBulletin.date) {
      toast({
        title: "Validation Error",
        description: "Please fill Service Type and Service Date.",
        variant: "destructive",
      });
      return;
    }
    const payload: CreateServiceBulletinBody = {
      dealership: dealershipId,
      vin: decodedVehicle.vin,
      vehicleInfo: vehicleInfoString || undefined,
      customerName: customerName.trim() || undefined,
      serviceType: newBulletin.serviceType,
      description: newBulletin.description || undefined,
      date: newBulletin.date,
      nextDueDate: newBulletin.nextDueDate || undefined,
      mileageAtService: newBulletin.mileageAtService ? parseInt(newBulletin.mileageAtService, 10) : undefined,
      status: newBulletin.status,
      notes: newBulletin.notes || undefined,
    };
    try {
      await createServiceBulletin(payload);
      toast({
        title: "Service Bulletin Added",
        description: `${newBulletin.serviceType} saved successfully.`,
      });
      setShowAddDialog(false);
      setPage(1);
      fetchBulletins(1, statusTab);
    } catch (e) {
      toast({
        title: "Error",
        description: (e as Error)?.message || "Failed to save bulletin",
        variant: "destructive",
      });
    }
  };

  const bulletins = bulletinsData?.bulletins ?? [];
  const pagination = bulletinsData?.pagination ?? { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 };

  return (
    <div className="space-y-6">
      {/* VIN Lookup Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Vehicle VIN Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter 17-character VIN (e.g., 1HGBH41JXMN109186)"
              value={vinSearch}
              onChange={(e) => {
                setVinSearch(e.target.value.toUpperCase().replace(/[IOQ]/gi, ""));
                if (searchPerformed) {
                  setSearchPerformed(false);
                  setDecodedVehicle(null);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleVinSearch()}
              className="flex-1 font-mono"
              maxLength={17}
            />
            <Button onClick={handleVinSearch} disabled={!vinSearch.trim() || vinLoading}>
              {vinLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Look Up
            </Button>
          </div>

          {decodedVehicle && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="default">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Vehicle Found
                </Badge>
                <Button size="sm" onClick={handleOpenAddDialog}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service Bulletin
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="font-medium text-sm">
                      {[decodedVehicle.year, decodedVehicle.make, decodedVehicle.model].filter(Boolean).join(" ")}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">{decodedVehicle.vin}</p>
                  </div>
                </div>
                {decodedVehicle.trim && (
                  <div className="flex items-start gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Trim</p>
                      <p className="font-medium text-sm">{decodedVehicle.trim}</p>
                    </div>
                  </div>
                )}
                {decodedVehicle.bodyClass && (
                  <div className="flex items-start gap-2">
                    <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Body</p>
                      <p className="font-medium text-sm">{decodedVehicle.bodyClass}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {searchPerformed && !decodedVehicle && !vinLoading && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No vehicle data found for VIN <span className="font-mono font-medium">{vinSearch}</span>. Check the VIN or try again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Bulletins from DB with pagination */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Saved Service Bulletins</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={statusTab}
            onValueChange={(v) => {
              setStatusTab(v as typeof statusTab);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="all" className="gap-1.5">All</TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-1.5">
                <CalendarCheck className="h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-1.5">
                <Clock className="h-4 w-4" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="overdue" className="gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Overdue
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusTab} className="mt-4">
              {bulletinsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : bulletins.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {statusTab === "upcoming"
                    ? "No upcoming services. Add a bulletin with a Next Due Date to see it here."
                    : "No service bulletins yet."}
                </p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Mileage</TableHead>
                        <TableHead>Next Due</TableHead>
                      {/*  <TableHead>Status</TableHead> */}
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulletins.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.customerName || "—"}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{b.vehicleInfo || "—"}</p>
                              <p className="text-xs text-muted-foreground font-mono">{b.vin}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{b.serviceType}</Badge>
                          </TableCell>
                          <TableCell>{b.date}</TableCell>
                          <TableCell>{b.mileageAtService > 0 ? `${b.mileageAtService.toLocaleString()} mi` : "—"}</TableCell>
                          <TableCell>{b.nextDueDate || "—"}</TableCell>
                          {/* <TableCell>
                            <Badge
                              variant={
                                b.status === "completed" ? "default" : b.status === "overdue" ? "destructive" : "secondary"
                              }
                            >
                              {b.status}
                            </Badge>
                          </TableCell> */}
                          <TableCell>
                            <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
                              {b.notes || "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const p = page - 1;
                            setPage(p);
                            fetchBulletins(p, statusTab);
                          }}
                          disabled={pagination.page <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const p = page + 1;
                            setPage(p);
                            fetchBulletins(p, statusTab);
                          }}
                          disabled={pagination.page >= pagination.totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Service Bulletin Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[520px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add Service Bulletin</DialogTitle>
          </DialogHeader>
          {decodedVehicle && (
            <>
              <div className="rounded-lg border bg-muted/30 p-3 mb-2">
                <p className="text-sm font-medium">
                  {[decodedVehicle.year, decodedVehicle.make, decodedVehicle.model].filter(Boolean).join(" ")}
                </p>
                <p className="text-xs text-muted-foreground font-mono">{decodedVehicle.vin}</p>
              </div>
              <div className="grid gap-2 mb-2">
                <Label>Customer name (optional)</Label>
                <Input
                  placeholder="Customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Service Type *</Label>
              <Select
                value={newBulletin.serviceType}
                onValueChange={(val) => setNewBulletin((prev) => ({ ...prev, serviceType: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Details of the service performed..."
                value={newBulletin.description}
                onChange={(e) => setNewBulletin((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Service Date *</Label>
                <Input
                  type="date"
                  value={newBulletin.date}
                  onChange={(e) => setNewBulletin((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Next Due Date</Label>
                <Input
                  type="date"
                  value={newBulletin.nextDueDate}
                  onChange={(e) => setNewBulletin((prev) => ({ ...prev, nextDueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Mileage at Service</Label>
              <Input
                type="number"
                placeholder="0"
                value={newBulletin.mileageAtService}
                onChange={(e) => setNewBulletin((prev) => ({ ...prev, mileageAtService: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={newBulletin.status}
                onValueChange={(val: "pending" | "completed" | "overdue") =>
                  setNewBulletin((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={newBulletin.notes}
                onChange={(e) => setNewBulletin((prev) => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBulletin}
              disabled={!newBulletin.serviceType || !newBulletin.date}
            >
              Save Bulletin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
