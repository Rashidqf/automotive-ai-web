import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Calendar, MapPin, Wrench, CheckCircle, XCircle, AlertTriangle, Shield, FileText, Settings } from "lucide-react";
import { VehicleRecord } from "@/data/mockData";

interface ServiceHistoryEntry {
  id: string;
  date: string;
  type: string;
  serviceCenter: string;
  isPreferred: boolean;
  cost?: string;
  notes?: string;
}

interface MaintenanceItem {
  id: string;
  item: string;
  dueDate: string;
  mileage: string;
  priority: "high" | "medium" | "low";
}

interface RecallInfo {
  id: string;
  campaignNumber: string;
  component: string;
  summary: string;
  status: "open" | "completed";
}

// Mock service history data
const getServiceHistory = (vehicleNumber: string): ServiceHistoryEntry[] => [
  {
    id: "1",
    date: "2024-01-15",
    type: "Oil Change",
    serviceCenter: "AutoCare Plus",
    isPreferred: true,
    cost: "$45",
    notes: "Changed engine oil and filter",
  },
  {
    id: "2",
    date: "2023-10-20",
    type: "Full Service",
    serviceCenter: "Premium Motors",
    isPreferred: true,
    cost: "$185",
    notes: "Complete 20,000 mile service",
  },
  {
    id: "3",
    date: "2023-07-12",
    type: "Oil Change",
    serviceCenter: "Quick Lube Center",
    isPreferred: false,
    cost: "$38",
    notes: "Regular oil change",
  },
  {
    id: "4",
    date: "2023-04-05",
    type: "Brake Service",
    serviceCenter: "AutoCare Plus",
    isPreferred: true,
    cost: "$95",
    notes: "Front brake pads replaced",
  },
  {
    id: "5",
    date: "2023-01-18",
    type: "Oil Change",
    serviceCenter: "City Auto Workshop",
    isPreferred: false,
    cost: "$42",
    notes: "Engine oil and air filter replaced",
  },
];

const getUpcomingMaintenance = (): MaintenanceItem[] => [
  { id: "1", item: "Oil Change", dueDate: "2024-04-15", mileage: "45,000 mi", priority: "high" },
  { id: "2", item: "Tire Rotation", dueDate: "2024-05-01", mileage: "46,000 mi", priority: "medium" },
  { id: "3", item: "Air Filter Replacement", dueDate: "2024-06-15", mileage: "50,000 mi", priority: "low" },
  { id: "4", item: "Brake Inspection", dueDate: "2024-07-01", mileage: "52,000 mi", priority: "medium" },
];

const getCarMDData = () => ({
  engineCode: "2GR-FE",
  transmission: "6-Speed Automatic",
  fuelType: "Gasoline",
  driveType: "Front-Wheel Drive",
  diagnostics: [
    { code: "P0300", description: "Random/Multiple Cylinder Misfire Detected", severity: "moderate" },
  ],
  healthScore: 85,
});

const getNHTSAData = (): RecallInfo[] => [
  {
    id: "1",
    campaignNumber: "24V-123",
    component: "Air Bags",
    summary: "Driver-side airbag inflator may be defective",
    status: "open",
  },
  {
    id: "2",
    campaignNumber: "23V-456",
    component: "Fuel System",
    summary: "Fuel pump may fail causing stalling",
    status: "completed",
  },
];

const getVidmoudData = () => ({
  overallCondition: "Good",
  bodyCondition: "Excellent",
  interiorCondition: "Good",
  mechanicalCondition: "Fair",
  estimatedValue: "$18,500",
  marketComparison: "+5% above market average",
  lastInspectionDate: "2024-01-10",
});

export interface VehicleHistoryData {
  vehicle: { id: string; vehicleNumber: string; vehicleType: string; vin: string; year?: number; make?: string; model?: string };
  serviceHistory: ServiceHistoryEntry[];
  recalls: RecallInfo[];
  nhtsaRecalls: RecallInfo[];
  upcomingMaintenance: MaintenanceItem[];
}

