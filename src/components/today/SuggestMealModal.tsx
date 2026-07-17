"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Lightbulb,
  Clock,
  Hash,
  Check,
  Plus,
  RefreshCw,
  TriangleAlert,
  Loader2,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Meal, MealSlot } from "@/lib/types";
import { getTodayString, getWeekDates } from "@/lib/utils";
import type { MealPrefill } from "@/components/meals/MealModal";

interface SuggestMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSlot: MealSlot;
  // Hand a brand-new (AI-invented) meal up to the parent so it can open the
  // existing MealModal pre-filled for review before it enters the library.
  onAddNew: (prefill: MealPrefill) => void;
}

// Mirrors the API's SuggestionSchema.
interface Suggestion {
  source: "library" | "new";
  mealName: string;
  reason: string;
  slots: MealSlot[];
  prepTime: number;
  ingredients: string[];
}

type Status = "idle" | "loading" | "done" | "error";

const SLOTS: { value: MealSlot; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

export default function SuggestMealModal({
  isOpen,
  onClose,
  defaultSlot,
  onAddNew,
}: SuggestMealModalProps) {
  const { store, dispatch } = useStore();

  const [slot, setSlot] = useState<MealSlot>(defaultSlot);
  const [status, setStatus] = useState<Status>("idle");
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState("");

  const today = getTodayString();
  const weekDates = getWeekDates();

  // Reset to a clean slate whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setSlot(defaultSlot);
    setStatus("idle");
    setSuggestion(null);
    setError("");
  }, [isOpen, defaultSlot]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const nameOf = useCallback(
    (id: string) => store.ingredients.find((i) => i.id === id)?.name ?? "",
    [store.ingredients],
  );

  // If the model picked a library meal, find the real record so we can plan
  // it with its actual id. Match by name, case-insensitively.
  const matchedMeal: Meal | null =
    suggestion && suggestion.source === "library"
      ? (store.meals.find(
          (m) =>
            m.name.trim().toLowerCase() ===
            suggestion.mealName.trim().toLowerCase(),
        ) ?? null)
      : null;

  // Treat "library" with no match as if it were a new idea (defensive).
  const isLibraryPick = Boolean(matchedMeal);

  const requestSuggestion = async () => {
    setStatus("loading");
    setError("");
    setSuggestion(null);

    // Assemble the context from the user's own data.
    const library = store.meals.map((m) => ({
      name: m.name,
      slots: m.slots,
      prepTime: m.prepTime,
      ingredients: m.ingredientIds.map(nameOf).filter(Boolean),
    }));

    const pantry = store.ingredients
      .filter(
        (i) => store.pantry.find((p) => p.ingredientId === i.id)?.available,
      )
      .map((i) => i.name);

    const plannedThisWeek = [
      ...new Set(
        store.plannedMeals
          .filter((pm) => weekDates.includes(pm.date))
          .map((pm) => store.meals.find((m) => m.id === pm.mealId)?.name)
          .filter(Boolean) as string[],
      ),
    ];

    const plannedTodayOther = store.plannedMeals
      .filter((pm) => pm.date === today && pm.slot !== slot)
      .map((pm) => store.meals.find((m) => m.id === pm.mealId)?.name)
      .filter(Boolean) as string[];

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot,
          library,
          pantry,
          plannedThisWeek,
          plannedTodayOther,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setSuggestion(data as Suggestion);
      setStatus("done");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Network error. Check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const planLibraryMeal = () => {
    if (!matchedMeal) return;
    dispatch({
      type: "PLAN_MEAL",
      payload: { date: today, slot, mealId: matchedMeal.id },
    });
    onClose();
  };

  const addNewToLibrary = () => {
    if (!suggestion) return;
    onAddNew({
      name: suggestion.mealName,
      // Make sure the current slot is included so it's plannable here.
      slots: [...new Set<MealSlot>([...suggestion.slots, slot])],
      prepTime: suggestion.prepTime,
      ingredients: suggestion.ingredients,
    });
  };

  if (!isOpen) return null;

  const slotLabel = SLOTS.find((s) => s.value === slot)?.label ?? "";

  // For a library pick: which of its ingredients aren't stocked?
  const missingForLibrary = matchedMeal
    ? matchedMeal.ingredientIds
        .filter(
          (id) => !store.pantry.find((p) => p.ingredientId === id)?.available,
        )
        .map(nameOf)
        .filter(Boolean)
    : [];

  // For a new idea: mark which suggested ingredients the user already has.
  const pantryNames = new Set(
    store.ingredients
      .filter(
        (i) => store.pantry.find((p) => p.ingredientId === i.id)?.available,
      )
      .map((i) => i.name.toLowerCase()),
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
        className="overflow-hidden flex flex-col w-full max-w-[480px] max-h-[88vh]
          shadow-[0_24px_80px_rgba(2,82,89,0.18)] rounded-[16px]
          bg-[var(--color-surface)]"
      >
        {/* Header */}
        <div className="border-b border-[var(--color-border)] px-[24px] pt-[24px] pb-[18px]">
          <div className="flex justify-between items-start mb-[16px]">
            <div>
              <p
                className="inline-flex items-center gap-[5px] mb-[4px] tracking-[0.08em]
                  text-[11px] uppercase font-semibold text-salmon-600"
              >
                <Lightbulb size={12} strokeWidth={2.2} />
                Suggest a meal
              </p>

              <h2 className="leading-[1.2] text-[22px] font-bold text-[var(--color-foreground)]">
                Let Mise decide
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="select-none cursor-pointer flex justify-center items-center
                rounded-[6px] p-[4px] bg-transparent text-[var(--color-muted)]
                transition-colors duration-150 hover:bg-green-50"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Slot chooser */}
          <div className="flex gap-[8px]">
            {SLOTS.map(({ value, label }) => {
              const active = slot === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setSlot(value);
                    // Changing slot invalidates the previous suggestion.
                    if (status !== "loading") {
                      setStatus("idle");
                      setSuggestion(null);
                      setError("");
                    }
                  }}
                  disabled={status === "loading"}
                  className={`select-none cursor-pointer flex-1 border-[1.5px] rounded-[8px]
                    py-[9px] text-[13px] font-semibold transition-colors duration-150
                    disabled:opacity-60 disabled:cursor-default
                    ${
                      active
                        ? "border-green-600 bg-green-600 text-white"
                        : `border-[var(--color-border)] bg-[var(--color-background)]
                           text-[var(--color-muted)] hover:bg-green-50 hover:text-green-600`
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-[24px] py-[22px]">
          {/* Idle — prompt to generate */}
          {status === "idle" && (
            <div className="flex flex-col items-center px-[8px] py-[20px] text-center">
              <span
                className="inline-flex justify-center items-center w-[52px] h-[52px]
                  mb-[16px] rounded-full bg-salmon-50 text-salmon-600"
              >
                <Lightbulb size={24} strokeWidth={2} />
              </span>

              <p className="max-w-[320px] mb-[20px] leading-[1.6] text-[15px] text-[var(--color-muted)]">
                Mise will look at your meals, your pantry, and the rest of your
                week, then pick the best {slotLabel.toLowerCase()} for you — or
                invent one if nothing fits.
              </p>

              <button
                type="button"
                onClick={requestSuggestion}
                className="select-none cursor-pointer inline-flex items-center gap-[7px]
                  rounded-[10px] px-[24px] py-[12px] bg-green-600 text-[14px]
                  font-semibold text-white transition-colors duration-150
                  hover:bg-green-800"
              >
                <Lightbulb size={15} strokeWidth={2.2} />
                Suggest {slotLabel.toLowerCase()}
              </button>
            </div>
          )}

          {/* Loading */}
          {status === "loading" && (
            <div className="flex flex-col items-center px-[8px] py-[40px] text-center">
              <Loader2
                size={28}
                strokeWidth={2}
                className="mb-[16px] animate-spin text-green-600"
              />
              <p className="text-[14px] text-[var(--color-muted)]">
                Thinking it through…
              </p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="flex flex-col items-center px-[8px] py-[28px] text-center">
              <span
                className="inline-flex justify-center items-center w-[48px] h-[48px]
                  mb-[14px] rounded-full bg-salmon-50 text-salmon-800"
              >
                <TriangleAlert size={22} strokeWidth={2} />
              </span>

              <p className="max-w-[320px] mb-[20px] leading-[1.6] text-[14px] text-[var(--color-foreground)]">
                {error}
              </p>

              <button
                type="button"
                onClick={requestSuggestion}
                className="select-none cursor-pointer inline-flex items-center gap-[6px]
                  rounded-[10px] px-[20px] py-[10px] bg-green-600 text-[13px]
                  font-semibold text-white transition-colors duration-150
                  hover:bg-green-800"
              >
                <RefreshCw size={14} strokeWidth={2.2} />
                Try again
              </button>
            </div>
          )}

          {/* Done — the suggestion card */}
          {status === "done" && suggestion && (
            <div className="flex flex-col">
              <span
                className={`self-start inline-flex items-center gap-[5px] mb-[12px]
                  rounded-[20px] px-[10px] py-[4px] tracking-[0.06em] text-[10px]
                  uppercase font-semibold
                  ${
                    isLibraryPick
                      ? "bg-green-100 text-green-900"
                      : "bg-salmon-100 text-salmon-900"
                  }`}
              >
                {isLibraryPick ? (
                  <>
                    <Check size={11} strokeWidth={2.5} />
                    From your library
                  </>
                ) : (
                  <>
                    <Lightbulb size={11} strokeWidth={2.5} />
                    New idea
                  </>
                )}
              </span>

              <h3 className="mb-[10px] leading-[1.2] text-[24px] font-bold text-[var(--color-foreground)]">
                {isLibraryPick ? matchedMeal!.name : suggestion.mealName}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-[14px] mb-[16px]">
                <span className="inline-flex items-center gap-[5px] text-[13px] text-[var(--color-muted)]">
                  <Clock size={13} strokeWidth={2} />
                  {isLibraryPick
                    ? matchedMeal!.prepTime
                    : suggestion.prepTime}{" "}
                  min
                </span>

                <span className="inline-flex items-center gap-[5px] text-[13px] text-[var(--color-muted)]">
                  <Hash size={13} strokeWidth={2} />
                  {isLibraryPick
                    ? matchedMeal!.ingredientIds.length
                    : suggestion.ingredients.length}{" "}
                  ingredient
                  {(isLibraryPick
                    ? matchedMeal!.ingredientIds.length
                    : suggestion.ingredients.length) !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              {/* Reason */}
              <p
                className="mb-[18px] border-l-[3px] border-salmon-200 pl-[14px]
                  leading-[1.6] text-[14px] italic text-[var(--color-foreground)]"
              >
                {suggestion.reason}
              </p>

              {/* New-idea ingredient breakdown */}
              {!isLibraryPick && suggestion.ingredients.length > 0 && (
                <div className="mb-[18px]">
                  <p
                    className="mb-[8px] tracking-[0.06em] text-[11px] uppercase
                      font-semibold text-[var(--color-muted)]"
                  >
                    You&apos;ll need
                  </p>

                  <div className="flex flex-wrap gap-[7px]">
                    {suggestion.ingredients.map((ing) => {
                      const have = pantryNames.has(ing.toLowerCase());
                      return (
                        <span
                          key={ing}
                          className={`inline-flex items-center gap-[5px] rounded-[20px]
                            px-[11px] py-[5px] text-[13px] font-medium
                            ${
                              have
                                ? "bg-green-50 text-green-600"
                                : "bg-[var(--color-background)] text-[var(--color-muted)]"
                            }`}
                        >
                          {have && <Check size={12} strokeWidth={2.5} />}
                          {ing}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Library-pick missing note */}
              {isLibraryPick && missingForLibrary.length > 0 && (
                <p className="inline-flex items-start gap-[5px] mb-[18px] text-[13px] text-salmon-800">
                  <TriangleAlert
                    size={13}
                    strokeWidth={2.5}
                    className="flex-shrink-0 relative top-[2px]"
                  />
                  <span>
                    You&apos;re missing{" "}
                    {missingForLibrary.slice(0, 3).join(", ")}
                    {missingForLibrary.length > 3 &&
                      ` +${missingForLibrary.length - 3} more`}
                    .
                  </span>
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-[10px] pt-[2px]">
                <button
                  type="button"
                  onClick={requestSuggestion}
                  className="select-none cursor-pointer inline-flex justify-center
                    items-center gap-[6px] border-[1.5px] border-[var(--color-border)]
                    rounded-[10px] px-[16px] py-[12px] bg-[var(--color-background)]
                    text-[14px] font-medium text-[var(--color-muted)]
                    transition-colors duration-150 hover:border-green-200"
                >
                  <RefreshCw size={14} strokeWidth={2.2} />
                  Again
                </button>

                {isLibraryPick ? (
                  <button
                    type="button"
                    onClick={planLibraryMeal}
                    className="select-none cursor-pointer flex-1 inline-flex justify-center
                      items-center gap-[6px] rounded-[10px] px-[16px] py-[12px]
                      bg-green-600 text-[14px] font-semibold text-white
                      transition-colors duration-150 hover:bg-green-800"
                  >
                    <Check size={15} strokeWidth={2.4} />
                    Plan it for {slotLabel.toLowerCase()}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={addNewToLibrary}
                    className="select-none cursor-pointer flex-1 inline-flex justify-center
                      items-center gap-[6px] rounded-[10px] px-[16px] py-[12px]
                      bg-green-600 text-[14px] font-semibold text-white
                      transition-colors duration-150 hover:bg-green-800"
                  >
                    <Plus size={15} strokeWidth={2.4} />
                    Add to my library
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
