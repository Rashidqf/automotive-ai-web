import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Shield, 
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface LoanApplication {
  id: string;
  customer: string;
  vehicle: string;
  amount: number;
  type: "loan" | "lease";
  status: "pending" | "approved" | "declined" | "documents_required";
  lender: string;
  submittedAt: string;
}

interface WarrantyContract {
  id: string;
  customer: string;
  vehicle: string;
  plan: string;
  premium: number;
  coverage: string;
  expiresAt: string;
  status: "active" | "expiring_soon" | "expired";
}

const loanApplications: LoanApplication[] = [
  { id: "1", customer: "John Smith", vehicle: "2024 Toyota Camry", amount: 28500, type: "loan", status: "approved", lender: "Toyota Financial", submittedAt: "2 hours ago" },
  { id: "2", customer: "Sarah Johnson", vehicle: "2024 Honda CR-V", amount: 35000, type: "loan", status: "pending", lender: "Honda Financial", submittedAt: "4 hours ago" },
  { id: "3", customer: "Mike Wilson", vehicle: "2024 BMW X3", amount: 52000, type: "lease", status: "documents_required", lender: "BMW Financial", submittedAt: "Yesterday" },
  { id: "4", customer: "Emily Brown", vehicle: "2023 Ford F-150", amount: 48000, type: "loan", status: "pending", lender: "Ford Credit", submittedAt: "Yesterday" },
  { id: "5", customer: "David Lee", vehicle: "2024 Tesla Model 3", amount: 42000, type: "loan", status: "declined", lender: "Tesla Financing", submittedAt: "2 days ago" },
];

const warrantyContracts: WarrantyContract[] = [
  { id: "1", customer: "Robert Garcia", vehicle: "2022 Toyota Highlander", plan: "Premium Protection", premium: 2500, coverage: "5 years / 100,000 mi", expiresAt: "Dec 2027", status: "active" },
  { id: "2", customer: "Jennifer Martinez", vehicle: "2021 Honda Accord", plan: "Basic Coverage", premium: 1200, coverage: "3 years / 36,000 mi", expiresAt: "Mar 2024", status: "expiring_soon" },
  { id: "3", customer: "William Anderson", vehicle: "2023 Ford Explorer", plan: "Extended Warranty", premium: 1800, coverage: "4 years / 50,000 mi", expiresAt: "Aug 2027", status: "active" },
  { id: "4", customer: "Lisa Thompson", vehicle: "2020 Chevrolet Tahoe", plan: "Comprehensive", premium: 2200, coverage: "5 years / 75,000 mi", expiresAt: "Jan 2024", status: "expired" },
];

const revenueData = [
  { name: "F&I Products", value: 45000, color: "hsl(var(--primary))" },
  { name: "Warranties", value: 28000, color: "hsl(142, 76%, 36%)" },
  { name: "Insurance", value: 18000, color: "hsl(45, 93%, 47%)" },
  { name: "GAP Coverage", value: 12000, color: "hsl(262, 83%, 58%)" },
];

const monthlyRevenue = [
  { month: "Oct", revenue: 85000 },
  { month: "Nov", revenue: 92000 },
  { month: "Dec", revenue: 115000 },
  { month: "Jan", revenue: 103000 },
];

const loanStatusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  approved: "bg-green-500/10 text-green-600 border-green-200",
  declined: "bg-red-500/10 text-red-600 border-red-200",
  documents_required: "bg-orange-500/10 text-orange-600 border-orange-200",
};

const warrantyStatusColors = {
  active: "bg-green-500/10 text-green-600 border-green-200",
  expiring_soon: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  expired: "bg-red-500/10 text-red-600 border-red-200",
};

export function FinanceTab() {
  const stats = {
    totalPending: loanApplications.filter((l) => l.status === "pending").length,
    totalApproved: loanApplications.filter((l) => l.status === "approved").length,
    activeWarranties: warrantyContracts.filter((w) => w.status === "active").length,
    monthlyRevenue: 103000,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPending}</p>
                <p className="text-xs text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalApproved}</p>
                <p className="text-xs text-muted-foreground">Approved This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeWarranties}</p>
                <p className="text-xs text-muted-foreground">Active Warranties</p>
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
                <p className="text-2xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">F&I Revenue (MTD)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">${(item.value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly F&I Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications & Warranties */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Loan & Lease Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loanApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{app.customer}</p>
                    <p className="text-xs text-muted-foreground">{app.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{app.lender}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className={loanStatusColors[app.status]}>
                      {app.status.replace("_", " ")}
                    </Badge>
                    <p className="text-sm font-medium">${app.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{app.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Warranty Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warrantyContracts.map((contract) => (
                <div key={contract.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{contract.customer}</p>
                    <p className="text-xs text-muted-foreground">{contract.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{contract.plan}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className={warrantyStatusColors[contract.status]}>
                      {contract.status.replace("_", " ")}
                    </Badge>
                    <p className="text-sm font-medium">${contract.premium.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Expires: {contract.expiresAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
