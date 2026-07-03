import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../api/client";

export function useNews(
  ticker?: string
) {
  return useQuery({
    queryKey: ["news", ticker],
    queryFn: () => fetchNews(ticker),
    staleTime: 1000 * 60 * 5,
  });
}