import { IncomeForm } from "@/components/income/income-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Ingreso | EcoTracker",
};

export default function NewIncomePage() {
  return <IncomeForm />;
}
