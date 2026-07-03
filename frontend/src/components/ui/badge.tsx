interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "primary";
}

export default function Badge({
  label,
  variant = "primary",
}: BadgeProps) {
  const variants = {
    success: "bg-emerald-500/15 text-emerald-400",
    warning: "bg-amber-500/15 text-amber-400",
    danger: "bg-red-500/15 text-red-400",
    primary: "bg-blue-500/15 text-blue-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
}