import { Meal, MealSlot } from "@/lib/types";
import SlotCell from "./SlotCell";
import { SLOTS } from "./slotConfig";

export default function DayColumn({
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
          ${isToday ? "border-salmon-600" : "border-[var(--color-border)]"}
        `}
      >
        <span
          className={`block mb-[6px] tracking-[0.08em] text-[10px] uppercase font-bold
            ${isToday ? "text-salmon-600" : "text-[var(--color-background)]"}`}
        >
          {dayName}
        </span>

        <span
          className={`inline-flex justify-center items-center w-[32px] h-[32px]
            rounded-full text-[15px]
            ${
              isToday
                ? `bg-salmon-600 font-bold text-[var(--color-foreground)]`
                : `bg-transparent font-semibold text-white`
            }
         `}
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
