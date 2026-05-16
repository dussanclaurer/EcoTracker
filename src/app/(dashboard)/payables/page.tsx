import { getPayables } from "@/actions/payables";
import { PayableList } from "@/components/payables/payable-list";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuentas por Pagar | EcoTracker",
};

export const dynamic = "force-dynamic";

export default async function PayablesPage() {
  const payables = await getPayables();

  // Calcular el total solo de las pendientes
  const totalPending = payables
    .filter((p) => p.status === "pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="relative min-h-[calc(100vh-4rem-4rem)] p-4 md:p-8">
      {/* Resumen Superior */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-rose-100 font-medium mb-1">Total Pendiente de Pago</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {formatCurrency(totalPending)}
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Mis Deudas</h3>
      </div>

      {/* Lista de Cuentas */}
      <PayableList payables={payables} />

      {/* FAB para Móvil y Desktop */}
      <div className="fixed bottom-20 md:bottom-10 right-4 md:right-8 z-40">
        <Link 
          href="/payables/new"
          className="inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-rose-500/30 bg-rose-600 hover:bg-rose-700 text-white transition-transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
