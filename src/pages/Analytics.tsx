import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, TrendingUp, Target, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";

const downloadSourceData = [
  { month: "Aug", ads: 320, customerReferral: 180, dealershipReferral: 95 },
  { month: "Sep", ads: 410, customerReferral: 220, dealershipReferral: 130 },
  { month: "Oct", ads: 380, customerReferral: 260, dealershipReferral: 170 },
  { month: "Nov", ads: 520, customerReferral: 310, dealershipReferral: 210 },
  { month: "Dec", ads: 480, customerReferral: 340, dealershipReferral: 245 },
  { month: "Jan", ads: 560, customerReferral: 390, dealershipReferral: 280 },
];

const dealershipReferralData = [
  { name: "Downtown Motors", referrals: 420 },
  { name: "Sunset Auto Group", referrals: 310 },
  { name: "Pacific Auto", referrals: 185 },
  { name: "Metro Dealership", referrals: 140 },
  { name: "Valley Motors", referrals: 75 },
];

const COLORS = [
  "hsl(224, 76%, 62%)",
  "hsl(24, 95%, 53%)",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 55%)",
];

const serviceCenterData = [
  { name: "AutoCare Plus", value: 35 },
  { name: "Premium Motors", value: 25 },
  { name: "Quick Lube", value: 18 },
  { name: "City Workshop", value: 12 },
  { name: "Others", value: 10 },
];

const offerPerformance = [
  { name: "New Year Special", redemptions: 245, target: 500 },
  { name: "Come Back Offer", redemptions: 78, target: 200 },
  { name: "Loyalty Reward", redemptions: 0, target: 1000 },
  { name: "Winter Special", redemptions: 156, target: 300 },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

const Analytics = () => {
  return (
    <DashboardLayout
      title="Analytics & Insights"
      subtitle="Comprehensive data analysis and performance metrics"
    >
      {/* Key Metrics */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Downloads"
          value="4,890"
          change="+22% from last month"
          changeType="positive"
          icon={Download}
          iconColor="primary"
        />
        <StatCard
          title="New Users"
          value="1,247"
          change="+12% from last month"
          changeType="positive"
          icon={Users}
          iconColor="success"
        />
        <StatCard
          title="Conversion Rate"
          value="72%"
          change="+5% improvement"
          changeType="positive"
          icon={TrendingUp}
          iconColor="accent"
        />
        <StatCard
          title="Offer Redemption"
          value="49%"
          change="-2% from last month"
          changeType="negative"
          icon={Target}
          iconColor="warning"
        />
      </div>

      {/* Charts Row 1 - New download charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Downloads by Source */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Downloads by Source</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downloadSourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="ads" name="Ads" fill="hsl(224, 76%, 62%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="customerReferral" name="Customer Referral" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dealershipReferral" name="Dealership Referral" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dealership Referrals */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Customers by Dealership Referral</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealershipReferralData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={130}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="referrals" name="Referrals" radius={4}>
                  {dealershipReferralData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Service Center Distribution */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Top Service Centers</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceCenterData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
                >
                  {serviceCenterData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Offer Performance */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Offer Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offerPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={120}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="redemptions" name="Redemptions" fill="hsl(24, 95%, 53%)" radius={4} />
                <Bar dataKey="target" name="Target" fill="hsl(220, 9%, 76%)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="rounded-xl bg-card p-6 shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Key Insights</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <div className="rounded-lg bg-success/10 p-2">
              <ArrowUpRight className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground">Ad Downloads Leading</p>
              <p className="text-sm text-muted-foreground">
                Ads drive 45% of total downloads, up 17% this quarter
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Dealership Referrals Growing</p>
              <p className="text-sm text-muted-foreground">
                Dealership referrals increased 34% — Downtown Motors leads with 420 referrals
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <div className="rounded-lg bg-warning/10 p-2">
              <ArrowDownRight className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-medium text-foreground">Offer Redemption Dip</p>
              <p className="text-sm text-muted-foreground">
                Consider targeting non-preferred center users with special incentives
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
