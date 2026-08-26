import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import type { AuthProps } from "types";

export async function loginApi({ email, password }: AuthProps) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signUpApi({ email, password }: AuthProps) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return credential.user;
}

export async function getCurrentUser() {
  return auth.currentUser;
}

export async function logoutApi() {
  await signOut(auth);
}

export function googleLoginApi() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
