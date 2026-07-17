"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { MealSlot } from "@/lib/types";
import { getWeekDates, getTodayString, formatWeekRange } from "@/lib/utils";
import MealPickerModal from "./MealPickerModal";
import DayColumn from "./DayColumn";
import { SLOTS } from "./slotConfig";

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

  const getMeal = (date: string, slot: MealSlot) => {
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
    <main
      className="flex-1 min-w-0 min-h-dvh px-[20px] md:px-[48px] pt-[28px] pb-[92px]
        lg:py-[40px] bg-green-600"
    >
      <div className="mb-[40px]">
        <p
          className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
            text-salmon-600"
        >
          Planner
        </p>

        <h1
          className="leading-[1.15] text-[28px] md:text-[32px] lg:text-[36px] font-bold
            text-white"
        >
          Plan your week
        </h1>

        <p className="mt-[6px] text-[14px] text-[var(--color-background)]">
          {plannedCount} of {totalSlots} slots filled
        </p>
      </div>

      {/* Week navigation */}
      <div className="flex flex-wrap items-center gap-[10px] mb-[20px]">
        <button
          type="button"
          onClick={goToPrevWeek}
          className="select-none cursor-pointer inline-flex justify-center items-center
            w-[34px] h-[34px] border-[1.5px] border-[var(--color-border)] rounded-[8px]
            bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors
            duration-150 hover:border-green-400"
          title="Previous week"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        <span
          className="min-w-[220px] text-center text-[15px] font-semibold
          text-white"
        >
          {formatWeekRange(weekDates)}
        </span>

        <button
          type="button"
          onClick={goToNextWeek}
          className="select-none cursor-pointer inline-flex justify-center items-center
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
            className="select-none cursor-pointer border-[1.5px] border-salmon-200
              rounded-[8px] px-[14px] py-[7px] bg-salmon-50 text-[13px] font-semibold
              text-salmon-800 transition-colors duration-150 hover:border-salmon-600
              hover:bg-salmon-600 hover:text-[var(--color-foreground)]"
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
