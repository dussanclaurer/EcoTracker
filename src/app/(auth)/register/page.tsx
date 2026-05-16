"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      // Usar Server Action para registrar
      const res = await registerUser(data);

      if (res.error) {
        toast.error("Error al registrarse", {
          description: res.error,
        });
        setIsLoading(false);
        return;
      }

      toast.success("Registro exitoso", {
        description: "Iniciando sesión automáticamente...",
      });

      // Auto-login después del registro
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("No se pudo iniciar sesión automáticamente");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-zinc-400">
          Ingresa tus datos para empezar a gestionar tus finanzas
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                type="text"
                disabled={isLoading}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                placeholder="juanperez"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                disabled={isLoading}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                disabled={isLoading}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
                disabled={isLoading}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button 
              type="submit"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white" 
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Registrarse
            </Button>
          </div>
        </form>
      </div>

      <p className="px-8 text-center text-sm text-zinc-400">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="hover:text-indigo-400 underline underline-offset-4"
        >
          Inicia Sesión
        </Link>
      </p>
    </>
  );
}
