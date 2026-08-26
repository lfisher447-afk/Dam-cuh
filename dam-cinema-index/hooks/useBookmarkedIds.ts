import { useQuery } from "@tanstack/react-query";
import { getBookmarkedIds } from "../services/apiBookmark";

export function useBookmarkedIds(): Set<number> {
  const { data } = useQuery({
    queryKey: ["bookmarkedIds"],
    queryFn: getBookmarkedIds,
    staleTime: 30_000,
  });
  return data ?? new Set();
}
