"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sunrise,
  Sun,
  Moon,
  Plus,
  X,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Meal, MealSlot } from "@/lib/types";
import { getWeekDates, getTodayString, formatWeekRange } from "@/lib/utils";
import MealPickerModal from "./MealPickerModal";

// Slot config

const SLOT_CONFIG: Record<
  MealSlot,
  {
    label: string;
    Icon: React.ElementType;
    bg: string;
    color: string;
    border: string;
    emptyBorder: string;
  }
> = {
  breakfast: {
    label: "Breakfast",
    Icon: Sunrise,
    bg: "var(--color-green-50)",
    color: "var(--color-green-600)",
    border: "var(--color-green-200)",
    emptyBorder: "var(--color-green-200)",
  },
  lunch: {
    label: "Lunch",
    Icon: Sun,
    bg: "var(--color-salmon-50)",
    color: "var(--color-salmon-800)",
    border: "var(--color-salmon-200)",
    emptyBorder: "var(--color-salmon-200)",
  },
  dinner: {
    label: "Dinner",
    Icon: Moon,
    bg: "#EEF2F2",
    color: "#3A5557",
    border: "#C5D4D4",
    emptyBorder: "#C5D4D4",
  },
};

const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

// SlotCell

function SlotCell({
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
  const [hovered, setHovered] = useState(false);
  const cfg = SLOT_CONFIG[slot];

  if (meal) {
    return (
      <div
        className="overflow-hidden flex flex-col min-h-[88px] mb-[6px] border rounded-[8px]"
        style={{
          background: cfg.bg,
          borderColor: cfg.border,
        }}
      >
        {/* Slot label row + remove */}
        <div
          className="flex justify-between items-center border-b px-[8px] pt-[7px] pb-[6px]"
          style={{
            borderColor: cfg.border,
          }}
        >
          <span
            className="flex items-center gap-[4px] tracking-[0.06em] text-[10px] uppercase font-bold"
            style={{
              color: cfg.color,
            }}
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
            className="select-none cursor-pointer opacity-55 flex items-center
              bg-transparent transition-opacity duration-150 hover:opacity-100"
            style={{
              color: cfg.color,
            }}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Meal info — click to replace */}
        <button
          type="button"
          onClick={onAdd}
          title="Click to replace"
          className="select-none cursor-pointer flex-1 flex flex-col justify-center
            gap-[3px] p-[8px] bg-transparent hover:bg-black/4"
        >
          <span
            className="overflow-hidden block leading-[1.3] whitespace-nowrap text-ellipsis
            text-[13px] font-semibold"
            style={{
              color: cfg.color,
            }}
          >
            {meal.name}
          </span>

          <span
            className="opacity-65 text-[11px]"
            style={{
              color: cfg.color,
            }}
          >
            {meal.prepTime} min
          </span>
        </button>
      </div>
    );
  }

  // Empty slot
  return (
    <button
      type="button"
      onClick={onAdd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group select-none cursor-pointer flex flex-col justify-center items-center
        gap-[5px] w-full min-h-[88px] mb-[6px] border-[1.5px] border-dashed
        rounded-[8px] p-[8px] transition-all duration-150"
      style={{
        background: hovered ? cfg.bg : "transparent",
        borderColor: hovered ? cfg.emptyBorder : "var(--color-border)",
      }}
    >
      <span
        className="flex items-center gap-[4px] tracking-[0.06em] text-[10px]
        uppercase font-bold transition-colors duration-150"
        style={{
          color: hovered ? cfg.color : "var(--color-muted)",
        }}
      >
        <cfg.Icon size={10} strokeWidth={2.2} />

        {cfg.label}
      </span>

      <Plus
        size={14}
        strokeWidth={2}
        className="transition-colors duration-150"
        style={{
          color: hovered ? cfg.color : "var(--color-border)",
        }}
      />
    </button>
  );
}

function DayColumn({
  date,
  isToday,
  getMeal,
  onSlotClick,
  onRemoveMeal,
}: {
  date: string;
  isToday: boolean;
  getMeal: (date: string, slot: MealSlot) => Meal | null;
  onSlotClick: (date: string, slot: MealSlot) => void;
  onRemoveMeal: (date: string, slot: MealSlot) => void;
}) {
  const d = new Date(date + "T00:00:00");
  const dayName = d.toLocaleDateString("en-GB", { weekday: "short" });
  const dayNum = d.getDate();

  return (
    <div>
      {/* Day header */}
      <div
        className={`mb-[8px] border-b-2 pb-[10px] text-center
        ${isToday ? "border-green-600" : "border-[var(--color-border)]"}`}
      >
        <span
          className={`block mb-[6px] tracking-[0.08em] text-[10px] uppercase font-bold
            ${isToday ? "text-green-600" : "text-[var(--color-muted)]"}`}
        >
          {dayName}
        </span>

        <span
          className={`inline-flex justify-center items-center w-[32px] h-[32px] rounded-full
          text-[15px] ${isToday ? "bg-green-600" : "bg-transparent"}
          ${isToday ? "font-bold" : "font-semibold"}
          ${isToday ? "text-white" : "text-[var(--color-foreground)]"}`}
        >
          {dayNum}
        </span>
      </div>

      {/* Slot cells */}
      {SLOTS.map((slot) => (
        <SlotCell
          key={slot}
          slot={slot}
          meal={getMeal(date, slot)}
          onAdd={() => onSlotClick(date, slot)}
          onRemove={() => onRemoveMeal(date, slot)}
        />
      ))}
    </div>
  );
}

export default function PlannerPage() {
  const { store, dispatch } = useStore();

  const [weekStart, setWeekStart] = useState(() => getWeekDates()[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    date: string;
    slot: MealSlot;
  } | null>(null);

  const weekDates = getWeekDates(weekStart);
  const today = getTodayString();
  const currentWeekStart = getWeekDates()[0];
  const isCurrentWeek = weekStart === currentWeekStart;

  const goToPrevWeek = () => {
    const d = new Date(weekStart + "T00:00:00");
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().split("T")[0]);
  };

  const goToNextWeek = () => {
    const d = new Date(weekStart + "T00:00:00");
    d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().split("T")[0]);
  };

  const goToToday = () => setWeekStart(currentWeekStart);

  const getMeal = (date: string, slot: MealSlot): Meal | null => {
    const planned = store.plannedMeals.find(
      (pm) => pm.date === date && pm.slot === slot,
    );
    if (!planned) return null;
    return store.meals.find((m) => m.id === planned.mealId) ?? null;
  };

  const handleSlotClick = (date: string, slot: MealSlot) => {
    setPickerTarget({ date, slot });
    setPickerOpen(true);
  };

  const handleRemoveMeal = (date: string, slot: MealSlot) => {
    dispatch({ type: "UNPLAN_MEAL", payload: { date, slot } });
  };

  const handleMealSelect = (mealId: string) => {
    if (!pickerTarget) return;
    dispatch({
      type: "PLAN_MEAL",
      payload: { date: pickerTarget.date, slot: pickerTarget.slot, mealId },
    });
  };

  const currentMealId = pickerTarget
    ? getMeal(pickerTarget.date, pickerTarget.slot)?.id
    : undefined;

  // Count planned meals this week
  const plannedCount = weekDates.reduce(
    (acc, date) =>
      acc + SLOTS.filter((slot) => getMeal(date, slot) !== null).length,
    0,
  );
  const totalSlots = weekDates.length * SLOTS.length;

  return (
    <main className="flex-1 min-w-0 min-h-dvh px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
      <div className="mb-[40px]">
        <p
          className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
            text-salmon-600"
        >
          Planner
        </p>

        <h1
          className="leading-[1.15] text-[28px] md:text-[32px] lg:text-[36px] font-bold
            text-[var(--color-foreground)]"
        >
          Plan your week
        </h1>

        <p className="mt-[6px] text-[14px] text-[var(--color-muted)]">
          {plannedCount} of {totalSlots} slots filled
        </p>
      </div>

      {/* Week navigation */}
      <div className="flex flex-wrap items-center gap-[10px] mb-[20px]">
        <button
          type="button"
          onClick={goToPrevWeek}
          className="select-none cursor-pointer flex justify-center items-center
            w-[34px] h-[34px] border-[1.5px] border-[var(--color-border)] rounded-[8px]
            bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors
            duration-150 hover:border-green-400"
          title="Previous week"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        <span
          className="min-w-[220px] text-center text-[15px] font-semibold
          text-[var(--color-foreground)]"
        >
          {formatWeekRange(weekDates)}
        </span>

        <button
          type="button"
          onClick={goToNextWeek}
          className="select-none cursor-pointer flex justify-center items-center
            w-[34px] h-[34px] border-[1.5px] border-[var(--color-border)] rounded-[8px]
            bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors
            duration-150 hover:border-green-400"
          title="Next week"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>

        {!isCurrentWeek && (
          <button
            type="button"
            onClick={goToToday}
            className="select-none cursor-pointer border-[1.5px] border-green-200
              rounded-[8px] px-[14px] py-[7px] bg-green-50 text-[13px] font-semibold
              text-green-600 transition-all duration-150 hover:bg-green-600
              hover:text-white"
          >
            This week
          </button>
        )}
      </div>

      {/* Week grid */}
      <div
        className="[-webkit-overflow-scrolling:touch] overflow-x-auto grid
          grid-cols-[repeat(7,minmax(130px,1fr))] gap-[10px] pb-[8px]"
      >
        {weekDates.map((date) => (
          <DayColumn
            key={date}
            date={date}
            isToday={date === today}
            getMeal={getMeal}
            onSlotClick={handleSlotClick}
            onRemoveMeal={handleRemoveMeal}
          />
        ))}
      </div>

      {/* Meal picker modal */}
      <MealPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        date={pickerTarget?.date ?? null}
        slot={pickerTarget?.slot ?? null}
        currentMealId={currentMealId}
        onSelect={handleMealSelect}
      />
    </main>
  );
}
