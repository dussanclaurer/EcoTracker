import { getIncomes } from "@/actions/income";
import { IncomeList } from "@/components/income/income-list";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingresos | EcoTracker",
};

export const dynamic = "force-dynamic";

export default async function IncomePage() {
  const incomes = await getIncomes();

  const total = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="relative min-h-[calc(100vh-4rem-4rem)] p-4 md:p-8">
      {/* Resumen Superior */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-emerald-100 font-medium mb-1">Total Ingresos (Histórico)</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {formatCurrency(total)}
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Historial de Ingresos</h3>
      </div>

      {/* Lista de Ingresos */}
      <IncomeList incomes={incomes} />

      {/* FAB para Móvil y Desktop */}
      <div className="fixed bottom-20 md:bottom-10 right-4 md:right-8 z-40">
        <Link 
          href="/income/new"
          className="inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700 text-white transition-transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
