import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Lado izquierdo con branding/imagen (Oculto en móvil) */}
      <div className="hidden md:flex flex-col justify-between bg-zinc-900 p-10 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-900 to-zinc-900" />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-indigo-500 p-2 rounded-lg flex items-center justify-center">
            <Image src="/Icon/favicon.png" alt="EcoTracker Logo" width={24} height={24} className="brightness-0 invert" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">EcoTracker</span>
        </div>

        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-zinc-300">
              "El secreto para salir adelante es empezar. Toma el control de tus finanzas personales con un seguimiento simple e inteligente."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Lado derecho con el formulario */}
      <div className="flex items-center justify-center p-6 md:p-10 relative bg-zinc-950">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950/0 to-transparent pointer-events-none" />
        
        <div className="w-full max-w-sm space-y-8 relative z-10">
          <div className="flex items-center justify-center md:hidden gap-2 mb-8">
            <div className="bg-indigo-500 p-2 rounded-lg flex items-center justify-center">
              <Image src="/Icon/favicon.png" alt="EcoTracker Logo" width={24} height={24} className="brightness-0 invert" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">EcoTracker</span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
