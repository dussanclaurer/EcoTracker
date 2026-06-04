"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function MonthFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Si no hay mes en la URL, podemos dejarlo vacío o poner el mes actual.
  // Es mejor dejar que el defaultValue sea el mes actual en formato YYYY-MM
  const currentMonth = searchParams.get("month") || ""; 
  
  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedMonth = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      
      if (selectedMonth) {
        params.set("month", selectedMonth);
      } else {
        params.delete("month");
      }
      
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="month-filter" className="text-sm font-medium text-zinc-400">
        Filtrar por mes:
      </label>
      <input
        id="month-filter"
        type="month"
        value={currentMonth}
        onChange={handleMonthChange}
        className="bg-zinc-900/80 border border-zinc-800 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 transition-colors"
      />
      {currentMonth && (
        <button 
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("month");
            router.push(`?${params.toString()}`);
          }}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
