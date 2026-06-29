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
      className="border border-[var(--color-border)] rounded-[12px] px-[20px] py-[18px]
        bg-[var(--color-surface)] transition-all duration-200 ease-in
        hover:shadow-[0_4px_20px_rgba(120,60,45,0.07)] hover:border-salmon-200"
    >
      <span
        className="block mb-[6px] leading-none text-[30px] font-display font-bold
          text-salmon-600"
      >
        {value}
      </span>

      <span
        className="inline-flex items-center gap-[4px] text-[13px]
          text-[var(--color-muted)]"
      >
        {label}

        <ArrowRight size={14} strokeWidth={2} className="text-green-400" />
      </span>
    </Link>
  );
}
