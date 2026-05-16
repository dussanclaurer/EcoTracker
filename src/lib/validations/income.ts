import { z } from "zod";

export const incomeSchema = z.object({
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
  description: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres")
    .max(100, "La descripción es muy larga"),
  date: z.coerce.date(),
});

export type IncomeInput = z.infer<typeof incomeSchema>;
