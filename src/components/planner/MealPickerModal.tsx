"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { MealSlot } from "@/lib/types";
import PickerRow from "./PickerRow";

interface MealPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  slot: MealSlot | null;
  currentMealId?: string;
  onSelect: (mealId: string) => void;
}

const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function MealPickerModal({
  isOpen,
  onClose,
  date,
  slot,
  currentMealId,
  onSelect,
}: MealPickerModalProps) {
  const { store } = useStore();
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !date || !slot) return null;

  const dayName = DAY_NAMES[new Date(date + "T00:00:00").getDay()];
  const slotLabel = SLOT_LABELS[slot];
  const isReplacing = Boolean(currentMealId);

  const eligible = store.meals.filter((m) => m.slots.includes(slot));
  const filtered = eligible.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="z-fixed fixed inset-0 flex justify-center items-center p-[20px]
      backdrop-blur-[4px] bg-[rgba(15,30,31,0.55)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="overflow-hidden flex flex-col w-full max-w-[460px] max-h-[82vh]
          rounded-[16px] bg-[var(--color-surface)]"
      >
        {/* Header */}
        <div className="border-b border-[var(--color-border)] px-[24px] pt-[24px] pb-[16px]">
          <div
            className={`flex justify-between items-start
              ${eligible.length > 4 ? "mb-[16px]" : ""}`}
          >
            <div>
              <p
                className="mb-[4px] tracking-[0.08em] text-[11px] uppercase font-semibold
                  text-salmon-600"
              >
                {isReplacing ? "Replace meal" : "Choose a meal"}
              </p>

              <h2
                className="leading-[1.2] text-[18px] md:text-[20px] font-bold
                  text-[var(--color-foreground)]"
              >
                {slotLabel} · {dayName}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="select-none cursor-pointer inline-flex justify-center
                items-center rounded-[6px] p-[4px] bg-transparent
                text-[var(--color-muted)] transition-colors duration-150
                hover:bg-salmon-50 hover:text-salmon-800"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {eligible.length > 4 && (
            <div className="relative">
              <Search
                size={14}
                strokeWidth={2}
                className="pointer-events-none absolute left-[11px] top-1/2
                  -translate-y-1/2 text-[var(--color-muted)]"
              />

              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${slotLabel.toLowerCase()} meal...`}
                className="w-full border-[1.5px] border-[var(--color-border)] rounded-[8px]
                  pl-[34px] pr-[12px] py-[9px] bg-[var(--color-background)] text-[14px]
                  text-[var(--color-foreground)] transition-colors duration-150
                  focus-visible:outline-none focus:ring-2 focus:ring-offset-0
                  focus:ring-salmon-200 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* List */}
        <div className="overflow-y-auto px-[12px] py-[10px]">
          {eligible.length === 0 ? (
            <div className="flex flex-col items-center px-[16px] py-[36px]">
              <p
                className="mb-[12px] leading-[1.6] text-center text-[15px]
                  text-[var(--color-muted)]"
              >
                No meals are marked as suitable for {slotLabel.toLowerCase()}.
              </p>

              <Link
                href="/meals"
                onClick={onClose}
                className="select-none inline-flex items-center gap-[3px] text-[14px]
                  font-semibold text-green-600"
              >
                Go to meal library <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <p
              className="px-[16px] py-[32px] text-center text-[14px]
                text-[var(--color-muted)]"
            >
              No meals match your search.
            </p>
          ) : (
            filtered.map((meal) => (
              <PickerRow
                key={meal.id}
                meal={meal}
                isCurrent={meal.id === currentMealId}
                onSelect={() => {
                  onSelect(meal.id);
                  onClose();
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
