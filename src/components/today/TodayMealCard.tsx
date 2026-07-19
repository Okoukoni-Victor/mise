"use client";

import Link from "next/link";
import {
  Sunrise,
  Sun,
  Moon,
  Plus,
  X,
  Clock,
  Hash,
  TriangleAlert,
} from "lucide-react";
import { Meal, MealSlot } from "@/lib/types";

const SLOT_CONFIG: Record<
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
    border: "var(--color-green-200)",
  },
  lunch: {
    label: "Lunch",
    Icon: Sun,
    background: "var(--color-salmon-50)",
    color: "var(--color-salmon-600)",
    border: "var(--color-salmon-200)",
  },
  dinner: {
    label: "Dinner",
    Icon: Moon,
    background: "var(--color-background)",
    color: "var(--color-foreground)",
    border: "var(--color-border)",
  },
};

interface TodayMealCardProps {
  slot: MealSlot;
  meal: Meal | null;
  missingIngredients: string[];
  onOpen: () => void;
  onRemove: () => void;
}

export default function TodayMealCard({
  slot,
  meal,
  missingIngredients,
  onOpen,
  onRemove,
}: TodayMealCardProps) {
  const cfg = SLOT_CONFIG[slot];

  const slotStyle = {
    "--slot-bg": cfg.background,
    "--slot-color": cfg.color,
    "--slot-border": cfg.border,
  } as React.CSSProperties;

  return (
    <div
      className={`group overflow-hidden flex flex-col min-h-[200px] rounded-[14px]
        transition-colors duration-150
        ${
          meal
            ? `bg-[var(--slot-bg)]`
            : `bg-[var(--color-surface)] hover:bg-[var(--slot-bg)]`
        }
      `}
      style={slotStyle}
    >
      {/* Slot header */}
      <div
        className={`flex justify-between items-center border-b px-[16px] py-[12px]
          transition-colors duration-150
          ${meal ? "border-[var(--slot-border)]" : "border-[var(--color-border)]"}
        `}
      >
        <span
          className={`inline-flex items-center gap-[6px] tracking-[0.08em] text-[11px]
            uppercase font-bold transition-colors duration-150
            ${
              meal
                ? `text-[var(--slot-color)]`
                : `text-[var(--color-muted)] group-hover:text-[var(--slot-color)]`
            }
          `}
        >
          <cfg.Icon size={12} strokeWidth={2.2} />
          {cfg.label}
        </span>

        {meal && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove"
            className="select-none cursor-pointer inline-flex justify-center items-center
              bg-transparent text-[var(--slot-color)]"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Slot body */}
      <div className="flex-1 flex flex-col">
        {meal ? (
          <>
            <button
              type="button"
              onClick={onOpen}
              title="Tap to change"
              className="flex-1 select-none cursor-pointer flex flex-col
                justify-center items-center rounded-b-[14px] px-[16px] pt-[18px]
                pb-[14px] transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-inset focus-visible:ring-salmon-200"
            >
              <h3
                className="w-full mb-[10px] leading-[1.25] truncate text-[22px] font-bold
                  text-[var(--slot-color)]"
              >
                {meal.name}
              </h3>

              <div className="flex items-center gap-[14px] mb-[10px]">
                <span
                  className="flex items-center gap-[4px] text-[13px]
                    text-[var(--color-muted)]"
                >
                  <Clock size={13} strokeWidth={2} />
                  {meal.prepTime} min
                </span>

                {meal.ingredientIds.length > 0 && (
                  <span
                    className="flex items-center gap-[4px] text-[13px]
                      text-[var(--color-muted)]"
                  >
                    <Hash size={13} strokeWidth={2} />
                    {meal.ingredientIds.length} ingredient
                    {meal.ingredientIds.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <span className="text-[11px] text-[var(--slot-color)]">
                Tap to change
              </span>
            </button>

            {missingIngredients.length > 0 && (
              <Link
                href="/pantry"
                className="select-none inline-flex items-center gap-[3px] border-t
                  border-salmon-200 px-[16px] py-[9px] bg-[var(--color-surface)]
                  leading-[1.4] text-[12px] font-bold text-red-500"
              >
                <TriangleAlert
                  width={12}
                  strokeWidth={3.5}
                  className="flex-shrink-0 relative top-[-1px]"
                />

                <span>
                  Missing:{" "}
                  <span className="font-medium">
                    {missingIngredients[0] &&
                      (missingIngredients[0].length > 20
                        ? `${missingIngredients[0].slice(0, 20)}...`
                        : missingIngredients[0])}
                    {missingIngredients.length > 1 &&
                      ` +${missingIngredients.length - 1} more`}
                  </span>
                </span>
              </Link>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="flex-1 select-none cursor-pointer flex flex-col justify-center
              items-center gap-[8px] rounded-b-[14px] px-[16px] py-[24px] bg-transparent
              text-[var(--color-muted)] transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-inset focus-visible:ring-salmon-200"
          >
            <span
              className="inline-flex justify-center items-center w-[36px] h-[36px]
                border-[1.5px] border-dashed border-[var(--color-border)] rounded-full"
            >
              <Plus size={16} strokeWidth={2} />
            </span>

            <span className="text-[14px] font-medium">
              Plan {cfg.label.toLowerCase()}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
