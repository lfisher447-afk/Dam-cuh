import { auth } from "../lib/firebase";

export function useUserId(): string | null {
  return auth.currentUser?.uid ?? null;
}
