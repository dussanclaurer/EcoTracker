import { getLoanById, deleteLoan } from "@/actions/loans";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { ArrowLeft, Trash2, TrendingUp, Handshake, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LoanTimeline } from "@/components/loans/loan-timeline";
import { AdvanceForm } from "@/components/loans/advance-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default async function LoanDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const loan = await getLoanById(params.id);

  if (!loan) {
    notFound();
  }

  const isPaid = loan.status === "paid";
  const progressPercent = Math.min(100, Math.max(0, (loan.totalPaid / loan.totalDue) * 100));

  const timelineItems = [
    ...loan.advances.map(a => ({ ...a, type: "advance" as const })),
    ...loan.amplifications.map(a => ({ id: a.id, amount: a.additionalAmount, date: a.date, reason: a.reason, type: "amplification" as const }))
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem-4rem)] pb-20 md:pb-8">
      
      {/* Header Area */}
      <div className="sticky top-16 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/loans"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="font-semibold text-white truncate max-w-[200px]">
            {loan.debtor}
          </h1>
        </div>
        <div className="flex gap-2">
          {/* Opciones extra como eliminar */}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
        
        {/* Main Card */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {isPaid ? "Completado" : "Préstamo Activo"}
            </div>
            <div className="flex items-center gap-1 text-zinc-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(loan.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-zinc-400 mb-1">Saldo Pendiente</p>
            <h2 className="text-5xl font-bold text-white tracking-tight">
              {formatCurrency(loan.pendingBalance)}
            </h2>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400">Pagado: {formatCurrency(loan.totalPaid)}</span>
              <span className="text-zinc-400">De: {formatCurrency(loan.totalDue)}</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${isPaid ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div>
              <p className="text-xs text-zinc-500">Monto Inicial</p>
              <p className="font-medium text-white">{formatCurrency(loan.principalAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Interés</p>
              <p className="font-medium text-white">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Ganancia Esperada</p>
              <p className="font-medium text-emerald-400">+{formatCurrency(loan.expectedProfit)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isPaid && (
          <div className="grid grid-cols-2 gap-3">
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20">
                Registrar Adelanto
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-zinc-950 border-t border-zinc-800 rounded-t-3xl min-h-[50vh]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-white">Nuevo Adelanto</SheetTitle>
                  <SheetDescription className="text-zinc-400">
                    Registra un pago parcial o total para este préstamo.
                  </SheetDescription>
                </SheetHeader>
                <AdvanceForm loanId={loan.id} />
              </SheetContent>
            </Sheet>

            <Link 
              href={`/loans/${loan.id}/amplify`}
              className="inline-flex items-center justify-center whitespace-nowrap h-12 border border-blue-900 bg-blue-950/30 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 text-sm font-medium rounded-xl transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Ampliar
            </Link>
          </div>
        )}

        {isPaid && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-200">
              Este préstamo ha sido saldado en su totalidad. No se pueden registrar más movimientos.
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-white mb-4">Movimientos</h3>
          <LoanTimeline items={timelineItems} />
        </div>

      </div>
    </div>
  );
}
