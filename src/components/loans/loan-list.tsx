"use client";

import { LoanCard } from "./loan-card";

interface LoanListProps {
  loans: any[]; // Usar tipado apropiado si es necesario
}

export function LoanList({ loans }: LoanListProps) {
  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900/50 flex items-center justify-center">
          <span className="text-2xl">🤝</span>
        </div>
        <h3 className="text-lg font-medium text-white">No hay préstamos</h3>
        <p className="text-sm text-zinc-400 max-w-[250px] mt-1">
          No tienes ningún préstamo registrado activo o pagado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20">
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  );
}