interface VehicleHistoryDialogProps {
  vehicle: VehicleRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, shows real API data (service history, maintenance, NHTSA recalls) */
  historyData?: VehicleHistoryData | null;
  historyLoading?: boolean;
}

function formatDate(d: string): string {
  if (!d) return "";
  try {
    const date = new Date(d);
    return isNaN(date.getTime()) ? d : date.toLocaleDateString("en-US", { dateStyle: "medium" });
  } catch {
    return d;
  }
}

export function VehicleHistoryDialog({
  vehicle,
  open,
  onOpenChange,
  historyData,
  historyLoading = false,
}: VehicleHistoryDialogProps) {
  if (!vehicle) return null;

  const history: ServiceHistoryEntry[] = historyData?.serviceHistory?.length
    ? historyData.serviceHistory.map((s) => ({
        id: s.id,
        date: typeof s.date === "string" ? formatDate(s.date) : String(s.date),
        type: s.type,
        serviceCenter: s.serviceCenter,
        isPreferred: s.isPreferred,
        cost: s.cost ?? "",
        notes: s.notes ?? "",
      }))
    : getServiceHistory(vehicle.vehicleNumber);

  const maintenance: MaintenanceItem[] = historyData?.upcomingMaintenance?.length
    ? historyData.upcomingMaintenance.map((m) => ({
        id: m.id,
        item: m.item,
        dueDate: typeof m.dueDate === "string" ? formatDate(m.dueDate) : String(m.dueDate),
        mileage: m.mileage ?? "",
        priority: (m.priority as "high" | "medium" | "low") || "medium",
      }))
    : getUpcomingMaintenance();

  const nhtsaData: RecallInfo[] = historyData?.nhtsaRecalls?.length
    ? historyData.nhtsaRecalls.map((r) => ({
        id: r.id,
        campaignNumber: r.campaignNumber,
        component: r.component,
        summary: r.summary,
        status: (r.status === "open" ? "open" : "completed") as "open" | "completed",
      }))
    : getNHTSAData();

  const carmdData = getCarMDData();
  const vidmoudData = getVidmoudData();

  const vin = historyData?.vehicle?.vin || `1HGBH41JXMN${vehicle.vehicleNumber.replace(/[^0-9]/g, "").padStart(6, "0")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-foreground">{vehicle.vehicleNumber}</span>
              <p className="text-sm font-normal text-muted-foreground">
                {vehicle.vehicleType} • {vehicle.ownerName}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {historyLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        <div className={`flex-1 overflow-y-auto scrollbar-thin ${historyLoading ? "hidden" : ""}`}>
          {/* VIN Display */}
          <div className="mb-4 rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">VIN Number</p>
            <p className="font-mono text-sm font-semibold text-foreground">{vin}</p>
          </div>

          {/* Summary Stats */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-xl font-bold text-primary">{vehicle.totalServices}</p>
              <p className="text-xs text-muted-foreground">Total Services</p>
            </div>
            <div className="rounded-lg bg-success/10 p-3 text-center">
              <p className="text-xl font-bold text-success">
                {history.filter((h) => h.isPreferred).length}
              </p>
              <p className="text-xs text-muted-foreground">Preferred</p>
            </div>
            <div className="rounded-lg bg-warning/10 p-3 text-center">
              <p className="text-xl font-bold text-warning">
                {history.filter((h) => !h.isPreferred).length}
              </p>
              <p className="text-xs text-muted-foreground">Non-Preferred</p>
            </div>
          </div>

          {/* Tabs for Different Data Sources */}
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
              <TabsTrigger value="maintenance" className="text-xs">Maintenance</TabsTrigger>
              <TabsTrigger value="carmd" className="text-xs">CarMD</TabsTrigger>
              <TabsTrigger value="nhtsa" className="text-xs">NHTSA</TabsTrigger>
              <TabsTrigger value="vidmoud" className="text-xs">Vidmoud</TabsTrigger>
            </TabsList>

            {/* Service History Tab */}
            <TabsContent value="history" className="mt-4 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Wrench className="h-4 w-4" /> Service History
              </h4>
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative flex gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        entry.isPreferred ? "bg-success/10" : "bg-warning/10"
                      }`}
                    >
                      {entry.isPreferred ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    {index < history.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{entry.type}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{entry.serviceCenter}</span>
                          {entry.isPreferred ? (
                            <span className="badge badge-success">Preferred</span>
                          ) : (
                            <span className="badge badge-warning">Non-Preferred</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{entry.cost}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {entry.date}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{entry.notes}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Upcoming Maintenance Tab */}
            <TabsContent value="maintenance" className="mt-4 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Upcoming Maintenance
              </h4>
              {maintenance.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      item.priority === 'high' ? 'bg-destructive' :
                      item.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <div>
                      <p className="font-medium text-foreground">{item.item}</p>
                      <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{item.mileage}</p>
                    <span className={`text-xs capitalize ${
                      item.priority === 'high' ? 'text-destructive' :
                      item.priority === 'medium' ? 'text-warning' : 'text-success'
                    }`}>
                      {item.priority} priority
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* CarMD Tab */}
            <TabsContent value="carmd" className="mt-4 space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Settings className="h-4 w-4" /> CarMD Diagnostics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Engine Code</p>
                  <p className="font-medium text-foreground">{carmdData.engineCode}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Transmission</p>
                  <p className="font-medium text-foreground">{carmdData.transmission}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Fuel Type</p>
                  <p className="font-medium text-foreground">{carmdData.fuelType}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Drive Type</p>
                  <p className="font-medium text-foreground">{carmdData.driveType}</p>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-3xl font-bold text-primary">{carmdData.healthScore}%</p>
                <p className="text-sm text-muted-foreground">Vehicle Health Score</p>
              </div>
              {carmdData.diagnostics.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Diagnostic Codes</p>
                  {carmdData.diagnostics.map((diag, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning/10 p-3">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <div>
                        <p className="font-mono text-sm font-medium text-foreground">{diag.code}</p>
                        <p className="text-sm text-muted-foreground">{diag.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* NHTSA Tab */}
            <TabsContent value="nhtsa" className="mt-4 space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" /> NHTSA Recalls & Safety
              </h4>
              {nhtsaData.map((recall) => (
                <div
                  key={recall.id}
                  className={`rounded-lg border p-4 ${
                    recall.status === 'open' 
                      ? 'border-destructive/50 bg-destructive/5' 
                      : 'border-success/50 bg-success/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {recall.campaignNumber}
                        </span>
                        <span className={`badge ${
                          recall.status === 'open' ? 'badge-destructive' : 'badge-success'
                        }`}>
                          {recall.status}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-foreground">{recall.component}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{recall.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Vidmoud Tab */}
            <TabsContent value="vidmoud" className="mt-4 space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> Vidmoud Vehicle Report
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Overall Condition</p>
                  <p className="font-medium text-foreground">{vidmoudData.overallCondition}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Body Condition</p>
                  <p className="font-medium text-foreground">{vidmoudData.bodyCondition}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Interior Condition</p>
                  <p className="font-medium text-foreground">{vidmoudData.interiorCondition}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground">Mechanical Condition</p>
                  <p className="font-medium text-foreground">{vidmoudData.mechanicalCondition}</p>
                </div>
              </div>
              <div className="rounded-lg bg-success/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Value</p>
                    <p className="text-2xl font-bold text-success">{vidmoudData.estimatedValue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Market Comparison</p>
                    <p className="font-medium text-success">{vidmoudData.marketComparison}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Last inspection: {vidmoudData.lastInspectionDate}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
