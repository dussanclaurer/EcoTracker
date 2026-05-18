"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  Handshake,
  MoreHorizontal,
} from "lucide-react";

const NAV_ITEMS = [
  {
    name: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Gastos",
    href: "/expenses",
    icon: TrendingDown,
  },
  {
    name: "Ingresos",
    href: "/income",
    icon: TrendingUp,
  },
  {
    name: "Préstamos",
    href: "/loans",
    icon: Handshake,
  },
  {
    name: "Más",
    href: "/payables",
    icon: MoreHorizontal, // Temporalmente usaremos Más para cuentas por pagar
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800 md:hidden pb-safe">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-zinc-900/50 group"
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-1 transition-transform group-hover:scale-110",
                  isActive ? "text-indigo-400" : "text-zinc-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px] truncate w-full text-center",
                  isActive ? "text-indigo-400 font-semibold" : "text-zinc-400"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
