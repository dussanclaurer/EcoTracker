"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema, type IncomeInput } from "@/lib/validations/income";
import { z } from "zod";
import { createIncome } from "@/actions/income";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function IncomeForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof incomeSchema>>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (formData: z.input<typeof incomeSchema>) => {
    setIsLoading(true);
    const data = formData as IncomeInput;

    try {
      const res = await createIncome(data);

      if (res?.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Ingreso registrado");
        router.push("/income");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo registrar el ingreso" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6 bg-zinc-950">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/income"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Nuevo Ingreso</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Monto */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-zinc-400">Monto (Bs.)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Bs.</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-12 h-14 text-2xl font-semibold bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500"
              disabled={isLoading}
              {...register("amount")}
            />
          </div>
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-zinc-400">Descripción / Fuente</Label>
          <Input
            id="description"
            placeholder="Ej: Salario, Venta, etc."
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500"
            disabled={isLoading}
            {...register("description")}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-zinc-400">Fecha</Label>
          <Input
            id="date"
            type="datetime-local"
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500 [color-scheme:dark]"
            disabled={isLoading}
            {...register("date")}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>

        {/* Submit */}
        <div className="pt-4 pb-10">
          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Guardar Ingreso"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
