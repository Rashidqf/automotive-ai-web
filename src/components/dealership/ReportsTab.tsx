import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  FileText,
  DollarSign,
  Car,
  Users,
  Wrench,
  Calendar
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const monthlySalesData = [
  { month: "Aug", sales: 42, revenue: 1250000 },
  { month: "Sep", sales: 38, revenue: 1120000 },
  { month: "Oct", sales: 45, revenue: 1380000 },
  { month: "Nov", sales: 52, revenue: 1560000 },
  { month: "Dec", sales: 58, revenue: 1720000 },
  { month: "Jan", sales: 48, revenue: 1450000 },
];

const inventoryHealth = [
  { category: "New Vehicles", count: 45, optimal: 60, status: "low" },
  { category: "Used Vehicles", count: 32, optimal: 40, status: "good" },
  { category: "Certified Pre-Owned", count: 18, optimal: 25, status: "low" },
  { category: "In Service", count: 8, optimal: 10, status: "good" },
];

const serviceMetrics = [
  { month: "Aug", appointments: 120, completed: 115 },
  { month: "Sep", appointments: 135, completed: 128 },
  { month: "Oct", appointments: 142, completed: 138 },
  { month: "Nov", appointments: 128, completed: 125 },
  { month: "Dec", appointments: 118, completed: 112 },
  { month: "Jan", appointments: 145, completed: 140 },
];

const leadSources = [
  { name: "Website", value: 35, color: "hsl(var(--primary))" },
  { name: "Walk-ins", value: 25, color: "hsl(142, 76%, 36%)" },
  { name: "Referrals", value: 20, color: "hsl(45, 93%, 47%)" },
  { name: "Social Media", value: 12, color: "hsl(262, 83%, 58%)" },
  { name: "Phone", value: 8, color: "hsl(0, 84%, 60%)" },
];

const exportableReports = [
  { id: "1", name: "Monthly Sales Report", type: "Sales", lastGenerated: "Jan 28, 2024", format: "PDF" },
  { id: "2", name: "Inventory Status Report", type: "Inventory", lastGenerated: "Jan 28, 2024", format: "Excel" },
  { id: "3", name: "Service Department Report", type: "Service", lastGenerated: "Jan 27, 2024", format: "PDF" },
  { id: "4", name: "F&I Performance Report", type: "Finance", lastGenerated: "Jan 26, 2024", format: "PDF" },
  { id: "5", name: "Lead Conversion Report", type: "CRM", lastGenerated: "Jan 25, 2024", format: "Excel" },
];

export function ReportsTab() {
  const currentMonth = monthlySalesData[monthlySalesData.length - 1];
  const previousMonth = monthlySalesData[monthlySalesData.length - 2];
  const salesGrowth = ((currentMonth.sales - previousMonth.sales) / previousMonth.sales * 100).toFixed(1);
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Sales</p>
                <p className="text-2xl font-bold">{currentMonth.sales}</p>
                <div className={`flex items-center gap-1 text-xs mt-1 ${Number(salesGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(salesGrowth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{salesGrowth}% vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${(currentMonth.revenue / 1000000).toFixed(2)}M</p>
                <div className={`flex items-center gap-1 text-xs mt-1 ${Number(revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(revenueGrowth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{revenueGrowth}% vs last month</span>
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
                <p className="text-xs text-muted-foreground">Total Inventory</p>
                <p className="text-2xl font-bold">95</p>
                <p className="text-xs text-muted-foreground mt-1">Units in stock</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Service Completion</p>
                <p className="text-2xl font-bold">96.5%</p>
                <p className="text-xs text-green-600 mt-1">Above target</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Wrench className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales Trends (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Units Sold" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {leadSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {leadSources.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryHealth.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">
                      {item.count} / {item.optimal}
                      {item.status === "low" && (
                        <Badge variant="outline" className="ml-2 text-xs bg-yellow-500/10 text-yellow-600 border-yellow-200">
                          Low Stock
                        </Badge>
                      )}
                    </span>
                  </div>
                  <Progress value={(item.count / item.optimal) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Appointments vs Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="hsl(var(--primary) / 0.3)" name="Scheduled" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exportable Reports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exportableReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{report.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                    <span className="text-xs text-muted-foreground">{report.format}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Last: {report.lastGenerated}</p>
                </div>
                <Button size="icon" variant="outline" className="shrink-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
