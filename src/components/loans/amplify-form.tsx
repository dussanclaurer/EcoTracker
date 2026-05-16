"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanAmplifySchema, type LoanAmplifyInput } from "@/lib/validations/loan";
import { z } from "zod";
import { amplifyLoan } from "@/actions/loans";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface AmplifyFormProps {
  loan: {
    id: string;
    debtor: string;
    principalAmount: number;
    interestRate: number;
  };
}

export function AmplifyForm({ loan }: AmplifyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof loanAmplifySchema>>({
    resolver: zodResolver(loanAmplifySchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      newInterestRate: loan.interestRate,
    },
  });

  const additionalAmount = watch("additionalAmount");
  const newInterestRate = watch("newInterestRate");

  const simulatedPrincipal = loan.principalAmount + Number(additionalAmount || 0);
  const simulatedInterestRate = newInterestRate !== undefined && newInterestRate !== null && newInterestRate.toString() !== "" 
    ? Number(newInterestRate) 
    : loan.interestRate;
  
  const simulatedExpectedProfit = (simulatedPrincipal * simulatedInterestRate) / 100;
  const simulatedTotalDue = simulatedPrincipal + simulatedExpectedProfit;

  const onSubmit = async (formData: z.input<typeof loanAmplifySchema>) => {
    setIsLoading(true);
    const data = formData as LoanAmplifyInput;

    try {
      const res = await amplifyLoan(loan.id, data);

      if (res?.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Ampliación registrada");
        router.push(`/loans/${loan.id}`);
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo registrar la ampliación" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6 bg-zinc-950">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={`/loans/${loan.id}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Ampliar Préstamo</h1>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <p className="text-sm text-zinc-400 mb-1">Deudor</p>
        <p className="font-semibold text-white">{loan.debtor}</p>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-500">Monto Actual</p>
            <p className="text-sm text-white">{formatCurrency(loan.principalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Interés Actual</p>
            <p className="text-sm text-white">{loan.interestRate}%</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Monto Adicional */}
        <div className="space-y-2">
          <Label htmlFor="additionalAmount" className="text-zinc-400">Dinero Adicional (Bs.)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Bs.</span>
            <Input
              id="additionalAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-12 h-14 text-2xl font-semibold bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
              disabled={isLoading}
              {...register("additionalAmount")}
            />
          </div>
          {errors.additionalAmount && <p className="text-sm text-red-500">{errors.additionalAmount.message}</p>}
        </div>

        {/* Nuevo Interés */}
        <div className="space-y-2">
          <Label htmlFor="newInterestRate" className="text-zinc-400">Nuevo Interés (%) (Opcional)</Label>
          <div className="relative">
            <Input
              id="newInterestRate"
              type="number"
              step="0.1"
              placeholder={loan.interestRate.toString()}
              className="pr-12 h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
              disabled={isLoading}
              {...register("newInterestRate")}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">%</span>
          </div>
          <p className="text-xs text-zinc-500">Si lo dejas en blanco, se mantendrá el actual.</p>
          {errors.newInterestRate && <p className="text-sm text-red-500">{errors.newInterestRate.message}</p>}
        </div>

        {/* Motivo */}
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-zinc-400">Motivo (Opcional)</Label>
          <Input
            id="reason"
            placeholder="Ej: Aumento por mora, nuevo pedido..."
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-blue-500"
            disabled={isLoading}
            {...register("reason")}
          />
          {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
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
            <span className="text-zinc-400">Nuevo Principal:</span>
            <span className="text-white font-medium">Bs. {simulatedPrincipal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Nueva Ganancia:</span>
            <span className="text-emerald-400 font-medium">+ Bs. {simulatedExpectedProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-blue-900/30 pt-3">
            <span className="text-zinc-300">Nuevo Total a cobrar:</span>
            <span className="text-white font-bold text-lg">Bs. {simulatedTotalDue.toFixed(2)}</span>
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
              "Confirmar Ampliación"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
