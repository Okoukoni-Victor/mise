"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  CalendarDays,
  UtensilsCrossed,
  Package,
  ShoppingBag,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Today", icon: Sun },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/pantry", label: "Pantry", icon: Package },
  { href: "/shopping", label: "Shopping", icon: ShoppingBag },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="z-fixed fixed inset-x-0 bottom-0 flex items-center h-16 border-t
        border-[var(--color-border)] pb-[env(safe-area-inset-bottom)]
        bg-[var(--color-surface)]"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`select-none flex flex-1 flex-col justify-center items-center
              gap-[3px] py-[6px]
              ${isActive ? "text-green-600" : "text-muted"}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />

            <span
              className={`tracking-[0.01em] text-[10px]
                ${isActive ? "font-semibold" : "font-normal"}`}
            >
              {label}
            </span>

            {isActive && (
              <span
                className="absolute bottom-0 w-[20px] h-[2.5px] rounded-t-[2px]
                  bg-salmon-600"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
