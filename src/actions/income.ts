"use server";

import prisma from "@/lib/prisma";
import { incomeSchema } from "@/lib/validations/income";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createIncome(data: z.infer<typeof incomeSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const validatedData = incomeSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    await prisma.income.create({
      data: {
        amount: validatedData.data.amount,
        description: validatedData.data.description,
        date: validatedData.data.date,
        userId: session.user.id,
      },
    });

    revalidatePath("/income");
    revalidatePath("/dashboard");
    return { success: "Ingreso registrado exitosamente" };
  } catch (error) {
    console.error("Error creating income:", error);
    return { error: "Ocurrió un error al registrar el ingreso" };
  }
}

export async function getIncomes(month?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    let dateFilter = {};
    if (month) {
      // month is expected to be "YYYY-MM"
      const [year, monthNum] = month.split("-").map(Number);
      // monthNum in JS Date is 0-indexed, so we subtract 1
      const startOfMonth = new Date(year, monthNum - 1, 1);
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);
      
      dateFilter = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      };
    }

    const incomes = await prisma.income.findMany({
      where: {
        userId: session.user.id,
        ...dateFilter,
      },
      orderBy: {
        date: "desc",
      },
    });

    return incomes;
  } catch (error) {
    console.error("Error fetching incomes:", error);
    throw new Error("Error al obtener los ingresos");
  }
}

export async function deleteIncome(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const income = await prisma.income.findUnique({
      where: { id },
    });

    if (!income || income.userId !== session.user.id) {
      return { error: "Ingreso no encontrado o no autorizado" };
    }

    await prisma.income.delete({
      where: { id },
    });

    revalidatePath("/income");
    revalidatePath("/dashboard");
    return { success: "Ingreso eliminado exitosamente" };
  } catch (error) {
    console.error("Error deleting income:", error);
    return { error: "Ocurrió un error al eliminar el ingreso" };
  }
}
