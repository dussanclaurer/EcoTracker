import {
  UtensilsCrossed,
  Car,
  Home,
  Lightbulb,
  Gamepad2,
  Shirt,
  Heart,
  GraduationCap,
  ShoppingCart,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: "alimentacion",
    label: "Alimentación",
    icon: UtensilsCrossed,
    color: "#F97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
  },
  {
    id: "transporte",
    label: "Transporte",
    icon: Car,
    color: "#3B82F6",
    bgColor: "rgba(59, 130, 246, 0.15)",
  },
  {
    id: "vivienda",
    label: "Vivienda",
    icon: Home,
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    id: "servicios",
    label: "Servicios",
    icon: Lightbulb,
    color: "#EAB308",
    bgColor: "rgba(234, 179, 8, 0.15)",
  },
  {
    id: "entretenimiento",
    label: "Entretenimiento",
    icon: Gamepad2,
    color: "#EC4899",
    bgColor: "rgba(236, 72, 153, 0.15)",
  },
  {
    id: "ropa",
    label: "Ropa",
    icon: Shirt,
    color: "#14B8A6",
    bgColor: "rgba(20, 184, 166, 0.15)",
  },
  {
    id: "salud",
    label: "Salud",
    icon: Heart,
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
  },
  {
    id: "educacion",
    label: "Educación",
    icon: GraduationCap,
    color: "#6366F1",
    bgColor: "rgba(99, 102, 241, 0.15)",
  },
  {
    id: "compras",
    label: "Compras",
    icon: ShoppingCart,
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.15)",
  },
  {
    id: "otros",
    label: "Otros",
    icon: CircleDollarSign,
    color: "#6B7280",
    bgColor: "rgba(107, 114, 128, 0.15)",
  },
];

/**
 * Obtiene una categoría por su ID
 */
export function getCategoryById(id: string): Category | undefined {
  return EXPENSE_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Obtiene la categoría por defecto (Otros)
 */
export function getDefaultCategory(): Category {
  return EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}
