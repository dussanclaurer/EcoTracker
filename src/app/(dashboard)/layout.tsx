import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Header />
      
      {/* El padding bottom es para que el contenido no quede oculto por el BottomNav en móviles */}
      <main className="flex-1 w-full max-w-7xl mx-auto pb-20 md:pb-8">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
