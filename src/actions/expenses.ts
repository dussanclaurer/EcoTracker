"use server";

import prisma from "@/lib/prisma";
import { expenseSchema } from "@/lib/validations/expense";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createExpense(data: z.infer<typeof expenseSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const validatedData = expenseSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    await prisma.expense.create({
      data: {
        amount: validatedData.data.amount,
        description: validatedData.data.description,
        category: validatedData.data.categoryId,
        date: validatedData.data.date,
        userId: session.user.id,
      },
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: "Gasto registrado exitosamente" };
  } catch (error) {
    console.error("Error creating expense:", error);
    return { error: "Ocurrió un error al registrar el gasto" };
  }
}

export async function getExpenses(month?: Date) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    let dateFilter = {};
    if (month) {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
      
      dateFilter = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      };
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        ...dateFilter,
      },
      orderBy: {
        date: "desc",
      },
    });

    return expenses;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw new Error("Error al obtener los gastos");
  }
}

export async function deleteExpense(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    // Verificar propiedad
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== session.user.id) {
      return { error: "Gasto no encontrado o no autorizado" };
    }

    await prisma.expense.delete({
      where: { id },
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: "Gasto eliminado exitosamente" };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { error: "Ocurrió un error al eliminar el gasto" };
  }
}
