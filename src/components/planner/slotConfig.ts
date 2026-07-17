import { Sunrise, Sun, Moon } from "lucide-react";
import { MealSlot } from "@/lib/types";

export const SLOT_CONFIG: Record<
  MealSlot,
  {
    label: string;
    Icon: React.ElementType;
    background: string;
    color: string;
    border: string;
  }
> = {
  breakfast: {
    label: "Breakfast",
    Icon: Sunrise,
    background: "var(--color-green-50)",
    color: "var(--color-green-600)",
    border: "var(--color-green-400)",
  },
  lunch: {
    label: "Lunch",
    Icon: Sun,
    background: "var(--color-salmon-50)",
    color: "var(--color-salmon-600)",
    border: "var(--color-salmon-400)",
  },
  dinner: {
    label: "Dinner",
    Icon: Moon,
    background: "var(--color-background)",
    color: "var(--color-foreground)",
    border: "var(--color-muted)",
  },
};

export const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];
