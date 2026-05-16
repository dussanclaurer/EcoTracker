import { getLoanById } from "@/actions/loans";
import { AmplifyForm } from "@/components/loans/amplify-form";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ampliar Préstamo | EcoTracker",
};

export default async function AmplifyLoanPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const loan = await getLoanById(params.id);

  if (!loan) {
    notFound();
  }

  if (loan.status === "paid") {
    redirect(`/loans/${loan.id}`);
  }

  return <AmplifyForm loan={loan} />;
}
