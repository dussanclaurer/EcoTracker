import { z } from "zod";

export const loanSchema = z.object({
  debtor: z.string().min(2, "El nombre del deudor es muy corto"),
  principalAmount: z.coerce.number().positive("El monto prestado debe ser mayor a 0"),
  interestRate: z.coerce.number().min(0, "El interés no puede ser negativo"),
  date: z.coerce.date(),
});

export type LoanInput = z.infer<typeof loanSchema>;

export const loanAdvanceSchema = z.object({
  amount: z.coerce.number().positive("El monto del adelanto debe ser mayor a 0"),
  description: z.string().optional(),
  date: z.coerce.date(),
});

export type LoanAdvanceInput = z.infer<typeof loanAdvanceSchema>;

export const loanAmplifySchema = z.object({
  additionalAmount: z.coerce.number().positive("El monto de ampliación debe ser mayor a 0"),
  newInterestRate: z.coerce.number().min(0, "El interés no puede ser negativo").optional(),
  reason: z.string().optional(),
  date: z.coerce.date(),
});

export type LoanAmplifyInput = z.infer<typeof loanAmplifySchema>;
