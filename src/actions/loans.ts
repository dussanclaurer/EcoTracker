"use server";

import prisma from "@/lib/prisma";
import { loanSchema, loanAdvanceSchema, loanAmplifySchema } from "@/lib/validations/loan";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getLoans() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    const loans = await prisma.loan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        advances: {
          orderBy: { date: "desc" },
        },
        amplifications: {
          orderBy: { date: "desc" },
        },
      },
    });

    return loans;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw new Error("Error al obtener los préstamos");
  }
}

export async function getLoanById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    const loan = await prisma.loan.findUnique({
      where: { id },
      include: {
        advances: {
          orderBy: { date: "desc" },
        },
        amplifications: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!loan || loan.userId !== session.user.id) {
      return null;
    }

    return loan;
  } catch (error) {
    console.error("Error fetching loan:", error);
    throw new Error("Error al obtener el préstamo");
  }
}

export async function createLoan(data: z.infer<typeof loanSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const validatedData = loanSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const expectedProfit = (validatedData.data.principalAmount * validatedData.data.interestRate) / 100;
    const totalDue = validatedData.data.principalAmount + expectedProfit;

    await prisma.loan.create({
      data: {
        debtor: validatedData.data.debtor,
        principalAmount: validatedData.data.principalAmount,
        interestRate: validatedData.data.interestRate,
        expectedProfit,
        totalDue,
        pendingBalance: totalDue,
        date: validatedData.data.date,
        userId: session.user.id,
      },
    });

    revalidatePath("/loans");
    revalidatePath("/dashboard");
    return { success: "Préstamo registrado exitosamente" };
  } catch (error) {
    console.error("Error creating loan:", error);
    return { error: "Ocurrió un error al registrar el préstamo" };
  }
}

export async function addLoanAdvance(loanId: string, data: z.infer<typeof loanAdvanceSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const validatedData = loanAdvanceSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan || loan.userId !== session.user.id) {
      return { error: "Préstamo no encontrado o no autorizado" };
    }

    if (loan.status === "paid") {
      return { error: "Este préstamo ya está pagado" };
    }

    const newTotalPaid = loan.totalPaid + validatedData.data.amount;
    const newPendingBalance = loan.totalDue - newTotalPaid;
    const newStatus = newPendingBalance <= 0 ? "paid" : "active";

    await prisma.$transaction([
      prisma.loanAdvance.create({
        data: {
          amount: validatedData.data.amount,
          description: validatedData.data.description,
          date: validatedData.data.date,
          loanId,
        },
      }),
      prisma.loan.update({
        where: { id: loanId },
        data: {
          totalPaid: newTotalPaid,
          pendingBalance: newPendingBalance > 0 ? newPendingBalance : 0,
          status: newStatus,
        },
      }),
    ]);

    revalidatePath(`/loans/${loanId}`);
    revalidatePath("/loans");
    revalidatePath("/dashboard");
    return { success: "Adelanto registrado exitosamente" };
  } catch (error) {
    console.error("Error adding loan advance:", error);
    return { error: "Ocurrió un error al registrar el adelanto" };
  }
}

export async function amplifyLoan(loanId: string, data: z.infer<typeof loanAmplifySchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const validatedData = loanAmplifySchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan || loan.userId !== session.user.id) {
      return { error: "Préstamo no encontrado o no autorizado" };
    }

    if (loan.status === "paid") {
      return { error: "No se puede ampliar un préstamo ya pagado" };
    }

    const updatedPrincipal = loan.principalAmount + validatedData.data.additionalAmount;
    const updatedInterestRate = validatedData.data.newInterestRate ?? loan.interestRate;
    
    // Recalcular la ganancia esperada sobre el nuevo principal total
    const newExpectedProfit = (updatedPrincipal * updatedInterestRate) / 100;
    const newTotalDue = updatedPrincipal + newExpectedProfit;
    const newPendingBalance = newTotalDue - loan.totalPaid;

    await prisma.$transaction([
      prisma.loanAmplification.create({
        data: {
          additionalAmount: validatedData.data.additionalAmount,
          newInterestRate: updatedInterestRate,
          newTotalDue,
          reason: validatedData.data.reason,
          date: validatedData.data.date,
          loanId,
        },
      }),
      prisma.loan.update({
        where: { id: loanId },
        data: {
          principalAmount: updatedPrincipal,
          interestRate: updatedInterestRate,
          expectedProfit: newExpectedProfit,
          totalDue: newTotalDue,
          pendingBalance: newPendingBalance,
          status: "active", // Por si estaba a punto de ser pagado y se amplió
        },
      }),
    ]);

    revalidatePath(`/loans/${loanId}`);
    revalidatePath("/loans");
    revalidatePath("/dashboard");
    return { success: "Ampliación de préstamo registrada" };
  } catch (error) {
    console.error("Error amplifying loan:", error);
    return { error: "Ocurrió un error al ampliar el préstamo" };
  }
}

export async function deleteLoan(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const loan = await prisma.loan.findUnique({
      where: { id },
    });

    if (!loan || loan.userId !== session.user.id) {
      return { error: "Préstamo no encontrado o no autorizado" };
    }

    await prisma.loan.delete({
      where: { id },
    });

    revalidatePath("/loans");
    revalidatePath("/dashboard");
    return { success: "Préstamo eliminado" };
  } catch (error) {
    console.error("Error deleting loan:", error);
    return { error: "Ocurrió un error al eliminar el préstamo" };
  }
}
