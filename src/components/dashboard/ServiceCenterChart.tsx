import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Preferred Centers", value: 68, color: "hsl(142, 76%, 36%)" },
  { name: "Non-Preferred", value: 32, color: "hsl(38, 92%, 50%)" },
];

export function ServiceCenterChart() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Service Center Usage</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-success/10 p-3 text-center">
          <p className="text-2xl font-bold text-success">68%</p>
          <p className="text-xs text-muted-foreground">Preferred</p>
        </div>
        <div className="rounded-lg bg-warning/10 p-3 text-center">
          <p className="text-2xl font-bold text-warning">32%</p>
          <p className="text-xs text-muted-foreground">Non-Preferred</p>
        </div>
      </div>
    </div>
  );
}
