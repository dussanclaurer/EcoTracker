import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
  description: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres")
    .max(100, "La descripción es muy larga"),
  categoryId: z.string().min(1, "Debe seleccionar una categoría"),
  date: z.coerce.date(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
