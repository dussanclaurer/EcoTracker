"use client";

import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { getCategoryById, getDefaultCategory } from "@/lib/categories";
import { TrendingUp } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "expense" | "income";
  amount: number;
  description: string;
  date: Date;
  category?: string;
}

interface RecentActivityProps {
  activity: ActivityItem[];
}

export function RecentActivity({ activity }: RecentActivityProps) {
  if (activity.length === 0) {
    return (
      <div className="p-6 text-center border border-zinc-800/50 rounded-2xl bg-zinc-900/20">
        <p className="text-sm text-zinc-500">Aún no hay actividad registrada</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800/50 rounded-2xl bg-zinc-900/20 overflow-hidden">
      <div className="p-4 border-b border-zinc-800/50">
        <h3 className="text-sm font-medium text-white">Actividad Reciente</h3>
      </div>
      
      <div className="divide-y divide-zinc-800/50">
        {activity.map((item) => {
          const isExpense = item.type === "expense";
          
          // Icono y colores
          let Icon;
          let bgColor, iconColor;
          let labelText;

          if (isExpense && item.category) {
            const cat = getCategoryById(item.category) || getDefaultCategory();
            Icon = cat.icon;
            bgColor = cat.bgColor;
            iconColor = cat.color;
            labelText = cat.label;
          } else {
            Icon = TrendingUp;
            bgColor = "rgba(16, 185, 129, 0.1)"; // emerald-500/10
            iconColor = "#10b981"; // emerald-500
            labelText = "Ingreso";
          }

          return (
            <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon size={18} style={{ color: iconColor }} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-white truncate max-w-[140px] sm:max-w-[200px]">
                    {item.description}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {labelText} • {formatRelativeDate(item.date)}
                  </span>
                </div>
              </div>
              
              <span className={`font-semibold text-sm ${isExpense ? 'text-white' : 'text-emerald-400'}`}>
                {isExpense ? "-" : "+"}{formatCurrency(item.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
