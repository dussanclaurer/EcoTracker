"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCategoryById, getDefaultCategory } from "@/lib/categories";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Consultar totales
  const [
    allExpenses,
    allIncomes,
    monthExpenses,
    monthIncomes,
    pendingPayables,
    activeLoans,
  ] = await Promise.all([
    prisma.expense.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.income.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.expense.aggregate({ where: { userId, date: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.income.aggregate({ where: { userId, date: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.payable.aggregate({ where: { userId, status: "pending" }, _sum: { amount: true } }),
    prisma.loan.aggregate({ where: { userId, status: "active" }, _sum: { pendingBalance: true } }),
  ]);

  const totalExpenses = allExpenses._sum.amount || 0;
  const totalIncomes = allIncomes._sum.amount || 0;
  const balance = totalIncomes - totalExpenses;

  // Actividad Reciente (Últimos 3 gastos y 2 ingresos, mezclados)
  const recentExpenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 3,
  });

  const recentIncomes = await prisma.income.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 2,
  });

  const recentActivity = [
    ...recentExpenses.map(e => ({ ...e, type: "expense" as const })),
    ...recentIncomes.map(i => ({ ...i, type: "income" as const }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  // Gastos por categoría para el gráfico (del mes actual)
  const expensesThisMonth = await prisma.expense.findMany({
    where: { userId, date: { gte: startOfMonth } },
    select: { category: true, amount: true },
  });

  const categoryTotals: Record<string, number> = {};
  expensesThisMonth.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const chartData = Object.entries(categoryTotals).map(([catId, amount]) => {
    const cat = getCategoryById(catId) || getDefaultCategory();
    return {
      name: cat.label,
      amount,
      fill: cat.color, // Color para Recharts
    };
  }).sort((a, b) => b.amount - a.amount);

  return {
    overview: {
      balance,
      monthExpenses: monthExpenses._sum.amount || 0,
      monthIncomes: monthIncomes._sum.amount || 0,
      pendingPayables: pendingPayables._sum.amount || 0,
      activeLoans: activeLoans._sum.pendingBalance || 0,
    },
    recentActivity,
    chartData,
  };
}
