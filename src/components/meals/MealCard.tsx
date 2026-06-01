"use client";

import { useState } from "react";
import { Clock, Hash, Edit2, Trash2 } from "lucide-react";
import { Meal, MealSlot } from "@/lib/types";
import { useStore } from "@/hooks/useStore";

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
}

const SLOT_STYLES: Record<MealSlot, { background: string; color: string }> = {
  breakfast: {
    background: "bg-green-100",
    color: "text-green-900",
  },
  lunch: {
    background: "bg-salmon-100",
    color: "text-salmon-900",
  },
  dinner: {
    background: "bg-[var(--color-border)]",
    color: "text-[var(--color-foreground)]",
  },
};

export default function MealCard({ meal, onEdit }: MealCardProps) {
  const { dispatch } = useStore();
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (!confirming) {
      setConfirming(true);
      // Auto-cancel after 3 seconds if user does nothing
      setTimeout(() => setConfirming(false), 3000);
    } else {
      dispatch({ type: "DELETE_MEAL", payload: meal.id });
    }
  };

  return (
    <div
      className="overflow-hidden flex flex-col border border-[var(--color-border)]
        rounded-[12px] bg-[var(--color-surface)] transition-all duration-200 ease-in
        hover:shadow-[0_4px_20px_rgba(120,60,45,0.07)] hover:border-salmon-200"
    >
      {/* Card body */}
      <div className="flex-1 p-[20px]">
        {/* Slot tags */}
        <div className="flex flex-wrap gap-[5px] mb-[12px]">
          {meal.slots.map((slot) => {
            const style = SLOT_STYLES[slot];

            return (
              <span
                key={slot}
                className={`select-none rounded-[20px]
                  px-[8px] py-[3px] whitespace-nowrap tracking-[0.07em] text-[10px]
                  uppercase font-semibold ${style.background} ${style.color}`}
              >
                {slot}
              </span>
            );
          })}
        </div>

        <h3
          className="mb-[16px] leading-[1.25] truncate text-[19px] font-semibold
            text-[var(--color-foreground)]"
        >
          {meal.name}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-[14px]">
          <span
            className="inline-flex items-center gap-[5px] whitespace-nowrap text-[13px]
              text-[var(--color-muted)]"
          >
            <Clock size={13} strokeWidth={2} />
            {meal.prepTime} min
          </span>

          {meal.ingredientIds.length > 0 && (
            <span
              className="inline-flex items-center gap-[5px] whitespace-nowrap text-[13px]
                text-[var(--color-muted)]"
            >
              <Hash size={13} strokeWidth={2} />
              {meal.ingredientIds.length} ingredient
              {meal.ingredientIds.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div
        className="flex justify-between items-center h-[48px] border-t
          border-[var(--color-border)] px-[20px] py-[11px]"
      >
        {confirming ? (
          /* Confirm delete row */
          <>
            <span
              className="whitespace-nowrap text-[13px] font-medium
                text-salmon-800"
            >
              Delete this meal?
            </span>

            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="select-none cursor-pointer border border-[var(--color-border)]
                  rounded-[6px] px-[10px] py-[4px] bg-transparent whitespace-nowrap
                  text-[12px] font-semibold text-[var(--color-muted)] transition-colors
                  duration-150 hover:bg-[var(--color-border)]
                  hover:text-[var(--color-foreground)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
                className="select-none cursor-pointer border border-transparent
                  rounded-[6px] px-[10px] py-[4px] bg-salmon-800 whitespace-nowrap
                  text-[12px] font-semibold text-white transition-colors duration-150
                  hover:bg-salmon-900"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          /* Normal actions */
          <>
            <button
              type="button"
              onClick={() => onEdit(meal)}
              className="select-none cursor-pointer inline-flex justify-center
                items-center gap-[5px] rounded-[6px] px-[8px] py-[5px] bg-transparent
                whitespace-nowrap text-[13px] font-semibold text-green-600
                transition-colors duration-150 hover:bg-green-50"
            >
              <Edit2 size={14} strokeWidth={2} />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDeleteClick}
              className="select-none cursor-pointer inline-flex justify-center
                items-center gap-[5px] rounded-[6px] px-[8px] py-[5px] bg-transparent
                whitespace-nowrap text-[13px] font-semibold text-salmon-800
                transition-colors duration-150 hover:bg-salmon-50"
            >
              <Trash2 size={14} strokeWidth={2} />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
