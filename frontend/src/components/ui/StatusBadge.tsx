interface StatusBadgeProps {
  positive?: boolean;
  variant?: "green" | "red" | "amber" | "blue";
  children: React.ReactNode;
}

export default function StatusBadge({
  positive = true,
  variant,
  children,
}: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        variant
          ? ""
          : positive
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {children}
    </span>
  );
}