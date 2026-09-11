import { Area, AreaChart as RAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AXIS = { fontSize: 11, fill: "#5C6476" };

export default function AreaChart({ data = [], xKey = "period", series = [], height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="#EFF0F5" vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={{ stroke: "#E8E9F0" }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E8E9F0", fontSize: 12 }} />
        {series.map((s) => (
          <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} fill={`url(#grad-${s.key})`} />
        ))}
      </RAreaChart>
    </ResponsiveContainer>
  );
}
