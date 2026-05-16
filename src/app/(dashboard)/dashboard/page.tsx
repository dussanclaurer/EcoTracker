import { getDashboardData } from "@/actions/dashboard";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | EcoTracker",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="p-4 md:p-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tu Resumen Financiero</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Un vistazo rápido a tu salud financiera actual.
        </p>
      </div>

      {/* Tarjetas Superiores */}
      <OverviewCards overview={data.overview} />

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Gastos (Ocupa 1 columna en PC) */}
        <div className="lg:col-span-1">
          <ExpenseChart data={data.chartData} />
        </div>

        {/* Actividad Reciente (Ocupa 2 columnas en PC) */}
        <div className="lg:col-span-2">
          <RecentActivity activity={data.recentActivity} />
        </div>

      </div>

    </div>
  );
}
