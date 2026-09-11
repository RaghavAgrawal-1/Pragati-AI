import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function DonutChart({ data = [], dataKey = "value", nameKey = "name", colors = [], height = 240, centerLabel, centerValue }) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} innerRadius="62%" outerRadius="88%" paddingAngle={2} stroke="none">
            {data.map((entry, i) => <Cell key={i} fill={entry.color ?? colors[i % colors.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #E8E9F0", fontSize: 12 }}
            formatter={(value, name) => [value, name]}
          />
          <Legend
            verticalAlign="bottom" height={28} iconType="circle" iconSize={8}
            formatter={(value) => <span style={{ fontSize: 12, color: "#5C6476" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {centerValue !== undefined && (
        <div className="pointer-events-none absolute inset-x-0 top-[42%] -translate-y-1/2 text-center">
          <p className="text-[22px] font-semibold tabular-nums leading-none text-ink">{centerValue}</p>
          {centerLabel && <p className="mt-1 text-[11.5px] text-muted">{centerLabel}</p>}
        </div>
      )}
    </div>
  );
}
