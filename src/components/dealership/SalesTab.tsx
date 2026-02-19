import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Car, 
  Users, 
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const salesData = [
  { name: "Mon", sales: 4, revenue: 120000 },
  { name: "Tue", sales: 3, revenue: 95000 },
  { name: "Wed", sales: 6, revenue: 185000 },
  { name: "Thu", sales: 2, revenue: 65000 },
  { name: "Fri", sales: 8, revenue: 240000 },
  { name: "Sat", sales: 10, revenue: 320000 },
  { name: "Sun", sales: 5, revenue: 150000 },
];

const topModels = [
  { model: "Toyota Camry", sales: 12, percentage: 25 },
  { model: "Honda Accord", sales: 10, percentage: 21 },
  { model: "Ford F-150", sales: 8, percentage: 17 },
  { model: "Chevrolet Silverado", sales: 7, percentage: 15 },
  { model: "Tesla Model 3", sales: 5, percentage: 10 },
];

const dealsInProgress = [
  { id: "1", customer: "John Smith", vehicle: "2024 Toyota Camry", stage: "Negotiation", value: 32000 },
  { id: "2", customer: "Sarah Johnson", vehicle: "2023 Honda Accord", stage: "Financing", value: 28500 },
  { id: "3", customer: "Mike Wilson", vehicle: "2024 Ford F-150", stage: "Test Drive", value: 52000 },
  { id: "4", customer: "Emily Brown", vehicle: "2023 BMW X5", stage: "Documentation", value: 65000 },
];

const testDrives = [
  { id: "1", time: "10:00 AM", customer: "David Lee", vehicle: "2024 Tesla Model 3" },
  { id: "2", time: "11:30 AM", customer: "Jennifer Garcia", vehicle: "2024 Toyota RAV4" },
  { id: "3", time: "2:00 PM", customer: "Robert Martinez", vehicle: "2023 Honda CR-V" },
  { id: "4", time: "4:30 PM", customer: "Lisa Anderson", vehicle: "2024 Chevrolet Tahoe" },
];

const stageColors: Record<string, string> = {
  "Test Drive": "bg-blue-500/10 text-blue-600 border-blue-200",
  "Negotiation": "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  "Financing": "bg-purple-500/10 text-purple-600 border-purple-200",
  "Documentation": "bg-green-500/10 text-green-600 border-green-200",
};

export function SalesTab() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold">$185,000</p>
                <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12% vs yesterday</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Weekly Target</p>
                <p className="text-2xl font-bold">68%</p>
                <Progress value={68} className="h-1.5 mt-2" />
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Units Sold (Week)</p>
                <p className="text-2xl font-bold">38</p>
                <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+5 vs last week</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Car className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">24%</p>
                <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-2% vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Sales Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Selling Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topModels.map((model, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{model.model}</span>
                    <span className="text-muted-foreground">{model.sales} sold</span>
                  </div>
                  <Progress value={model.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals & Test Drives */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Deals in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dealsInProgress.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{deal.customer}</p>
                    <p className="text-xs text-muted-foreground">{deal.vehicle}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className={stageColors[deal.stage]}>
                      {deal.stage}
                    </Badge>
                    <p className="text-sm font-medium">${deal.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Test Drives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testDrives.map((drive) => (
                <div key={drive.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-bold text-primary">{drive.time}</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{drive.customer}</p>
                    <p className="text-xs text-muted-foreground">{drive.vehicle}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Scheduled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
