"use client";

import { useState } from "react";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { Trash2, Loader2, TrendingUp, MoreVertical } from "lucide-react";
import { deleteIncome } from "@/actions/income";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IncomeCardProps {
  income: {
    id: string;
    amount: number;
    description: string;
    date: Date;
  };
}

export function IncomeCard({ income }: IncomeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteIncome(income.id);
      if (res.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Ingreso eliminado");
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo eliminar el ingreso" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 mb-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 transition-colors">
      <div className="flex items-center gap-4">
        {/* Icono de Ingreso */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10">
          <TrendingUp size={24} className="text-emerald-500" />
        </div>

        {/* Detalles */}
        <div className="flex flex-col">
          <span className="font-medium text-white truncate max-w-[150px] sm:max-w-xs">
            {income.description}
          </span>
          <span className="text-xs text-zinc-400">
            {formatRelativeDate(income.date)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Monto */}
        <span className="font-semibold text-emerald-400">
          +{formatCurrency(income.amount)}
        </span>

        {/* Acciones */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus-visible:outline-none">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
            <DropdownMenuItem 
              className="text-red-400 focus:text-red-300 focus:bg-red-950/50 cursor-pointer"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
