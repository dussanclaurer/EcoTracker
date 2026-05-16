"use client";

import { PayableCard } from "./payable-card";

interface PayableListProps {
  payables: any[];
}

export function PayableList({ payables }: PayableListProps) {
  if (payables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900/50 flex items-center justify-center">
          <span className="text-2xl">🧾</span>
        </div>
        <h3 className="text-lg font-medium text-white">Todo al día</h3>
        <p className="text-sm text-zinc-400 max-w-[250px] mt-1">
          No tienes ninguna cuenta por pagar registrada.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20">
      {payables.map((payable) => (
        <PayableCard key={payable.id} payable={payable} />
      ))}
    </div>
  );
}
