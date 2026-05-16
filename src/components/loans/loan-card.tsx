"use client";

import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { Handshake, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LoanCardProps {
  loan: {
    id: string;
    debtor: string;
    principalAmount: number;
    interestRate: number;
    totalDue: number;
    totalPaid: number;
    pendingBalance: number;
    date: Date;
    status: string;
  };
}

export function LoanCard({ loan }: LoanCardProps) {
  const isPaid = loan.status === "paid";
  const progressPercent = Math.min(
    100,
    Math.max(0, (loan.totalPaid / loan.totalDue) * 100)
  );

  return (
    <Link
      href={`/loans/${loan.id}`}
      className={`block p-4 mb-3 rounded-2xl border transition-colors ${
        isPaid
          ? "bg-emerald-950/20 border-emerald-900/30 hover:bg-emerald-950/40"
          : "bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              isPaid ? "bg-emerald-500/20" : "bg-blue-500/20"
            }`}
          >
            <Handshake
              size={20}
              className={isPaid ? "text-emerald-500" : "text-blue-500"}
            />
          </div>
          <div>
            <h4 className="font-semibold text-white">{loan.debtor}</h4>
            <p className="text-xs text-zinc-400">
              {formatRelativeDate(loan.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isPaid
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-blue-500/10 text-blue-400"
            }`}
          >
            {isPaid ? "Pagado" : "Activo"}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-zinc-500 mb-0.5">Pendiente</p>
          <p className="font-semibold text-white">
            {formatCurrency(loan.pendingBalance)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-0.5">Total a cobrar</p>
          <p className="font-medium text-zinc-300">
            {formatCurrency(loan.totalDue)}
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isPaid ? "bg-emerald-500" : "bg-blue-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Link>
  );
}
