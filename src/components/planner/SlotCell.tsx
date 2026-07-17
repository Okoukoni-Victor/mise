"use client";

import { Plus, X } from "lucide-react";
import { Meal, MealSlot } from "@/lib/types";
import { SLOT_CONFIG } from "./slotConfig";

export default function SlotCell({
  slot,
  meal,
  onAdd,
  onRemove,
}: {
  slot: MealSlot;
  meal: Meal | null;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const cfg = SLOT_CONFIG[slot];

  const slotStyle = {
    "--slot-bg": cfg.background,
    "--slot-color": cfg.color,
    "--slot-border": cfg.border,
  } as React.CSSProperties;

  return meal ? (
    <div
      className="overflow-hidden flex flex-col min-h-[88px] mb-[6px] border
          border-[var(--slot-border)] rounded-[8px] bg-[var(--slot-bg)]"
      style={slotStyle}
    >
      <div
        className="flex justify-between items-center border-b
            border-[var(--slot-border)] px-[8px] pt-[7px] pb-[6px]"
      >
        <span
          className="flex items-center gap-[4px] tracking-[0.06em] text-[10px] uppercase
            font-bold text-[var(--slot-color)]"
        >
          <cfg.Icon size={10} strokeWidth={2.2} />

          {cfg.label}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove meal"
          className="select-none cursor-pointer flex items-center bg-transparent
            text-[var(--slot-color)]"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>

      <button
        type="button"
        onClick={onAdd}
        title="Click to replace"
        className="select-none cursor-pointer flex-1 flex flex-col justify-center
          items-center gap-[3px] p-[8px] bg-transparent"
      >
        <span
          className="block w-full leading-[1.3] truncate text-[13px] font-semibold
            text-[var(--slot-color)]"
        >
          {meal.name}
        </span>

        <span className="text-[11px] text-[var(--color-muted)]">
          {meal.prepTime} min
        </span>
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={onAdd}
      className="group select-none cursor-pointer flex flex-col justify-center items-center
        gap-[5px] w-full min-h-[88px] mb-[6px] border-[1.5px] border-dashed
        border-[var(--color-border)] rounded-[8px] p-[8px] bg-[var(--color-surface)]
        transition-colors duration-150 hover:border-[var(--slot-border)]
        hover:bg-[var(--slot-bg)]"
      style={slotStyle}
    >
      <span
        className="flex items-center gap-[4px] tracking-[0.06em] text-[10px]
        uppercase font-bold text-[var(--color-muted)] transition-colors duration-150
        group-hover:text-[var(--slot-color)]"
      >
        <cfg.Icon size={10} strokeWidth={2.2} />

        {cfg.label}
      </span>

      <Plus size={14} strokeWidth={2} className="text-[var(--color-muted)]" />
    </button>
  );
}
