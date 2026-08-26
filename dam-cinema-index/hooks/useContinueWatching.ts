import { useQuery } from "@tanstack/react-query";
import { getWatchHistory } from "../services/apiWatchHistory";

export function useContinueWatching() {
  const { data, isPending } = useQuery({
    queryKey: ["continueWatching"],
    queryFn: () => getWatchHistory(),
  });

  const inProgress = (data || []).filter(
    (entry) => entry.progress >= 0 && entry.progress < 100,
  );

  return { continueWatching: inProgress, isPending };
}
