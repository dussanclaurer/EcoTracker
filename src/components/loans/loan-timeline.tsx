"use client";

import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface TimelineItem {
  id: string;
  type: "advance" | "amplification";
  amount: number;
  date: Date;
  description?: string | null;
  reason?: string | null;
}

interface LoanTimelineProps {
  items: TimelineItem[];
}

export function LoanTimeline({ items }: LoanTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-zinc-500">No hay movimientos registrados</p>
      </div>
    );
  }

  // Ordenar de más reciente a más antiguo
  const sortedItems = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="relative border-l border-zinc-800 ml-4 py-2 space-y-6">
      {sortedItems.map((item) => (
        <div key={item.id} className="relative pl-6">
          {/* Timeline Dot */}
          <div 
            className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-zinc-950 ${
              item.type === "advance" ? "bg-emerald-500" : "bg-rose-500"
            }`} 
          />
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white flex items-center gap-1.5">
                {item.type === "advance" ? (
                  <>
                    <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-500" />
                    Adelanto
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine className="w-3.5 h-3.5 text-rose-500" />
                    Ampliación
                  </>
                )}
              </span>
              <span className={`text-sm font-bold ${item.type === "advance" ? "text-emerald-400" : "text-rose-400"}`}>
                {item.type === "advance" ? "-" : "+"}{formatCurrency(item.amount)}
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 mt-0.5">
              {formatRelativeDate(item.date)}
            </p>
            
            {(item.description || item.reason) && (
              <p className="text-sm text-zinc-300 mt-2 bg-zinc-900/50 p-2 rounded-md">
                {item.description || item.reason}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
