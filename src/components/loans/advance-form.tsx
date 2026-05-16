"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanAdvanceSchema, type LoanAdvanceInput } from "@/lib/validations/loan";
import { z } from "zod";
import { addLoanAdvance } from "@/actions/loans";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdvanceFormProps {
  loanId: string;
  onSuccess?: () => void;
}

export function AdvanceForm({ loanId, onSuccess }: AdvanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof loanAdvanceSchema>>({
    resolver: zodResolver(loanAdvanceSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (formData: z.input<typeof loanAdvanceSchema>) => {
    setIsLoading(true);
    const data = formData as LoanAdvanceInput;

    try {
      const res = await addLoanAdvance(loanId, data);

      if (res?.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Adelanto registrado");
        reset();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo registrar el adelanto" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-zinc-400">Monto del Adelanto (Bs.)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm">Bs.</span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="pl-10 h-10 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
            disabled={isLoading}
            {...register("amount")}
          />
        </div>
        {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-zinc-400">Descripción (Opcional)</Label>
        <Input
          id="description"
          placeholder="Ej: Pago de primera cuota"
          className="h-10 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
          disabled={isLoading}
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-zinc-400">Fecha</Label>
        <Input
          id="date"
          type="datetime-local"
          className="h-10 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500 [color-scheme:dark]"
          disabled={isLoading}
          {...register("date")}
        />
        {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Registrar Adelanto
      </Button>
    </form>
  );
}
