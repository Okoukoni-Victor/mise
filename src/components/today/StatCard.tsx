import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StatCardProps {
  value: string | number;
  label: string;
  href: string;
}

export default function StatCard({ value, label, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[12px] px-[20px] py-[18px] bg-[var(--color-surface)]"
    >
      <span
        className="block mb-[6px] leading-none text-[30px] font-display font-bold
          text-salmon-800"
      >
        {value}
      </span>

      <span
        className="inline-flex items-center gap-[4px] text-[13px]
          text-[var(--color-muted)]"
      >
        {label}

        <ArrowRight
          size={14}
          strokeWidth={2}
          className="text-green-400 transition-translate duration-150
            group-hover:translate-x-[2px]"
        />
      </span>
    </Link>
  );
}
