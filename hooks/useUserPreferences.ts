import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserPreferences,
  updateUserPreferences,
} from "../services/apiUserPreferences";
import type { UserPreferences } from "../services/apiUserPreferences";
import i18n from "../lib/i18n/config";

export function useUserPreferences() {
  const queryClient = useQueryClient();

  const { data: preferences, isPending } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: getUserPreferences,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<UserPreferences>) => updateUserPreferences(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
      if (data.preferredLanguage) {
        localStorage.setItem("language", data.preferredLanguage);
        i18n.changeLanguage(data.preferredLanguage);
      }
    },
  });

  return {
    preferences: preferences ?? { preferredGenres: [], preferredLanguage: "en" },
    isPending,
    updatePreferences: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
