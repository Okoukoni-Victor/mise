"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import {
  Sunrise,
  Sun,
  Moon,
  Plus,
  X,
  ArrowRight,
  Clock,
  Hash,
  TriangleAlert,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Meal, MealSlot } from "@/lib/types";
import { getTodayString, getWeekDates } from "@/lib/utils";
import MealPickerModal from "@/components/planner/MealPickerModal";

// Constants
const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

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
    headerBg: "bg-green-50",
    headerColor: "text-green-600",
    accent: "var(--color-green-600)",
    border: "border-green-200",
  },
  lunch: {
    label: "Lunch",
    Icon: Sun,
    headerBg: "bg-salmon-50",
    headerColor: "text-salmon-800",
    accent: "var(--color-salmon-600)",
    border: "border-salmon-200",
  },
  dinner: {
    label: "Dinner",
    Icon: Moon,
    headerBg: "#EEF2F2",
    headerColor: "#3A5557",
    accent: "#3A5557",
    border: "#C5D4D4",
  },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

// TodayMealCard

function TodayMealCard({
  slot,
  meal,
  missingIngredients,
  onOpen,
  onRemove,
}: {
  slot: MealSlot;
  meal: Meal | null;
  missingIngredients: string[];
  onOpen: () => void;
  onRemove: () => void;
}) {
  const [cardHovered, setCardHovered] = useState(false);
  const cfg = SLOT_CONFIG[slot];

  return (
    <div
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${meal ? cfg.border : cardHovered ? "var(--color-green-200)" : "var(--color-border)"}`,
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: "200px",
        transition: "box-shadow 200ms, border-color 200ms",
        boxShadow: cardHovered ? "0 4px 20px rgba(2,82,89,0.07)" : "none",
      }}
    >
      {/* ── Slot header ── */}
      <div
        style={{
          background: meal
            ? cfg.headerBg
            : cardHovered
              ? "var(--color-green-50)"
              : "var(--color-background)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${meal ? cfg.border : "var(--color-border)"}`,
          transition: "background 200ms",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: meal
              ? cfg.headerColor
              : cardHovered
                ? "var(--color-green-600)"
                : "var(--color-muted)",
            transition: "color 200ms",
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
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: cfg.headerColor,
              opacity: 0.5,
              padding: 0,
              display: "flex",
              alignItems: "center",
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        {meal ? (
          <>
            {/* Filled — click to change */}
            <button
              type="button"
              onClick={onOpen}
              title="Tap to change"
              style={{
                flex: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "18px 16px 14px",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = cfg.headerBg + "60")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
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
                style={{
                  color: cfg.accent,
                }}
              >
                Tap to change
              </span>
            </button>

            {/* Missing ingredients warning */}
            {missingIngredients.length > 0 && (
              <Link
                href="/pantry"
                className="block border-t border-salmon-200 px-[16px] py-[9px]
                  bg-salmon-50"
              >
                <p className="flex items-center gap-[3px] leading-[1.4] text-[12px] font-medium text-salmon-800">
                  <TriangleAlert width={12} strokeWidth={2} /> Missing:{" "}
                  {missingIngredients.slice(0, 2).join(", ")}
                  {missingIngredients.length > 2 &&
                    ` +${missingIngredients.length - 2} more`}
                </p>
              </Link>
            )}
          </>
        ) : (
          /* Empty — click to plan */
          <button
            type="button"
            onClick={onOpen}
            className="select-none cursor-pointer flex-1 inline-flex flex-col
              justify-center items-center gap-[8px] px-[16px] py-[24px] bg-transparent
              transition-colors duration-150"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = cfg.headerBg)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <span
              className="inline-flex justify-center items-center w-[36px] h-[36px]
                border-[1.5px] border-dashed border-[var(--color-border)] rounded-full
                bg-[var(--color-background)]"
            >
              <Plus
                size={16}
                strokeWidth={2}
                className="text-[var(--color-muted)]"
              />
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

// StatCard
function StatCard({
  value,
  label,
  href,
  accent,
}: {
  value: string | number;
  label: string;
  href: string;
  accent: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        flex: 1,
        minWidth: "140px",
        padding: "18px 20px",
        borderRadius: "12px",
        background: "var(--color-surface)",
        border: `1px solid ${hovered ? accent + "50" : "var(--color-border)"}`,
        boxShadow: hovered ? "0 2px 12px rgba(2,82,89,0.06)" : "none",
        transition: "all 150ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-display)",
          fontSize: "30px",
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {value}
      </span>

      <span
        className="inline-flex justify-between items-center text-[13px]
          text-[var(--color-muted)]"
      >
        {label}
        <ArrowRight
          size={14}
          strokeWidth={2}
          style={{
            opacity: hovered ? 1 : 0.35,
            transition: "opacity 150ms",
            color: accent,
            flexShrink: 0,
          }}
        />
      </span>
    </Link>
  );
}

// TodayPage

export default function TodayPage() {
  const { store, dispatch } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<MealSlot | null>(null);

  const today = getTodayString();
  const weekDates = getWeekDates();

  const getMeal = useCallback(
    (slot: MealSlot): Meal | null => {
      const planned = store.plannedMeals.find(
        (pm) => pm.date === today && pm.slot === slot,
      );
      if (!planned) return null;
      return store.meals.find((m) => m.id === planned.mealId) ?? null;
    },
    [store.plannedMeals, store.meals, today],
  );

  const getMissingIngredients = useCallback(
    (meal: Meal): string[] =>
      meal.ingredientIds
        .filter(
          (id) => !store.pantry.find((p) => p.ingredientId === id)?.available,
        )
        .map((id) => store.ingredients.find((i) => i.id === id)?.name ?? "")
        .filter(Boolean),
    [store.pantry, store.ingredients],
  );

  const openPicker = (slot: MealSlot) => {
    setPickerSlot(slot);
    setPickerOpen(true);
  };

  const handleRemove = (slot: MealSlot) =>
    dispatch({ type: "UNPLAN_MEAL", payload: { date: today, slot } });

  const handleSelect = (mealId: string) => {
    if (!pickerSlot) return;
    dispatch({
      type: "PLAN_MEAL",
      payload: { date: today, slot: pickerSlot, mealId },
    });
  };

  // Derived stats

  const plannedToday = SLOTS.filter((s) => getMeal(s) !== null).length;

  const weeklyPlanned = weekDates.reduce(
    (acc, date) =>
      acc +
      SLOTS.filter((slot) =>
        store.plannedMeals.some((pm) => pm.date === date && pm.slot === slot),
      ).length,
    0,
  );

  const pantryAvailable = store.ingredients.filter(
    (ing) => store.pantry.find((p) => p.ingredientId === ing.id)?.available,
  ).length;

  const shoppingCount = useMemo(() => {
    const mealIds = [
      ...new Set(
        store.plannedMeals
          .filter((pm) => weekDates.includes(pm.date))
          .map((pm) => pm.mealId),
      ),
    ];
    const meals = mealIds
      .map((id) => store.meals.find((m) => m.id === id))
      .filter(Boolean);
    const allIds = [...new Set(meals.flatMap((m) => m!.ingredientIds))];
    return allIds.filter(
      (id) => !store.pantry.find((p) => p.ingredientId === id)?.available,
    ).length;
  }, [store.plannedMeals, store.meals, store.pantry]);

  // Display values

  const dateDisplay = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const subtitle =
    plannedToday === 0
      ? "Plan before hunger decides for you."
      : plannedToday === 3
        ? "All three meals planned. You're set."
        : `${plannedToday} of 3 meals planned for today.`;

  const pantryDisplay =
    store.ingredients.length === 0
      ? "—"
      : `${pantryAvailable}/${store.ingredients.length}`;

  const currentMealId = pickerSlot ? getMeal(pickerSlot)?.id : undefined;

  return (
    <div className="px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
      {/* Greeting */}
      <div className="mb-[40px]">
        <p
          className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
            text-salmon-600"
        >
          Today
        </p>

        <h1
          className="mb-[8px] leading-[1.1] text-[44px] font-bold
          text-[var(--color-foreground)]"
        >
          {getGreeting()}
        </h1>

        <p className="mb-[4px] text-[16px] text-[var(--color-muted)]">
          {dateDisplay}
        </p>

        <p
          className={`text-[14px] ${plannedToday === 3 ? "font-medium" : "font-normal"}
          ${plannedToday === 3 ? "text-green-600" : "text-[var(--color-muted)]"}`}
        >
          {subtitle}
        </p>
      </div>

      {/* Meal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] mb-[40px]">
        {SLOTS.map((slot) => {
          const meal = getMeal(slot);
          return (
            <TodayMealCard
              key={slot}
              slot={slot}
              meal={meal}
              missingIngredients={meal ? getMissingIngredients(meal) : []}
              onOpen={() => openPicker(slot)}
              onRemove={() => handleRemove(slot)}
            />
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-[12px]">
        <StatCard
          value={`${weeklyPlanned}/21`}
          label="meals planned this week"
          href="/planner"
          accent="var(--green-600)"
        />
        <StatCard
          value={pantryDisplay}
          label="ingredients stocked"
          href="/pantry"
          accent="var(--salmon-600)"
        />
        <StatCard
          value={shoppingCount}
          label={shoppingCount === 1 ? "item to buy" : "items to buy"}
          href="/shopping"
          accent={shoppingCount === 0 ? "var(--green-600)" : "#3A5557"}
        />
      </div>

      {/* Picker modal */}
      <MealPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        date={today}
        slot={pickerSlot}
        currentMealId={currentMealId}
        onSelect={handleSelect}
      />
    </div>
  );
}
