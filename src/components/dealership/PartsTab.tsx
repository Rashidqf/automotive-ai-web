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
import { 
  Cog, 
  Search, 
  Plus, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  ShoppingCart,
  Edit,
  DollarSign
} from "lucide-react";

interface Part {
  id: string;
  partNumber: string;
  name: string;
  category: "engine" | "brakes" | "suspension" | "electrical" | "body" | "accessories" | "fluids" | "filters";
  brand: string;
  price: number;
  cost: number;
  quantity: number;
  minStock: number;
  location: string;
  compatible: string[];
}

const mockParts: Part[] = [
  { id: "1", partNumber: "TOY-BRK-001", name: "Brake Pads (Front)", category: "brakes", brand: "Toyota OEM", price: 89.99, cost: 45.00, quantity: 24, minStock: 10, location: "A-12", compatible: ["Camry", "Corolla", "RAV4"] },
  { id: "2", partNumber: "HON-OIL-002", name: "Oil Filter", category: "filters", brand: "Honda OEM", price: 12.99, cost: 5.50, quantity: 56, minStock: 20, location: "B-03", compatible: ["Accord", "Civic", "CR-V"] },
  { id: "3", partNumber: "FRD-BAT-003", name: "Car Battery 12V", category: "electrical", brand: "Motorcraft", price: 159.99, cost: 85.00, quantity: 8, minStock: 5, location: "C-01", compatible: ["F-150", "Explorer", "Mustang"] },
  { id: "4", partNumber: "GEN-AIR-004", name: "Cabin Air Filter", category: "filters", brand: "K&N", price: 24.99, cost: 12.00, quantity: 3, minStock: 15, location: "B-07", compatible: ["Universal"] },
  { id: "5", partNumber: "CHV-SUS-005", name: "Shock Absorber (Rear)", category: "suspension", brand: "Monroe", price: 78.50, cost: 42.00, quantity: 16, minStock: 8, location: "D-04", compatible: ["Silverado", "Tahoe"] },
  { id: "6", partNumber: "BMW-ENG-006", name: "Spark Plugs (Set of 6)", category: "engine", brand: "NGK", price: 65.00, cost: 28.00, quantity: 12, minStock: 6, location: "A-02", compatible: ["3 Series", "5 Series", "X3"] },
  { id: "7", partNumber: "ACC-MAT-007", name: "All-Weather Floor Mats", category: "accessories", brand: "WeatherTech", price: 149.99, cost: 75.00, quantity: 22, minStock: 10, location: "E-01", compatible: ["Universal"] },
  { id: "8", partNumber: "GEN-FLD-008", name: "Synthetic Motor Oil 5W-30 (5qt)", category: "fluids", brand: "Mobil 1", price: 38.99, cost: 22.00, quantity: 45, minStock: 25, location: "F-02", compatible: ["Universal"] },
];

const categoryConfig = {
  engine: { label: "Engine", color: "bg-red-500/10 text-red-600 border-red-200" },
  brakes: { label: "Brakes", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
  suspension: { label: "Suspension", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
  electrical: { label: "Electrical", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  body: { label: "Body", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  accessories: { label: "Accessories", color: "bg-pink-500/10 text-pink-600 border-pink-200" },
  fluids: { label: "Fluids", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200" },
  filters: { label: "Filters", color: "bg-green-500/10 text-green-600 border-green-200" },
};

export function PartsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredParts = mockParts.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalParts: mockParts.length,
    totalValue: mockParts.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    lowStock: mockParts.filter((p) => p.quantity <= p.minStock).length,
    categories: new Set(mockParts.map((p) => p.category)).size,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalParts}</p>
                <p className="text-xs text-muted-foreground">Part Types</p>
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
                <p className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">Inventory Value</p>
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
                <p className="text-2xl font-bold">{stats.lowStock}</p>
                <p className="text-xs text-muted-foreground">Low Stock Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Cog className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.categories}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parts Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cog className="h-5 w-5" />
              Parts & Accessories Inventory
            </CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Part
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="engine">Engine</SelectItem>
                <SelectItem value="brakes">Brakes</SelectItem>
                <SelectItem value="suspension">Suspension</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="body">Body</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="fluids">Fluids</SelectItem>
                <SelectItem value="filters">Filters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.map((part) => {
                  const isLowStock = part.quantity <= part.minStock;
                  return (
                    <TableRow key={part.id}>
                      <TableCell className="font-mono text-xs">{part.partNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {part.compatible.slice(0, 2).join(", ")}{part.compatible.length > 2 ? "..." : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryConfig[part.category].color}>
                          {categoryConfig[part.category].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{part.brand}</TableCell>
                      <TableCell className="font-medium">${part.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={isLowStock ? "text-destructive font-medium" : ""}>
                          {part.quantity}
                          {isLowStock && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                        </span>
                      </TableCell>
                      <TableCell>{part.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <ShoppingCart className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Create Order</p>
              <p className="text-xs text-muted-foreground">Order parts from suppliers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">Low Stock Report</p>
              <p className="text-xs text-muted-foreground">{stats.lowStock} items need reorder</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Sales Report</p>
              <p className="text-xs text-muted-foreground">View parts sales trends</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
