import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getRating,
  setRating as setRatingApi,
  removeRating,
} from "../services/apiRatings";

export function useRating(tmdbId: number) {
  const queryClient = useQueryClient();

  const { data: rating, isPending: isFetching } = useQuery({
    queryKey: ["rating", tmdbId],
    queryFn: () => getRating(tmdbId),
    enabled: !!tmdbId,
  });

  const setMutation = useMutation({
    mutationFn: ({
      rating,
      title,
      posterPath,
    }: {
      rating: number;
      title: string;
      posterPath: string | null;
    }) => setRatingApi(tmdbId, rating, title, posterPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", tmdbId] });
      toast.success("Rating saved", {
        style: { fontSize: "0.875rem", textAlign: "center" },
      });
    },
    onError: () => {
      toast.error("Failed to save rating", {
        style: { fontSize: "0.875rem", textAlign: "center" },
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeRating(tmdbId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", tmdbId] });
      toast.success("Rating removed", {
        style: { fontSize: "0.875rem", textAlign: "center" },
      });
    },
  });

  return {
    rating: rating ?? null,
    setRating: setMutation.mutate,
    removeRating: removeMutation.mutate,
    isPending: isFetching || setMutation.isPending,
  };
}
