"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  CalendarDays,
  UtensilsCrossed,
  Package,
  ShoppingBag,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: Sun },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/pantry", label: "Pantry", icon: Package },
  { href: "/shopping", label: "Shopping", icon: ShoppingBag },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="overflow-y-auto z-sticky sticky top-0 shrink-0 flex flex-col w-[248px]
        h-dvh border-r border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="flex items-center border-b border-[var(--color-border)] p-[20px]">
        <Link
          href="/"
          aria-label="Mise homepage"
          className="select-none relative w-[75px] h-[30px]"
        >
          <Image
            src="/Mise.png"
            alt="Mise logo"
            fill
            sizes="75px"
            className="object-contain"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-[12px] px-[12px] py-[16px]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`select-none inline-flex items-center gap-[10px] rounded-[9px]
                px-[12px] py-[10px] whitespace-nowrap transition-colors duration-150
                  ${
                    isActive
                      ? "bg-green-600 text-white"
                      : `bg-transparent text-[var(--color-muted)] hover:bg-green-50
                         hover:text-green-600`
                  }`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />

              <span
                className={`tracking-[-0.01em] text-[14px]
                  ${isActive ? "font-semibold" : "font-medium"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className="flex justify-center items-center border-t border-[var(--color-border)]
          p-[20px]"
      >
        <p
          className="tracking-[0.1em] text-[10px] uppercase font-medium
            text-[var(--color-foreground)]"
        >
          mise en place
        </p>
      </div>
    </aside>
  );
}
