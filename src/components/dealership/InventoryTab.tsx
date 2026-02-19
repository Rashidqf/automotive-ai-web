import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car, Plus, Search, Filter, Edit, Clock, AlertTriangle } from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  price: number;
  status: "available" | "reserved" | "sold" | "in_service";
  condition: "new" | "used";
  daysInStock: number;
  mileage: number;
  color: string;
}

const mockVehicles: Vehicle[] = [
  { id: "1", make: "Toyota", model: "Camry", year: 2024, vin: "1HGBH41JXMN109186", price: 28500, status: "available", condition: "new", daysInStock: 12, mileage: 15, color: "Silver" },
  { id: "2", make: "Honda", model: "Accord", year: 2023, vin: "2HGFC2F59MH501234", price: 32000, status: "reserved", condition: "new", daysInStock: 8, mileage: 25, color: "Black" },
  { id: "3", make: "Ford", model: "F-150", year: 2022, vin: "1FTFW1E50NFA12345", price: 45000, status: "available", condition: "used", daysInStock: 45, mileage: 28500, color: "White" },
  { id: "4", make: "Chevrolet", model: "Silverado", year: 2024, vin: "3GCUYGED5NG123456", price: 52000, status: "in_service", condition: "new", daysInStock: 5, mileage: 0, color: "Red" },
  { id: "5", make: "BMW", model: "X5", year: 2023, vin: "5UXCR6C09N9876543", price: 65000, status: "sold", condition: "used", daysInStock: 30, mileage: 15200, color: "Blue" },
  { id: "6", make: "Tesla", model: "Model 3", year: 2024, vin: "5YJ3E1EA8NF654321", price: 42000, status: "available", condition: "new", daysInStock: 60, mileage: 10, color: "White" },
];

const statusColors = {
  available: "bg-green-500/10 text-green-600 border-green-200",
  reserved: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  sold: "bg-blue-500/10 text-blue-600 border-blue-200",
  in_service: "bg-orange-500/10 text-orange-600 border-orange-200",
};

export function InventoryTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesSearch = 
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const matchesCondition = conditionFilter === "all" || v.condition === conditionFilter;
    return matchesSearch && matchesStatus && matchesCondition;
  });

  const stats = {
    total: mockVehicles.length,
    available: mockVehicles.filter((v) => v.status === "available").length,
    reserved: mockVehicles.filter((v) => v.status === "reserved").length,
    aging: mockVehicles.filter((v) => v.daysInStock > 45).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Inventory</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Car className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-xs text-muted-foreground">Available</p>
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
                <p className="text-2xl font-bold">{stats.reserved}</p>
                <p className="text-xs text-muted-foreground">Reserved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.aging}</p>
                <p className="text-xs text-muted-foreground">Aging (45+ days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Inventory
            </CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, or VIN..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="in_service">In Service</SelectItem>
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days in Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.color} • {vehicle.mileage.toLocaleString()} mi</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={vehicle.condition === "new" ? "border-green-200 text-green-600" : "border-gray-200"}>
                        {vehicle.condition}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${vehicle.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[vehicle.status]}>
                        {vehicle.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={vehicle.daysInStock > 45 ? "text-destructive font-medium" : ""}>
                        {vehicle.daysInStock} days
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
