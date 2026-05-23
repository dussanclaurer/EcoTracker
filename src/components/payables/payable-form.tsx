"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { payableSchema, type PayableInput } from "@/lib/validations/payable";
import { z } from "zod";
import { createPayable } from "@/actions/payables";
import { useRouter } from "next/navigation";
import { getLocalDateTimeString } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function PayableForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof payableSchema>>({
    resolver: zodResolver(payableSchema),
    defaultValues: {
      date: getLocalDateTimeString(),
    },
  });

  const onSubmit = async (formData: z.input<typeof payableSchema>) => {
    setIsLoading(true);
    const data = formData as PayableInput;

    try {
      const res = await createPayable(data);

      if (res?.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Cuenta registrada");
        router.push("/payables");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo registrar la cuenta" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6 bg-zinc-950">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/payables"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Nueva Cuenta a Pagar</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Acreedor */}
        <div className="space-y-2">
          <Label htmlFor="creditor" className="text-zinc-400">Acreedor / Proveedor</Label>
          <Input
            id="creditor"
            placeholder="A quién le debes"
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-rose-500"
            disabled={isLoading}
            {...register("creditor")}
          />
          {errors.creditor && <p className="text-sm text-red-500">{errors.creditor.message}</p>}
        </div>

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
              className="pl-12 h-14 text-2xl font-semibold bg-zinc-900/50 border-zinc-800 focus-visible:ring-rose-500"
              disabled={isLoading}
              {...register("amount")}
            />
          </div>
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-zinc-400">Concepto</Label>
          <Input
            id="description"
            placeholder="Ej: Factura de luz, alquiler..."
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-rose-500"
            disabled={isLoading}
            {...register("description")}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-zinc-400">Fecha de Vencimiento</Label>
          <Input
            id="date"
            type="datetime-local"
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-rose-500 [color-scheme:dark]"
            disabled={isLoading}
            {...register("date")}
            defaultValue={getLocalDateTimeString()}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>

        {/* Submit */}
        <div className="pt-4 pb-10">
          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-500/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Guardar Cuenta"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
