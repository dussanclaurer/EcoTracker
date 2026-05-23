"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseInput } from "@/lib/validations/expense";
import { z } from "zod";
import { createExpense } from "@/actions/expenses";
import { useRouter } from "next/navigation";
import { getLocalDateTimeString } from "@/lib/utils";
import { toast } from "sonner";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export function ExpenseForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: getLocalDateTimeString(),
    },
  });

  const onSubmit = async (formData: z.input<typeof expenseSchema>) => {
    setIsLoading(true);
    const data = formData as ExpenseInput; // Sabemos que pasó la validación de Zod y fue coercido

    try {
      const res = await createExpense(data);

      if (res?.error) {
        toast.error("Error", { description: res.error });
      } else {
        toast.success("Gasto registrado");
        router.push("/expenses");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo registrar el gasto" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6 bg-zinc-950">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/expenses"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Nuevo Gasto</h1>
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
              className="pl-12 h-14 text-2xl font-semibold bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500"
              disabled={isLoading}
              {...register("amount")}
            />
          </div>
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="categoryId" className="text-zinc-400">Categoría</Label>
          <Select 
            onValueChange={(val) => { if (val) setValue("categoryId", val as string) }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-12 bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 max-h-[300px]">
              {EXPENSE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <SelectItem key={cat.id} value={cat.id} className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-3 py-1">
                      <div className="p-1.5 rounded-md" style={{ backgroundColor: cat.bgColor }}>
                        <Icon size={16} style={{ color: cat.color }} />
                      </div>
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-zinc-400">Descripción</Label>
          <Input
            id="description"
            placeholder="Ej: Almuerzo en restaurante"
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500"
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
            className="h-12 bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500 [color-scheme:dark]"
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
            className="w-full h-14 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Guardar Gasto"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
