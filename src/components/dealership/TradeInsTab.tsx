import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  RefreshCcw, 
  Search, 
  Plus, 
  Car, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  Eye,
  FileText
} from "lucide-react";

interface TradeIn {
  id: string;
  customerName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vin: string;
  mileage: number;
  condition: "excellent" | "good" | "fair" | "poor";
  estimatedValue: number;
  offerAmount: number | null;
  status: "pending_appraisal" | "appraised" | "offer_made" | "accepted" | "declined" | "completed";
  interestedIn: string;
  submittedAt: string;
  notes: string;
}

const mockTradeIns: TradeIn[] = [
  { 
    id: "1", 
    customerName: "John Smith", 
    vehicleMake: "Honda", 
    vehicleModel: "Civic", 
    vehicleYear: 2019, 
    vin: "2HGFC2F59MH501234", 
    mileage: 45000, 
    condition: "good", 
    estimatedValue: 18000, 
    offerAmount: 16500, 
    status: "offer_made", 
    interestedIn: "2024 Toyota Camry", 
    submittedAt: "2 hours ago",
    notes: "Minor scratches on rear bumper"
  },
  { 
    id: "2", 
    customerName: "Sarah Johnson", 
    vehicleMake: "Toyota", 
    vehicleModel: "RAV4", 
    vehicleYear: 2020, 
    vin: "2T3RFREV5NW123456", 
    mileage: 32000, 
    condition: "excellent", 
    estimatedValue: 28000, 
    offerAmount: 26000, 
    status: "accepted", 
    interestedIn: "2024 Honda CR-V", 
    submittedAt: "Yesterday",
    notes: "Full service history, single owner"
  },
  { 
    id: "3", 
    customerName: "Mike Wilson", 
    vehicleMake: "Ford", 
    vehicleModel: "Focus", 
    vehicleYear: 2017, 
    vin: "1FAHP3F26CL234567", 
    mileage: 78000, 
    condition: "fair", 
    estimatedValue: 9000, 
    offerAmount: null, 
    status: "pending_appraisal", 
    interestedIn: "2024 Ford F-150", 
    submittedAt: "3 hours ago",
    notes: "Needs brake inspection"
  },
  { 
    id: "4", 
    customerName: "Emily Brown", 
    vehicleMake: "Chevrolet", 
    vehicleModel: "Malibu", 
    vehicleYear: 2018, 
    vin: "1G1ZD5ST8JF345678", 
    mileage: 55000, 
    condition: "good", 
    estimatedValue: 14000, 
    offerAmount: 12500, 
    status: "declined", 
    interestedIn: "2023 Tesla Model 3", 
    submittedAt: "2 days ago",
    notes: "Customer expected higher value"
  },
  { 
    id: "5", 
    customerName: "David Lee", 
    vehicleMake: "BMW", 
    vehicleModel: "3 Series", 
    vehicleYear: 2021, 
    vin: "WBA5R7C5XNA456789", 
    mileage: 22000, 
    condition: "excellent", 
    estimatedValue: 38000, 
    offerAmount: 35500, 
    status: "completed", 
    interestedIn: "2024 BMW X5", 
    submittedAt: "1 week ago",
    notes: "Deal completed with upgrade"
  },
];

const statusConfig = {
  pending_appraisal: { label: "Pending Appraisal", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
  appraised: { label: "Appraised", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  offer_made: { label: "Offer Made", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  accepted: { label: "Accepted", color: "bg-green-500/10 text-green-600 border-green-200" },
  declined: { label: "Declined", color: "bg-red-500/10 text-red-600 border-red-200" },
  completed: { label: "Completed", color: "bg-gray-500/10 text-gray-600 border-gray-200" },
};

const conditionConfig = {
  excellent: { label: "Excellent", color: "bg-green-500/10 text-green-600 border-green-200" },
  good: { label: "Good", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  fair: { label: "Fair", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
  poor: { label: "Poor", color: "bg-red-500/10 text-red-600 border-red-200" },
};

export function TradeInsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTradeIn, setSelectedTradeIn] = useState<TradeIn | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredTradeIns = mockTradeIns.filter((t) =>
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: mockTradeIns.length,
    pendingAppraisal: mockTradeIns.filter((t) => t.status === "pending_appraisal").length,
    offersOut: mockTradeIns.filter((t) => t.status === "offer_made").length,
    completed: mockTradeIns.filter((t) => t.status === "completed").length,
    totalValue: mockTradeIns.filter((t) => t.status === "completed").reduce((sum, t) => sum + (t.offerAmount || 0), 0),
  };

  const handleViewDetail = (tradeIn: TradeIn) => {
    setSelectedTradeIn(tradeIn);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <RefreshCcw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Trade-Ins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingAppraisal}</p>
                <p className="text-xs text-muted-foreground">Pending Appraisal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.offersOut}</p>
                <p className="text-xs text-muted-foreground">Offers Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Acquired Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade-Ins Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Trade-In Requests
            </CardTitle>
            <div className="flex gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trade-ins..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Trade-In
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Trade-In Vehicle</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Est. Value</TableHead>
                  <TableHead>Offer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Interested In</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTradeIns.map((tradeIn) => (
                  <TableRow key={tradeIn.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tradeIn.customerName}</p>
                        <p className="text-xs text-muted-foreground">{tradeIn.submittedAt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tradeIn.vehicleYear} {tradeIn.vehicleMake} {tradeIn.vehicleModel}</p>
                        <p className="text-xs text-muted-foreground">{tradeIn.mileage.toLocaleString()} mi</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={conditionConfig[tradeIn.condition].color}>
                        {conditionConfig[tradeIn.condition].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${tradeIn.estimatedValue.toLocaleString()}</TableCell>
                    <TableCell>
                      {tradeIn.offerAmount ? (
                        <span className="font-medium text-green-600">${tradeIn.offerAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[tradeIn.status].color}>
                        {statusConfig[tradeIn.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm truncate max-w-[150px]">{tradeIn.interestedIn}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDetail(tradeIn)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Trade-In Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Trade-In Details</DialogTitle>
          </DialogHeader>
          {selectedTradeIn && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {selectedTradeIn.vehicleYear} {selectedTradeIn.vehicleMake} {selectedTradeIn.vehicleModel}
                  </p>
                  <p className="text-sm text-muted-foreground">VIN: {selectedTradeIn.vin}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedTradeIn.customerName}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Mileage</p>
                  <p className="font-medium">{selectedTradeIn.mileage.toLocaleString()} mi</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Condition</p>
                  <Badge variant="outline" className={conditionConfig[selectedTradeIn.condition].color}>
                    {conditionConfig[selectedTradeIn.condition].label}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusConfig[selectedTradeIn.status].color}>
                    {statusConfig[selectedTradeIn.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200">
                  <p className="text-xs text-blue-600">Estimated Value</p>
                  <p className="text-xl font-bold text-blue-700">${selectedTradeIn.estimatedValue.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-200">
                  <p className="text-xs text-green-600">Offer Amount</p>
                  <p className="text-xl font-bold text-green-700">
                    {selectedTradeIn.offerAmount ? `$${selectedTradeIn.offerAmount.toLocaleString()}` : "Pending"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Interested In</p>
                <p className="font-medium">{selectedTradeIn.interestedIn}</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{selectedTradeIn.notes}</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <DollarSign className="h-4 w-4" />
                  Make Offer
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <FileText className="h-4 w-4" />
                  Appraisal Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
