"use client";

import { IncomeCard } from "./income-card";

interface IncomeListProps {
  incomes: {
    id: string;
    amount: number;
    description: string;
    date: Date;
  }[];
}

export function IncomeList({ incomes }: IncomeListProps) {
  if (incomes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900/50 flex items-center justify-center">
          <span className="text-2xl">💰</span>
        </div>
        <h3 className="text-lg font-medium text-white">No hay ingresos</h3>
        <p className="text-sm text-zinc-400 max-w-[250px] mt-1">
          Aún no has registrado ningún ingreso en este período.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20">
      {incomes.map((income) => (
        <IncomeCard key={income.id} income={income} />
      ))}
    </div>
  );
}
