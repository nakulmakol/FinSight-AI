import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="relative">

      <Search
        size={18}
        className="absolute left-4 top-3.5 text-zinc-500"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-emerald-500"
      />

    </div>
  );
}