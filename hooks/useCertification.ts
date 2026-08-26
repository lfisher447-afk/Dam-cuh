import { useQuery } from "@tanstack/react-query";
import { getMovieCertification } from "../services/apiCertifications";

export function useCertification(id: number) {
  const { data: certification } = useQuery<string | null>({
    queryKey: ["certification", id],
    queryFn: () => getMovieCertification(id),
    staleTime: 1000 * 60 * 60 * 24,
  });

  return { certification: certification ?? null };
}
