import { useState } from "react";
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
  Search,
  Car,
  User,
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  Wrench,
} from "lucide-react";

// Mock customer database (simulates app auto users)
interface AppAutoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vin: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  mileage: number;
}

interface ServiceBulletin {
  id: string;
  customerId: string;
  customerName: string;
  vin: string;
  vehicleInfo: string;
  serviceType: string;
  description: string;
  date: string;
  nextDueDate: string | null;
  mileageAtService: number;
  status: "completed" | "upcoming";
  notes: string;
}

const mockAppAutoCustomers: AppAutoCustomer[] = [
  { id: "c1", name: "John Smith", email: "john.smith@email.com", phone: "+1 (555) 123-4567", vin: "1HGBH41JXMN109186", vehicleYear: 2021, vehicleMake: "Honda", vehicleModel: "Civic", mileage: 34500 },
  { id: "c2", name: "Emily Johnson", email: "emily.johnson@email.com", phone: "+1 (555) 234-5678", vin: "5YJSA1DG9DFP14705", vehicleYear: 2022, vehicleMake: "Tesla", vehicleModel: "Model S", mileage: 21000 },
  { id: "c3", name: "Michael Davis", email: "michael.davis@email.com", phone: "+1 (555) 345-6789", vin: "WVWZZZ3CZWE123456", vehicleYear: 2020, vehicleMake: "Volkswagen", vehicleModel: "Jetta", mileage: 48200 },
  { id: "c4", name: "Sarah Williams", email: "sarah.williams@email.com", phone: "+1 (555) 456-7890", vin: "JN1TANT31U0000001", vehicleYear: 2023, vehicleMake: "Nissan", vehicleModel: "Altima", mileage: 12800 },
];

const initialBulletins: ServiceBulletin[] = [
  { id: "sb1", customerId: "c1", customerName: "John Smith", vin: "1HGBH41JXMN109186", vehicleInfo: "2021 Honda Civic", serviceType: "Oil Change", description: "Full synthetic oil change with filter replacement", date: "2024-01-15", nextDueDate: "2024-07-15", mileageAtService: 33000, status: "completed", notes: "Used 0W-20 synthetic" },
  { id: "sb2", customerId: "c1", customerName: "John Smith", vin: "1HGBH41JXMN109186", vehicleInfo: "2021 Honda Civic", serviceType: "Brake Inspection", description: "Front and rear brake pad inspection", date: "2024-01-15", nextDueDate: "2024-07-15", mileageAtService: 33000, status: "completed", notes: "Front pads at 60%, rear at 70%" },
  { id: "sb3", customerId: "c2", customerName: "Emily Johnson", vin: "5YJSA1DG9DFP14705", vehicleInfo: "2022 Tesla Model S", serviceType: "Tire Rotation", description: "Four-tire rotation and pressure check", date: "2024-01-10", nextDueDate: "2024-07-10", mileageAtService: 20000, status: "completed", notes: "All tires at 42 PSI" },
  { id: "sb4", customerId: "c3", customerName: "Michael Davis", vin: "WVWZZZ3CZWE123456", vehicleInfo: "2020 Volkswagen Jetta", serviceType: "Oil Change", description: "Synthetic blend oil change", date: "2023-12-20", nextDueDate: "2024-06-20", mileageAtService: 45000, status: "completed", notes: "Recommended full synthetic next time" },
  { id: "sb5", customerId: "c1", customerName: "John Smith", vin: "1HGBH41JXMN109186", vehicleInfo: "2021 Honda Civic", serviceType: "Oil Change", description: "Scheduled oil change", date: "2024-07-15", nextDueDate: null, mileageAtService: 37500, status: "upcoming", notes: "" },
  { id: "sb6", customerId: "c2", customerName: "Emily Johnson", vin: "5YJSA1DG9DFP14705", vehicleInfo: "2022 Tesla Model S", serviceType: "Tire Rotation", description: "Scheduled tire rotation", date: "2024-07-10", nextDueDate: null, mileageAtService: 26000, status: "upcoming", notes: "" },
  { id: "sb7", customerId: "c3", customerName: "Michael Davis", vin: "WVWZZZ3CZWE123456", vehicleInfo: "2020 Volkswagen Jetta", serviceType: "Brake Maintenance", description: "Front brake pad replacement due", date: "2024-06-20", nextDueDate: null, mileageAtService: 50000, status: "upcoming", notes: "Pads were at 30% last inspection" },
  { id: "sb8", customerId: "c4", customerName: "Sarah Williams", vin: "JN1TANT31U0000001", vehicleInfo: "2023 Nissan Altima", serviceType: "Oil Change", description: "First scheduled oil change", date: "2024-08-01", nextDueDate: null, mileageAtService: 15000, status: "upcoming", notes: "" },
];

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
  "Other",
];

interface CarServiceBulletinsTabProps {
  dealershipId: string;
}

