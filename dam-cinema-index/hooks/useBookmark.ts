import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateBookmark } from "../services/apiUpdateBookmark";
import type { Movie } from "types";

export function useBookmark(movie: Movie) {
  const { title, isBookmarked, id } = movie;

  const [bookmarked, setBookmarked] = useState<boolean>(isBookmarked);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: updateBookmark,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarkedIds"] });
      queryClient.invalidateQueries({ queryKey: ["trendingMovies"] });
      queryClient.invalidateQueries({ queryKey: ["allMovies"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarkedMovies"] });

      toast.success(
        variables.newValue
          ? `${title} has been added to bookmarks`
          : `${title} has been removed from bookmarks`,
        { style: { fontSize: "0.875rem", textAlign: "center" } },
      );
    },

    onError: (err: Error) => {
      toast.error(`Something went wrong: ${err.message}`);
      setBookmarked(isBookmarked);
    },
  });

  function handleClick() {
    const newValue = !bookmarked;
    setBookmarked(newValue);

    mutate({ newValue, id });
  }

  return { bookmarked, isPending, handleClick };
}
