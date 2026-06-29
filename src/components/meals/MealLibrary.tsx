"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Meal, MealSlot } from "@/lib/types";
import EmptyMeals from "./EmptyMeals";
import MealCard from "./MealCard";
import MealModal from "./MealModal";

type SlotFilter = MealSlot | "all";

const SLOT_FILTERS: { value: SlotFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

export default function MealLibrary() {
  const { store } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [slotFilter, setSlotFilter] = useState<SlotFilter>("all");

  const openAddModal = () => {
    setEditingMeal(undefined);
    setModalOpen(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMeal(undefined);
  };

  const filteredMeals = store.meals.filter((meal) => {
    const matchesSearch = meal.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSlot =
      slotFilter === "all" || meal.slots.includes(slotFilter as MealSlot);
    return matchesSearch && matchesSlot;
  });

  const hasMeals = store.meals.length > 0;
  const noSearchResult = hasMeals && filteredMeals.length === 0;

  return (
    <main className="flex-1 min-w-0 min-h-dvh px-[20px] md:px-[48px] py-[28px] md:py-[40px]">
      <div className="mb-[28px]">
        <p
          className="mb-[6px] tracking-[0.08em] text-[12px] uppercase font-semibold
              text-salmon-600"
        >
          Library
        </p>

        <h1
          className="leading-[1.15] text-[28px] md:text-[32px] lg:text-[36px] font-bold
            text-[var(--color-foreground)]"
        >
          Your meals
        </h1>

        {hasMeals && (
          <>
            <p className="mt-[6px] text-[14px] text-[var(--color-muted)]">
              {store.meals.length} meal{store.meals.length !== 1 ? "s" : ""}{" "}
              saved
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="select-none cursor-pointer inline-flex items-center
                gap-[6px] mt-[16px] rounded-[10px] px-[20px] py-[11px] bg-green-600
                whitespace-nowrap text-[14px] font-semibold text-white
                transition-colors duration-150 hover:bg-green-800"
            >
              <Plus size={16} strokeWidth={2.5} />
              Add meal
            </button>

            <div className="flex flex-wrap items-center gap-[10px] mt-[40px]">
              {/* Search input */}
              <div className="relative flex-1 min-w-[180px]">
                <Search
                  size={14}
                  strokeWidth={2}
                  className="pointer-events-none absolute left-[11px] top-1/2
                    -translate-y-1/2 text-[var(--color-muted)]"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search meals..."
                  className="w-full border-[1.5px] border-[var(--color-border)]
                    rounded-[8px] pl-[34px] pr-[12px] py-[9px] bg-[var(--color-surface)]
                    text-[14px] text-[var(--color-foreground)] transition-colors
                    duration-150 focus-visible:outline-none focus:ring-2
                    focus:ring-offset-0 focus:ring-salmon-200 focus:border-transparent"
                />
              </div>

              {/* Slot filter pills */}
              <div className="flex items-center gap-[6px]">
                {SLOT_FILTERS.map(({ value, label }) => {
                  const active = slotFilter === value;

                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setSlotFilter(value)}
                      className={`select-none cursor-pointer border-[1.5px] rounded-[8px]
                        px-[14px] py-[8px] whitespace-nowrap text-[13px] transition-all
                        duration-150
                    ${
                      active
                        ? "border-green-600 bg-green-600 font-semibold text-white"
                        : `border-[var(--color-border)] bg-[var(--color-surface)]
                           font-medium text-[var(--color-muted)] hover:bg-green-50
                           hover:text-green-600`
                    }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      {!hasMeals ? (
        <EmptyMeals onAdd={openAddModal} />
      ) : noSearchResult ? (
        <div className="flex flex-col items-center gap-[14px] px-[20px] py-[64px]">
          <p className="leading-[1.6] text-center text-[15px] text-[var(--color-muted)]">
            No meals match{" "}
            <strong className="[overflow-wrap:anywhere] text-[var(--color-foreground)]">
              &ldquo;{search}&rdquo;
            </strong>
            {slotFilter !== "all" && ` in ${slotFilter}`}.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSlotFilter("all");
            }}
            className="select-none cursor-pointer bg-transparent whitespace-nowrap
              underline text-[14px] font-semibold text-salmon-800"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onEdit={openEditModal} />
          ))}
        </div>
      )}

      {/* Meal Modal */}
      <MealModal isOpen={modalOpen} onClose={closeModal} meal={editingMeal} />
    </main>
  );
}
