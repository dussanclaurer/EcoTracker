"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { z } from "zod";

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const parsedData = registerSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: parsedData.error.issues[0].message };
    }

    const validatedData = parsedData.data;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        username: validatedData.username,
      },
    });

    if (existingUser) {
      return { error: "El nombre de usuario ya está en uso" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name: validatedData.name,
        username: validatedData.username,
        password: hashedPassword,
      },
    });

    return { success: "Usuario registrado exitosamente" };
  } catch (error) {
    console.error("Error registering user:", error);
    return { error: "Ocurrió un error al registrar el usuario" };
  }
}
