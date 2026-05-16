"use client";

import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendingDown, TrendingUp, Landmark, AlertCircle } from "lucide-react";

interface OverviewCardsProps {
  overview: {
    balance: number;
    monthExpenses: number;
    monthIncomes: number;
    pendingPayables: number;
    activeLoans: number;
  };
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Balance Global */}
      <div className="col-span-2 lg:col-span-4 p-6 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-zinc-400 font-medium">Balance Global</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mt-2">
          {formatCurrency(overview.balance)}
        </h2>
      </div>

      {/* Ingresos Mes */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <p className="text-xs text-zinc-400">Ingresos Mes</p>
        </div>
        <p className="text-xl font-bold text-emerald-400">{formatCurrency(overview.monthIncomes)}</p>
      </div>

      {/* Gastos Mes */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-rose-500" />
          <p className="text-xs text-zinc-400">Gastos Mes</p>
        </div>
        <p className="text-xl font-bold text-rose-400">{formatCurrency(overview.monthExpenses)}</p>
      </div>

      {/* Préstamos Activos */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="w-4 h-4 text-blue-500" />
          <p className="text-xs text-zinc-400">Por Cobrar</p>
        </div>
        <p className="text-xl font-bold text-blue-400">{formatCurrency(overview.activeLoans)}</p>
      </div>

      {/* Cuentas por Pagar */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <p className="text-xs text-zinc-400">Por Pagar</p>
        </div>
        <p className="text-xl font-bold text-orange-400">{formatCurrency(overview.pendingPayables)}</p>
      </div>
    </div>
  );
}
