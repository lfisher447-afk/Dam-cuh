export const UNRELEASED_STATUSES = [
  "Planned",
  "Rumored",
  "In Production",
  "Post Production",
];

export function isUnreleased(
  status: string | undefined | null,
  releaseDate: string,
): boolean {
  if (!status) return false;
  if (releaseDate && new Date(releaseDate) > new Date()) return true;
  if (UNRELEASED_STATUSES.includes(status)) return true;
  return false;
}
