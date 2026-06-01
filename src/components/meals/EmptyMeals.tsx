import Image from "next/image";

interface EmptyMealsProps {
  onAdd: () => void;
}

export default function EmptyMeals({ onAdd }: EmptyMealsProps) {
  return (
    <div className="flex flex-col justify-center items-center px-[40px]">
      <Image
        src="/empty_meals.svg"
        alt=""
        aria-hidden="true"
        width={108}
        height={108}
        className="select-none mb-[28px]"
      />

      <h3
        className="mb-[10px] leading-[1.2] text-center text-[20px] md:text-[24px]
          lg:text-[26px] font-bold text-[var(--color-foreground)]"
      >
        No meals yet
      </h3>

      <p
        className="max-w-[360px] mb-[32px] leading-[1.65] text-center text-[15px]
          text-[var(--color-muted)]"
      >
        Add your go-to meals here. Once your library is built, you can plan your
        entire week in seconds.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="select-none cursor-pointer rounded-[10px]
          px-[28px] py-[12px] bg-green-600 whitespace-nowrap text-[14px] font-semibold
          text-white transition-colors duration-150 hover:bg-green-800"
      >
        Add your first meal
      </button>
    </div>
  );
}
