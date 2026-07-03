import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        rounded-2xl
        bg-blue-600
        px-5
        py-3
        font-semibold
        transition-all
        hover:bg-blue-500
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
}