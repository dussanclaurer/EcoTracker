"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanSchema, type LoanInput } from "@/lib/validations/loan";
import { z } from "zod";
import { createLoan } from "@/actions/loans";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoanForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      interestRate: 0,
    },
  });

  const principalAmount = watch("principalAmount");
  const interestRate = watch("interestRate");

  const expectedProfit = (Number(principalAmount || 0) * Number(interestRate || 0)) / 100;
  const totalDue = Number(principalAmount || 0) + expectedProfit;

  const onSubmit = async (formData: z.input<typeof loanSchema>) => {
    setIsLoading(true);
    const data = formData as LoanInput;

    try {
      const res = await createLoan(data);

      if (res?.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Préstamo registrado");
        router.push("/loans");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo registrar el préstamo" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6 bg-zinc-950">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/loans"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Nuevo Préstamo</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Deudor */}
        <div className="space-y-2">
          <Label htmlFor="debtor" className="text-zinc-400">Deudor</Label>
          <Input
            id="debtor"
            placeholder="Nombre de la persona"
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
            disabled={isLoading}
            {...register("debtor")}
          />
          {errors.debtor && <p className="text-sm text-red-500">{errors.debtor.message}</p>}
        </div>

        {/* Monto Prestado */}
        <div className="space-y-2">
          <Label htmlFor="principalAmount" className="text-zinc-400">Cantidad Prestada (Bs.)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Bs.</span>
            <Input
              id="principalAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-12 h-14 text-2xl font-semibold bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
              disabled={isLoading}
              {...register("principalAmount")}
            />
          </div>
          {errors.principalAmount && <p className="text-sm text-red-500">{errors.principalAmount.message}</p>}
        </div>

        {/* Interés */}
        <div className="space-y-2">
          <Label htmlFor="interestRate" className="text-zinc-400">Interés (%)</Label>
          <div className="relative">
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              placeholder="0"
              className="pr-12 h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
              disabled={isLoading}
              {...register("interestRate")}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">%</span>
          </div>
          {errors.interestRate && <p className="text-sm text-red-500">{errors.interestRate.message}</p>}
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-zinc-400">Fecha</Label>
          <Input
            id="date"
            type="datetime-local"
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500 [color-scheme:dark]"
            disabled={isLoading}
            {...register("date")}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>

        {/* Resumen Automático */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Ganancia esperada:</span>
            <span className="text-emerald-400 font-medium">+ Bs. {expectedProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-blue-900/30 pt-3">
            <span className="text-zinc-300">Total a cobrar:</span>
            <span className="text-white font-bold text-lg">Bs. {totalDue.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 pb-10">
          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Guardar Préstamo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
