import { CartesianGrid, Legend, Line, LineChart as RLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AXIS = { fontSize: 11, fill: "#5C6476" };

export default function LineChart({ data = [], xKey = "period", series = [], height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke="#EFF0F5" vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={{ stroke: "#E8E9F0" }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8E9F0", fontSize: 12 }} />
        {series.length > 1 && <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: "#5C6476" }}>{v}</span>} />}
        {series.map((s) => (
          <Line
            key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color}
            strokeWidth={2} dot={false} activeDot={{ r: 4 }}
          />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  );
}
