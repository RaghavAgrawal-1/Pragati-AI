import { Bar, BarChart as RBarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AXIS = { fontSize: 11, fill: "#5C6476" };

/** `layout="vertical"` keeps long category names readable without rotation. */
export default function BarChart({ data = [], xKey, yKey = "count", color = "#38436A", height = 240, layout = "vertical", onSelect }) {
  const vertical = layout === "vertical";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} layout={layout} margin={{ top: 4, right: 12, bottom: 0, left: vertical ? 8 : -18 }}>
        <CartesianGrid stroke="#EFF0F5" horizontal={!vertical} vertical={vertical} />
        {vertical ? (
          <>
            <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey={xKey} tick={AXIS} tickLine={false} axisLine={false} width={104} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={AXIS} tickLine={false} axisLine={{ stroke: "#E8E9F0" }} />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
          </>
        )}
        <Tooltip cursor={{ fill: "#F5F6FA" }} contentStyle={{ borderRadius: 8, border: "1px solid #E8E9F0", fontSize: 12 }} />
        <Bar dataKey={yKey} radius={vertical ? [0, 4, 4, 0] : [4, 4, 0, 0]} maxBarSize={26} onClick={onSelect} cursor={onSelect ? "pointer" : undefined}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color ?? color} />)}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}
