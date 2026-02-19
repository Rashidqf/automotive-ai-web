import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", users: 120, offers: 45 },
  { name: "Tue", users: 180, offers: 62 },
  { name: "Wed", users: 150, offers: 58 },
  { name: "Thu", users: 210, offers: 78 },
  { name: "Fri", users: 280, offers: 95 },
  { name: "Sat", users: 350, offers: 125 },
  { name: "Sun", users: 220, offers: 85 },
];

export function EngagementChart() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Weekly Engagement</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Active Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Offers Redeemed</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(224, 76%, 62%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(224, 76%, 62%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="hsl(224, 76%, 62%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
            <Area
              type="monotone"
              dataKey="offers"
              stroke="hsl(24, 95%, 53%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOffers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
