type ColHeaderProps = {
  label: string;
  count: number;
  variant: "green" | "salmon";
};

export default function ColHeader({ label, count, variant }: ColHeaderProps) {
  const bgClass = variant === "green" ? "bg-green-200" : "bg-salmon-400";

  return (
    <div
      className="flex items-center gap-[8px] mb-[12px] border-b
        border-[var(--color-border)] pb-[12px]"
    >
      <h2
        className="tracking-[0.02em] text-[13px] font-body font-bold
          text-white"
      >
        {label}
      </h2>

      <span
        className={`select-none inline-flex justify-center items-center min-w-[24px] h-[24px]
          rounded-full px-[6px] text-[11px] font-black text-[var(--color-foreground)]
          ${bgClass}`}
      >
        {count}
      </span>
    </div>
  );
}
