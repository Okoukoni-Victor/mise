"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Meal, MealSlot, Ingredient } from "@/lib/types";
import { generateId } from "@/lib/utils";

// Shape used to pre-fill the form when creating a meal from an AI suggestion.
export interface MealPrefill {
  name: string;
  slots: MealSlot[];
  prepTime: number;
  ingredients: string[];
}

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal?: Meal;
  // When creating (no `meal`), optionally seed the form with these values.
  prefill?: MealPrefill;
}

const SLOTS: { value: MealSlot; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

export default function MealModal({
  isOpen,
  onClose,
  meal,
  prefill,
}: MealModalProps) {
  const { store, dispatch } = useStore();

  const [name, setName] = useState("");
  const [slots, setSlots] = useState<MealSlot[]>([]);
  const [prepTime, setPrepTime] = useState("");
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const ingredientRef = useRef<HTMLInputElement>(null);

  // Populate form when editing, when seeded from a suggestion, or reset when adding.
  useEffect(() => {
    if (!isOpen) return;
    if (meal) {
      setName(meal.name);
      setSlots([...meal.slots]);
      setPrepTime(String(meal.prepTime));
      setIngredientNames(
        meal.ingredientIds
          .map((id) => store.ingredients.find((i) => i.id === id)?.name ?? "")
          .filter(Boolean),
      );
    } else if (prefill) {
      setName(prefill.name ?? "");
      setSlots([...(prefill.slots ?? [])]);
      setPrepTime(prefill.prepTime ? String(prefill.prepTime) : "");
      setIngredientNames([...(prefill.ingredients ?? [])]);
    } else {
      setName("");
      setSlots([]);
      setPrepTime("");
      setIngredientNames([]);
    }
    setIngredientInput("");
    setErrors({});
  }, [isOpen, meal, prefill]);

  // Focus name on open
  useEffect(() => {
    if (isOpen) setTimeout(() => nameRef.current?.focus(), 60);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSlot = (slot: MealSlot) => {
    setSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
    );
    setErrors((prev) => ({ ...prev, slots: "" }));
  };

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    if (
      ingredientNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())
    ) {
      setIngredientInput("");
      return;
    }
    setIngredientNames((prev) => [...prev, trimmed]);
    setIngredientInput("");
    ingredientRef.current?.focus();
  };

  const removeIngredient = (name: string) => {
    setIngredientNames((prev) => prev.filter((n) => n !== name));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Meal name is required";
    if (slots.length === 0) newErrors.slots = "Select at least one slot";
    if (!prepTime || Number(prepTime) <= 0)
      newErrors.prep = "Enter a valid prep time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    // Resolve ingredient names → IDs, creating new ingredients as needed
    const ingredientIds: string[] = [];
    for (const ingName of ingredientNames) {
      const existing = store.ingredients.find(
        (i) => i.name.toLowerCase() === ingName.toLowerCase(),
      );
      if (existing) {
        ingredientIds.push(existing.id);
      } else {
        const newIng: Ingredient = { id: generateId(), name: ingName };
        dispatch({ type: "ADD_INGREDIENT", payload: newIng });
        ingredientIds.push(newIng.id);
      }
    }

    if (meal) {
      dispatch({
        type: "UPDATE_MEAL",
        payload: {
          ...meal,
          name: name.trim(),
          slots,
          prepTime: Number(prepTime),
          ingredientIds,
        },
      });
    } else {
      dispatch({
        type: "ADD_MEAL",
        payload: {
          name: name.trim(),
          slots,
          prepTime: Number(prepTime),
          ingredientIds,
        },
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  const isEditing = Boolean(meal);
  const isFromSuggestion = !meal && Boolean(prefill);

  return (
    <div
      className="z-fixed fixed inset-0 flex justify-center items-center p-[20px]
        backdrop-blur-[4px] bg-[rgba(15,30,31,0.55)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="overflow-y-auto w-full max-w-[520px] max-h-[92vh] rounded-[16px]
          bg-[var(--color-surface)]"
      >
        {/* Header */}
        <div className="flex justify-between items-center gap-[24px] px-[28px] pt-[26px]">
          <div className="flex-1 min-w-0">
            <p
              className="mb-[4px] tracking-[0.08em] text-[11px] uppercase font-semibold
                text-salmon-600"
            >
              {isEditing
                ? "Edit meal"
                : isFromSuggestion
                  ? "From your suggestion"
                  : "New meal"}
            </p>

            <h2
              className="leading-none truncate text-[24px] font-bold
                text-[var(--color-foreground)]"
            >
              {isEditing ? meal!.name : isFromSuggestion ? name : "Add a meal"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="select-none cursor-pointer shrink-0 inline-flex justify-center
              items-center rounded-[8px] p-[6px] bg-transparent text-[var(--color-muted)]
              transition-colors duration-150 hover:bg-salmon-50 hover:text-salmon-800"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-[22px] px-[28px] pt-[24px] pb-[30px]"
        >
          {/* Meal name */}
          <div>
            <label
              className="block mb-[8px] tracking-[0.06em] text-[12px] uppercase
                font-semibold text-[var(--color-muted)]"
            >
              Meal name
            </label>

            <input
              ref={nameRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="e.g. Jollof Rice, Ofe Akwu, Eba and Egusi..."
              className={`w-full border-[1.5px] border-[var(--color-border)] rounded-[8px]
                px-[13px] py-[10px] bg-[var(--color-surface)] text-[15px]
                text-[var(--color-foreground)] transition-colors duration-150
                focus-visible:outline-none focus:ring-2 focus:ring-salmon-200
                focus:ring-offset-0 focus:border-transparent
                ${
                  errors.name
                    ? "border-salmon-600"
                    : "border-[var(--color-border)]"
                }
                `}
            />

            {errors.name && (
              <p className="mt-[6px] text-[12px] text-salmon-800">
                {errors.name}
              </p>
            )}
          </div>

          {/* Slot toggles */}
          <div>
            <label
              className="block mb-[8px] tracking-[0.06em] text-[12px] uppercase
                font-semibold text-[var(--color-muted)]"
            >
              Suitable for
            </label>

            <div className="flex gap-[8px]">
              {SLOTS.map(({ value, label }) => {
                const active = slots.includes(value);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSlot(value)}
                    className={`select-none cursor-pointer flex-1 border-[1.5px]
                      rounded-[8px] py-[9px] text-[13px] font-semibold transition-all
                      duration-150 ease-in
                      ${
                        active
                          ? "border-green-600 bg-green-600 text-white"
                          : `border-[var(--color-border)] bg-[var(--color-background)]
                             text-[var(--color-muted)] transition-colors
                             duration-150 hover:bg-green-50 hover:text-green-600`
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {errors.slots && (
              <p className="mt-[6px] text-[12px] text-salmon-800">
                {errors.slots}
              </p>
            )}
          </div>

          {/* Prep time */}
          <div>
            <label
              className="block mb-[8px] tracking-[0.06em] text-[12px] uppercase font-semibold
                text-[var(--color-muted)]"
            >
              Prep time
            </label>

            <div className="flex items-center gap-[10px]">
              <input
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => {
                  setPrepTime(e.target.value);
                  setErrors((p) => ({ ...p, prep: "" }));
                }}
                placeholder="30"
                className={` select-none w-[90px] border-[1.5px] rounded-[8px]
                px-[13px] py-[10px] bg-[var(--color-surface)] text-[15px]
                text-[var(--color-foreground)] transition-colors duration-150
                ${
                  errors.prep
                    ? "border-salmon-600"
                    : "border-[var(--color-border)]"
                }
                `}
              />

              <span className="text-[14px] text-[var(--color-muted)]">
                minute{Number(prepTime) === 1 ? "" : "s"}
              </span>
            </div>

            {errors.prep && (
              <p className="mt-[6px] text-[12px] text-salmon-800">
                {errors.prep}
              </p>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label
              className="block mb-[8px] tracking-[0.06em] text-[12px] uppercase font-semibold
                text-[var(--color-muted)]"
            >
              Ingredients
              <span
                className="opacity-70 ml-[6px] tracking-normal normal-case
                  font-normal"
              >
                — optional
              </span>
            </label>

            {/* Input row */}
            <div
              className={`flex gap-[8px] ${ingredientNames.length ? "mb-[12px]" : ""}`}
            >
              <input
                ref={ingredientRef}
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
                placeholder="Type an ingredient, press Enter to add"
                className="select-none flex-1 w-[90px] border-[1.5px]
                  border-[var(--color-border)] rounded-[8px] px-[13px] py-[10px]
                  bg-[var(--color-surface)] text-[15px] text-[var(--color-foreground)]"
              />

              <button
                type="button"
                onClick={addIngredient}
                disabled={!ingredientInput.trim()}
                className={`select-none cursor-pointer inline-flex items-center gap-[5px]
                  border-[1.5px] border-green-200
                  rounded-[8px] px-[14px] bg-green-50 whitespace-nowrap text-[13px]
                  font-semibold text-green-600 transition-opacity duration-150
                  ${ingredientInput.trim() ? "opacity-100" : "opacity-50"}`}
              >
                <Plus size={14} strokeWidth={2.5} />
                Add
              </button>
            </div>

            {/* Ingredient chips */}
            {ingredientNames.length > 0 && (
              <div className="flex flex-wrap gap-[7px]">
                {ingredientNames.map((ing) => (
                  <span
                    key={ing}
                    className="select-none inline-flex items-center gap-[6px]
                      max-w-[180px] border border-salmon-200 rounded-[20px] pl-[12px]
                      pr-[10px] py-[5px] bg-salmon-50 text-[13px] font-semibold
                      text-salmon-800"
                  >
                    <span className="min-w-0 truncate">{ing}</span>

                    <button
                      type="button"
                      onClick={() => removeIngredient(ing)}
                      aria-label={`Remove ${ing}`}
                      className="select-none cursor-pointer shrink-0 inline-flex
                        justify-center items-center bg-transparent leading-none
                        text-salmon-800"
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-[10px] pt-[4px]">
            <button
              type="button"
              onClick={onClose}
              className="select-none cursor-pointer flex-1 border-[1.5px]
                border-[var(--color-border)] rounded-[10px] p-[12px]
                bg-[var(--color-background)] text-[14px] font-medium text-[var(--color-muted)]
                transition-colors duration-150 hover:border-green-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="select-none cursor-pointer flex-1 rounded-[10px] p-[12px]
                bg-green-600 text-[14px] font-semibold text-white
                transition-colors duration-150 hover:bg-green-800"
            >
              {isEditing ? "Save changes" : "Add meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
