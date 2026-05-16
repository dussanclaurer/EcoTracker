"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ExpenseChartProps {
  data: {
    name: string;
    amount: number;
    fill: string;
  }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].payload.fill }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center border border-zinc-800/50 rounded-2xl bg-zinc-900/20">
        <p className="text-sm text-zinc-500">No hay gastos este mes</p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full p-4 border border-zinc-800/50 rounded-2xl bg-zinc-900/20">
      <h3 className="text-sm font-medium text-white mb-4">Gastos por Categoría (Mes actual)</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="amount"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Leyenda manual (Solo los 3 top para no saturar) */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-[10px] text-zinc-400 truncate max-w-[80px]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
