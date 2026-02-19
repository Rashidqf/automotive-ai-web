import { useState } from "react";
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
import { Search, Download, Car, CheckCircle, XCircle, Calendar, Wrench } from "lucide-react";
import { mockVehicleRecords, VehicleRecord } from "@/data/mockData";
import { VehicleHistoryDialog } from "@/components/vehicles/VehicleHistoryDialog";

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const filteredRecords = mockVehicleRecords.filter((record) => {
    const matchesSearch =
      record.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      vehicleTypeFilter === "all" ||
      record.vehicleType.toLowerCase() === vehicleTypeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout
      title="Vehicle & Service Records"
      subtitle="Track all vehicle service history and upcoming maintenance"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by vehicle number or owner name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <Car className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="hatchback">Hatchback</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>

        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Vehicle Records Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="rounded-xl bg-card p-6 shadow-card transition-all hover:shadow-elevated"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{record.vehicleNumber}</h3>
                  <p className="text-sm text-muted-foreground">{record.vehicleType}</p>
                </div>
              </div>
              {record.isPreferred ? (
                <span className="badge badge-success">Preferred</span>
              ) : (
                <span className="badge badge-warning">Non-Preferred</span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium text-foreground">{record.ownerName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Service</span>
                <span className="font-medium text-foreground">{record.lastServiceDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service Type</span>
                <span className="font-medium text-foreground">{record.serviceType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service Center</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">{record.serviceCenter}</span>
                  {record.isPreferred ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-warning" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Next due:</span>
                <span className="font-medium text-foreground">{record.nextServiceDue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{record.totalServices} services</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                setSelectedVehicle(record);
                setHistoryDialogOpen(true);
              }}
            >
              View Full History
            </Button>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-primary/10 p-4 text-center">
          <p className="text-2xl font-bold text-primary">15,290</p>
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
        </div>
        <div className="rounded-lg bg-success/10 p-4 text-center">
          <p className="text-2xl font-bold text-success">10,397</p>
          <p className="text-sm text-muted-foreground">At Preferred Centers</p>
        </div>
        <div className="rounded-lg bg-warning/10 p-4 text-center">
          <p className="text-2xl font-bold text-warning">4,893</p>
          <p className="text-sm text-muted-foreground">At Non-Preferred</p>
        </div>
        <div className="rounded-lg bg-accent/10 p-4 text-center">
          <p className="text-2xl font-bold text-accent">2,156</p>
          <p className="text-sm text-muted-foreground">Service Due Soon</p>
        </div>
      </div>
      <VehicleHistoryDialog
        vehicle={selectedVehicle}
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
      />
    </DashboardLayout>
  );
};

export default Vehicles;
