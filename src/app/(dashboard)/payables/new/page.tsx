import { PayableForm } from "@/components/payables/payable-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva Cuenta por Pagar | EcoTracker",
};

export default function NewPayablePage() {
  return <PayableForm />;
}
