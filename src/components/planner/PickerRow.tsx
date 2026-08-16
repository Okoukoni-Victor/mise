"use client";

import { Clock, Check } from "lucide-react";
import { Meal } from "@/lib/types";

export default function PickerRow({
  meal,
  isCurrent,
  onSelect,
}: {
  meal: Meal;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group select-none cursor-pointer flex gap-[24px] w-full mb-[4px]
        border rounded-[10px] px-[12px] py-[11px] transition-all duration-150
        ${
          isCurrent
            ? `border-green-200 bg-green-50`
            : `border-transparent bg-transparent hover:border-[var(--color-border)]
               hover:bg-[var(--color-background)]`
        }
      `}
    >
      {/* Check indicator */}
      <span
        className={`inline-flex shrink-0 justify-center items-center w-[18px] h-[18px]
          border-2 rounded-full transition-all duration-150
          ${
            isCurrent
              ? `border-green-600 bg-green-600`
              : `border-[var(--color-border)] bg-transparent group-hover:border-green-400`
          }
        `}
      >
        {isCurrent && (
          <Check size={14} strokeWidth={2.5} className="text-white" />
        )}
      </span>

      <div className="flex flex-col gap-[4px] min-w-0">
        <span
          className={`self-start pb-1 truncate leading-none text-[16px] font-semibold
          ${isCurrent ? "text-green-600" : "text-[var(--color-foreground)]"}`}
        >
          {meal.name}
        </span>

        <span
          className="self-start flex items-center gap-[4px] text-[12px]
            text-[var(--color-muted)]"
        >
          <Clock size={11} strokeWidth={2} className="relative top-[-0.5px]" />
          {meal.prepTime} min
        </span>
      </div>
    </button>
  );
}
