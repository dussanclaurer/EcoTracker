"use client";

import { ExpenseCard } from "./expense-card";

interface ExpenseListProps {
  expenses: {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: Date;
  }[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900/50 flex items-center justify-center">
          <span className="text-2xl">💸</span>
        </div>
        <h3 className="text-lg font-medium text-white">No hay gastos</h3>
        <p className="text-sm text-zinc-400 max-w-[250px] mt-1">
          Aún no has registrado ningún gasto en este período.
        </p>
      </div>
    );
  }

  // Agrupar por fecha (Opcional, pero para mantenerlo simple por ahora listamos directo)
  return (
    <div className="flex flex-col w-full pb-20">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
