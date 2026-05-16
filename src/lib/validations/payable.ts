import { z } from "zod";

export const payableSchema = z.object({
  creditor: z.string().min(2, "El acreedor debe tener al menos 2 caracteres"),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
  description: z.string().min(2, "La descripción es requerida"),
  date: z.coerce.date(),
});

export type PayableInput = z.infer<typeof payableSchema>;
