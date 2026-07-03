import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "../api/client";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  });
}