export function CarServiceBulletinsTab({ dealershipId }: CarServiceBulletinsTabProps) {
  const { toast } = useToast();
  const [vinSearch, setVinSearch] = useState("");
  const [foundCustomer, setFoundCustomer] = useState<AppAutoCustomer | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [bulletins, setBulletins] = useState<ServiceBulletin[]>(initialBulletins);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBulletin, setNewBulletin] = useState({
    serviceType: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    nextDueDate: "",
    mileageAtService: "",
    notes: "",
  });

  const handleVinSearch = () => {
    if (!vinSearch.trim()) return;
    const customer = mockAppAutoCustomers.find(
      (c) => c.vin.toLowerCase() === vinSearch.trim().toLowerCase()
    );
    setFoundCustomer(customer || null);
    setSearchPerformed(true);
    if (!customer) {
      toast({
        title: "Customer Not Found",
        description: "This VIN is not registered with AppAuto. The customer may not be using the app.",
        variant: "destructive",
      });
    }
  };

  const handleAddBulletin = () => {
    if (!foundCustomer || !newBulletin.serviceType || !newBulletin.date) return;

    const bulletin: ServiceBulletin = {
      id: `sb-${Date.now()}`,
      customerId: foundCustomer.id,
      customerName: foundCustomer.name,
      vin: foundCustomer.vin,
      vehicleInfo: `${foundCustomer.vehicleYear} ${foundCustomer.vehicleMake} ${foundCustomer.vehicleModel}`,
      serviceType: newBulletin.serviceType,
      description: newBulletin.description,
      date: newBulletin.date,
      nextDueDate: newBulletin.nextDueDate || null,
      mileageAtService: parseInt(newBulletin.mileageAtService) || foundCustomer.mileage,
      status: "completed",
      notes: newBulletin.notes,
    };

    setBulletins((prev) => [bulletin, ...prev]);
    setShowAddDialog(false);
    setNewBulletin({
      serviceType: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      nextDueDate: "",
      mileageAtService: "",
      notes: "",
    });

    toast({
      title: "Service Bulletin Added",
      description: `${newBulletin.serviceType} recorded for ${foundCustomer.name}.`,
    });
  };

  const completedBulletins = bulletins.filter((b) => b.status === "completed");
  const upcomingBulletins = bulletins.filter((b) => b.status === "upcoming");

  return (
    <div className="space-y-6">
      {/* VIN Lookup Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Customer VIN Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter VIN number (e.g., 1HGBH41JXMN109186)"
              value={vinSearch}
              onChange={(e) => {
                setVinSearch(e.target.value.toUpperCase());
                if (searchPerformed) {
                  setSearchPerformed(false);
                  setFoundCustomer(null);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleVinSearch()}
              className="flex-1 font-mono"
              maxLength={17}
            />
            <Button onClick={handleVinSearch} disabled={!vinSearch.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Look Up
            </Button>
          </div>

          {/* Customer Details */}
          {foundCustomer && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    AppAuto Customer
                  </Badge>
                </div>
                <Button size="sm" onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service Bulletin
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium text-sm">{foundCustomer.name}</p>
                    <p className="text-xs text-muted-foreground">{foundCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="font-medium text-sm">
                      {foundCustomer.vehicleYear} {foundCustomer.vehicleMake} {foundCustomer.vehicleModel}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">{foundCustomer.vin}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mileage</p>
                    <p className="font-medium text-sm">{foundCustomer.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Service History</p>
                    <p className="font-medium text-sm">
                      {bulletins.filter((b) => b.customerId === foundCustomer.id && b.status === "completed").length} completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {searchPerformed && !foundCustomer && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No AppAuto customer found with VIN <span className="font-mono font-medium">{vinSearch}</span>. This vehicle may not be registered in the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Bulletins Lists */}
      <Tabs defaultValue="completed">
        <TabsList>
          <TabsTrigger value="completed" className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Completed ({completedBulletins.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5">
            <Clock className="h-4 w-4" />
            Upcoming ({upcomingBulletins.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-6">
              {completedBulletins.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed service bulletins yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBulletins.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.customerName}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{b.vehicleInfo}</p>
                            <p className="text-xs text-muted-foreground font-mono">{b.vin}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{b.serviceType}</Badge>
                        </TableCell>
                        <TableCell>{b.date}</TableCell>
                        <TableCell>{b.mileageAtService.toLocaleString()} mi</TableCell>
                        <TableCell>
                          {b.nextDueDate ? (
                            <span className="text-sm">{b.nextDueDate}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
                            {b.notes || "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardContent className="pt-6">
              {upcomingBulletins.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No upcoming service bulletins.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Est. Mileage</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBulletins.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.customerName}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{b.vehicleInfo}</p>
                            <p className="text-xs text-muted-foreground font-mono">{b.vin}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{b.serviceType}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{b.date}</span>
                        </TableCell>
                        <TableCell>{b.mileageAtService.toLocaleString()} mi</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
                            {b.notes || "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Service Bulletin Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add Service Bulletin</DialogTitle>
          </DialogHeader>
          {foundCustomer && (
            <div className="rounded-lg border bg-muted/30 p-3 mb-2">
              <p className="text-sm font-medium">{foundCustomer.name}</p>
              <p className="text-xs text-muted-foreground">
                {foundCustomer.vehicleYear} {foundCustomer.vehicleMake} {foundCustomer.vehicleModel} · {foundCustomer.vin}
              </p>
            </div>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Service Type *</Label>
              <Select
                value={newBulletin.serviceType}
                onValueChange={(val) =>
                  setNewBulletin((prev) => ({ ...prev, serviceType: val }))
                }
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
                onChange={(e) =>
                  setNewBulletin((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Service Date *</Label>
                <Input
                  type="date"
                  value={newBulletin.date}
                  onChange={(e) =>
                    setNewBulletin((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Next Due Date</Label>
                <Input
                  type="date"
                  value={newBulletin.nextDueDate}
                  onChange={(e) =>
                    setNewBulletin((prev) => ({ ...prev, nextDueDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Mileage at Service</Label>
              <Input
                type="number"
                placeholder={foundCustomer ? String(foundCustomer.mileage) : ""}
                value={newBulletin.mileageAtService}
                onChange={(e) =>
                  setNewBulletin((prev) => ({ ...prev, mileageAtService: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={newBulletin.notes}
                onChange={(e) =>
                  setNewBulletin((prev) => ({ ...prev, notes: e.target.value }))
                }
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
