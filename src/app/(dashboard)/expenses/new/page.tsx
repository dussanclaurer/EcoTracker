import { ExpenseForm } from "@/components/expenses/expense-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Gasto | EcoTracker",
};

export default function NewExpensePage() {
  return <ExpenseForm />;
}
