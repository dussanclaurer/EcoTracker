"use client";

import { useState } from "react";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { Trash2, Loader2, CheckCircle2, Circle, Clock, MoreVertical } from "lucide-react";
import { deletePayable, togglePayableStatus } from "@/actions/payables";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PayableCardProps {
  payable: {
    id: string;
    creditor: string;
    amount: number;
    description: string;
    status: string;
    date: Date;
  };
}

export function PayableCard({ payable }: PayableCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isPaid = payable.status === "paid";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deletePayable(payable.id);
      if (res.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Cuenta eliminada");
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo eliminar la cuenta" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const res = await togglePayableStatus(payable.id);
      if (res.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success(isPaid ? "Marcado como pendiente" : "Marcado como pagado");
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo actualizar el estado" });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-3 rounded-2xl border transition-all ${
      isPaid 
        ? "bg-zinc-950/40 border-zinc-900/50 opacity-60 hover:opacity-100" 
        : "bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/60"
    }`}>
      
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button 
          onClick={handleToggle}
          disabled={isToggling}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors"
        >
          {isToggling ? (
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          ) : isPaid ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <Circle className="w-6 h-6 text-zinc-500" />
          )}
        </button>

        {/* Detalles */}
        <div className="flex flex-col">
          <span className={`font-medium truncate max-w-[150px] sm:max-w-xs ${isPaid ? 'text-zinc-500 line-through' : 'text-white'}`}>
            {payable.creditor}
          </span>
          <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {formatRelativeDate(payable.date)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Monto */}
        <div className="flex flex-col items-end">
          <span className={`font-semibold ${isPaid ? 'text-zinc-600' : 'text-rose-400'}`}>
            {formatCurrency(payable.amount)}
          </span>
          <span className="text-[10px] text-zinc-500 truncate max-w-[80px]">
            {payable.description}
          </span>
        </div>

        {/* Acciones */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors focus-visible:outline-none">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
            <DropdownMenuItem 
              className="text-white focus:bg-zinc-900 cursor-pointer"
              onClick={handleToggle}
            >
              {isPaid ? "Marcar Pendiente" : "Marcar Pagado"}
            </DropdownMenuItem>
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
