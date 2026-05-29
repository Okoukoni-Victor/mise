# Mise

> _mise en place — everything in its place, before you need it._

**Mise** is a personal meal planning app built to eliminate food decision fatigue. Instead of staring into your fridge at 11am — hungry, indecisive, and already running late — you plan the night before. Morning-you just executes.

**Live URL:** [https://mise-hq.vercel.app/](https://mise-hq.vercel.app/)

---

## The Problem

I have a habit of eating late — not because I want to, but because I can't decide what to eat on time. By the time I'm hungry, I'm already running a multi-variable calculation in my head: what do I feel like eating, what ingredients do I have, which ones do I need to go out to buy, how far is the shop, how long will it take to cook, do I have enough cash?

That mental load, under the pressure of real hunger, is brutal. I make poor decisions, eat late, and then spend the rest of the day sluggish.

The fix isn't willpower — it's deciding _before_ the hunger kicks in. Mise gives me a system to do that.

---

## What It Does

Mise is built around five pages that form a complete meal planning loop:

| Page         | What it does                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Today**    | Shows today's three meal slots. Plan, change, or remove meals directly. Flags missing ingredients and shows live weekly stats. |
| **Planner**  | A 7-day week grid (Mon–Sun). Assign meals to Breakfast, Lunch, and Dinner slots. Navigate between weeks.                       |
| **Meals**    | Your personal meal library. Add meals with ingredients, prep time, and suitable slots. Search and filter.                      |
| **Pantry**   | Mark which ingredients you currently have at home. Two-column layout: "In your pantry" vs "Still need."                        |
| **Shopping** | Auto-generated from the week's plan minus your pantry. Check off items as you shop. Copy to clipboard.                         |

Data persists in `localStorage` — no account, no backend, no friction.

---

## Why Next.js (App Router)

This project uses **React** with the **Next.js App Router**, the choice was deliberate:

- **Next.js App Router** is Module 4 of the React curriculum — the production-level layer. Using it here demonstrates understanding beyond the basics.
- **File-based routing** cleanly maps to the app's five pages without manual router setup.
- **Server and Client Components** are applied correctly: layouts and static pages are server components; anything touching state (`useStore`, modals, interactive grids) is explicitly marked `'use client'`.

Plain React + React Router would also have worked — but Next.js earns its place here.

---

## Tech Stack

| Layer       | Choice                                       | Why                                                        |
| ----------- | -------------------------------------------- | ---------------------------------------------------------- |
| Framework   | Next.js 15 (App Router)                      | Production-grade React, Module 4 curriculum                |
| Language    | TypeScript                                   | Type safety                                                |
| Styling     | Tailwind CSS + CSS custom properties         | Utility classes for layout, CSS vars for the design system |
| State       | React Context + `useReducer`                 | Global app state without an external library               |
| Persistence | `localStorage`                               | Session-persistent data, zero backend complexity           |
| Icons       | Lucide React                                 | Consistent, clean SVG icon set                             |
| Fonts       | Playfair Display (headings) + DM Sans (body) | Editorial warmth for a food app                            |

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repository
git clone https://github.com/Okoukoni-Victor/mise.git
cd mise

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**To build for production:**

```bash
npm run build
npm start
```

---

## Project Structure

```
mise/
├──src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout — fonts, StoreProvider, nav shell
│   ├── page.tsx            # / — Today view
│   ├── planner/page.tsx    # /planner
│   ├── meals/page.tsx      # /meals
│   ├── pantry/page.tsx     # /pantry
│   └── shopping/page.tsx   # /shopping
│
├── components/
│   ├── nav/                # Sidebar, BottomNav, NavItem
│   ├── today/              # TodayPage
│   ├── planner/            # PlannerPage, MealPickerModal
│   ├── meals/              # MealLibrary, MealCard, MealModal, EmptyMeals
│   ├── pantry/             # PantryPage, EmptyPantry
│   └── shopping/           # ShoppingPage
│
├── hooks/
│   └── useStore.tsx        # Global Context + useReducer store
│
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── storage.ts          # localStorage read/write
    └── utils.ts            # Utility functions
```

---

## Data Model

```typescript
Meal           { id, name, ingredientIds[], prepTime, slots[], createdAt }
Ingredient     { id, name }
PantryItem     { ingredientId, available }
PlannedMeal    { id, date, slot, mealId }
```

All state lives in a single `MiseStore` object, persisted to `localStorage` on every change.

---
