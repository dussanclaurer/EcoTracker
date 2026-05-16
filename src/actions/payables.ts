"use server";

import prisma from "@/lib/prisma";
import { payableSchema } from "@/lib/validations/payable";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayable(data: z.infer<typeof payableSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const validatedData = payableSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    await prisma.payable.create({
      data: {
        creditor: validatedData.data.creditor,
        amount: validatedData.data.amount,
        description: validatedData.data.description,
        date: validatedData.data.date,
        userId: session.user.id,
        status: "pending",
      },
    });

    revalidatePath("/payables");
    revalidatePath("/dashboard");
    return { success: "Cuenta por pagar registrada exitosamente" };
  } catch (error) {
    console.error("Error creating payable:", error);
    return { error: "Ocurrió un error al registrar la cuenta por pagar" };
  }
}

export async function getPayables() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    const payables = await prisma.payable.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { status: "desc" }, // 'pending' > 'paid' alfabéticamente (p - e - n vs p - a - i) -> pending va primero
        { date: "asc" },    // más antiguo primero (los que vencen antes)
      ],
    });

    return payables;
  } catch (error) {
    console.error("Error fetching payables:", error);
    throw new Error("Error al obtener las cuentas por pagar");
  }
}

export async function togglePayableStatus(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const payable = await prisma.payable.findUnique({
      where: { id },
    });

    if (!payable || payable.userId !== session.user.id) {
      return { error: "Cuenta no encontrada o no autorizado" };
    }

    const newStatus = payable.status === "pending" ? "paid" : "pending";

    await prisma.payable.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/payables");
    revalidatePath("/dashboard");
    return { success: `Estado actualizado a ${newStatus === "paid" ? "Pagado" : "Pendiente"}` };
  } catch (error) {
    console.error("Error toggling payable status:", error);
    return { error: "Ocurrió un error al actualizar el estado" };
  }
}

export async function deletePayable(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "No autorizado" };
    }

    const payable = await prisma.payable.findUnique({
      where: { id },
    });

    if (!payable || payable.userId !== session.user.id) {
      return { error: "Cuenta no encontrada o no autorizado" };
    }

    await prisma.payable.delete({
      where: { id },
    });

    revalidatePath("/payables");
    revalidatePath("/dashboard");
    return { success: "Cuenta eliminada" };
  } catch (error) {
    console.error("Error deleting payable:", error);
    return { error: "Ocurrió un error al eliminar la cuenta" };
  }
}
