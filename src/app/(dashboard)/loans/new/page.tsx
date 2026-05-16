import { LoanForm } from "@/components/loans/loan-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Préstamo | EcoTracker",
};

export default function NewLoanPage() {
  return <LoanForm />;
}
