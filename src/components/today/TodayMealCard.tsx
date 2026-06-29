"use client";

import Link from "next/link";
import { useState } from "react";
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
    headerBg: string;
    headerColor: string;
    accent: string;
    border: string;
  }
> = {
  breakfast: {
    label: "Breakfast",
    Icon: Sunrise,
    headerBg: "var(--color-green-50)",
    headerColor: "var(--color-green-600)",
    accent: "var(--color-green-600)",
    border: "var(--color-green-200)",
  },
  lunch: {
    label: "Lunch",
    Icon: Sun,
    headerBg: "var(--color-salmon-50)",
    headerColor: "var(--color-salmon-600)",
    accent: "var(--color-salmon-600)",
    border: "var(--color-salmon-200)",
  },
  dinner: {
    label: "Dinner",
    Icon: Moon,
    headerBg: "var(--color-background)",
    headerColor: "var(--color-foreground)",
    accent: "var(--color-foreground)",
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
  const [cardHovered, setCardHovered] = useState(false);
  const cfg = SLOT_CONFIG[slot];

  return (
    <div
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
      className="overflow-hidden flex flex-col min-h-[200px] border rounded-[14px]
        bg-[var(--color-surface)] transition-all duration-200
        hover:shadow-[0_4px_20px_rgba(2,82,89,0.07)]"
      style={{
        borderColor: meal
          ? cfg.border
          : cardHovered
            ? `var(--color-green-200)`
            : `var(--color-border)`,
      }}
    >
      {/* Slot header */}
      <div
        className="flex justify-between items-center px-[16px] py-[12px] transition-colors
          duration-200"
        style={{
          background: meal
            ? cfg.headerBg
            : cardHovered
              ? "var(--color-green-50)"
              : "var(--color-background)",
          borderBottom: `1px solid ${meal ? cfg.border : "var(--color-border)"}`,
        }}
      >
        <span
          className="inline-flex items-center gap-[6px] tracking-[0.08em] text-[11px]
            uppercase font-bold transition-colors duration-200"
          style={{
            color: meal
              ? cfg.headerColor
              : cardHovered
                ? "var(--color-green-600)"
                : "var(--color-muted)",
          }}
        >
          <cfg.Icon size={12} strokeWidth={2.2} />
          {cfg.label}
        </span>

        {meal && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove"
            className="select-none cursor-pointer opacity-50 inline-flex items-center bg-transparent
              transition-opacity duration-150 hover:opacity-100"
            style={{
              color: cfg.headerColor,
            }}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        {meal ? (
          <>
            <button
              type="button"
              onClick={onOpen}
              title="Tap to change"
              className="flex-1 select-none cursor-pointer px-[16px] pt-[18px] pb-[14px]
                bg-transparent transition-colors duration-150 hover:bg-[var(--header-bg)]"
              style={{ "--header-bg": cfg.headerBg } as React.CSSProperties}
            >
              <h3
                className="mb-[10px] leading-[1.25] text-[22px] font-bold
                  text-[var(--color-foreground)]"
              >
                {meal.name}
              </h3>

              <div className="flex items-center gap-[14px] mb-[10px]">
                <span
                  className="flex items-center gap-[4px] text-center text-[13px]
                    text-[var(--color-muted)]"
                >
                  <Clock size={12} strokeWidth={2} />
                  {meal.prepTime} min
                </span>

                {meal.ingredientIds.length > 0 && (
                  <span
                    className="flex items-center gap-[4px] text-center text-[13px]
                      text-[var(--color-muted)]"
                  >
                    <Hash size={12} strokeWidth={2} />
                    {meal.ingredientIds.length} ingredient
                    {meal.ingredientIds.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <span
                className="opacity-65 text-[11px]"
                style={{ color: cfg.accent }}
              >
                Tap to change
              </span>
            </button>

            {missingIngredients.length > 0 && (
              <Link
                href="/pantry"
                className="select-none inline-flex items-center gap-[3px] border-t
                  border-salmon-200 px-[16px] py-[9px] bg-salmon-50 leading-[1.4]
                  text-[12px] font-medium text-salmon-800"
              >
                <TriangleAlert width={12} strokeWidth={2} />

                <span>
                  Missing: {missingIngredients.slice(0, 2).join(", ")}
                  {missingIngredients.length > 2 &&
                    ` +${missingIngredients.length - 2} more`}
                </span>
              </Link>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="select-none cursor-pointer flex-1 inline-flex flex-col
              justify-center items-center gap-[8px] px-[16px] py-[24px] bg-transparent
              transition-colors duration-150 hover:bg-[var(--header-bg)]"
            style={{ "--header-bg": cfg.headerBg } as React.CSSProperties}
          >
            <span
              className="inline-flex justify-center items-center w-[36px] h-[36px]
                border-[1.5px] border-dashed border-[var(--color-border)] rounded-full
                bg-[var(--color-background)] text-[var(--color-muted)]"
            >
              <Plus size={16} strokeWidth={2} />
            </span>

            <span className="text-[14px] font-medium text-[var(--color-muted)]">
              Plan {cfg.label.toLowerCase()}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
