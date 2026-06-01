type ColEmptyProps = {
  message: string;
  success?: boolean;
};

export default function ColEmpty({ message, success = false }: ColEmptyProps) {
  return (
    <div
      className={`border border-dashed
        rounded-[8px] px-[16px] py-[20px] text-center
        ${
          success
            ? `border-green-200 bg-green-50`
            : `border-[var(--color-border)] bg-[var(--color-background)]`
        }`}
    >
      <p
        className={`leading-[1.5] text-[13px]
          ${
            success
              ? `font-medium text-green-600`
              : `font-normal text-[var(--color-muted)]`
          }
        `}
      >
        {message}
      </p>
    </div>
  );
}
