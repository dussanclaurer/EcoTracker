"use client";

import { useState } from "react";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { getCategoryById, getDefaultCategory } from "@/lib/categories";
import { Trash2, Loader2 } from "lucide-react";
import { deleteExpense } from "@/actions/expenses";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface ExpenseCardProps {
  expense: {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: Date;
  };
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const categoryInfo = getCategoryById(expense.category) || getDefaultCategory();
  const Icon = categoryInfo.icon;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteExpense(expense.id);
      if (res.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Gasto eliminado");
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo eliminar el gasto" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 mb-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 transition-colors">
      <div className="flex items-center gap-4">
        {/* Icono de Categoría */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ backgroundColor: categoryInfo.bgColor }}
        >
          <Icon size={24} style={{ color: categoryInfo.color }} />
        </div>

        {/* Detalles */}
        <div className="flex flex-col">
          <span className="font-medium text-white truncate max-w-[150px] sm:max-w-xs">
            {expense.description}
          </span>
          <span className="text-xs text-zinc-400">
            {categoryInfo.label} • {formatRelativeDate(expense.date)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Monto */}
        <span className="font-semibold text-white">
          -{formatCurrency(expense.amount)}
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
