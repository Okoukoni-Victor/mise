type ColHeaderProps = {
  label: string;
  count: number;
  variant: "green" | "salmon";
};

export default function ColHeader({ label, count, variant }: ColHeaderProps) {
  const bgClass = variant === "green" ? "bg-green-600" : "bg-salmon-600";

  return (
    <div
      className="flex items-center gap-[8px] mb-[12px] border-b
        border-[var(--color-border)] pb-[12px]"
    >
      <h2
        className="tracking-[0.02em] text-[13px] font-body font-bold
          text-[var(--color-foreground)]"
      >
        {label}
      </h2>

      <span
        className={`select-none inline-flex justify-center items-center min-w-[24px] h-[24px]
          rounded-full px-[6px] text-[11px] font-bold text-white ${bgClass}`}
      >
        {count}
      </span>
    </div>
  );
}
