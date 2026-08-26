import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { googleLoginApi } from "../services/apiAuth";
import { trackUserCountry } from "../services/apiGeolocation";

export function useGoogleLogin() {
  const navigate = useNavigate();

  const { mutate: googleLogin, isPending } = useMutation({
    mutationFn: googleLoginApi,
    onSuccess: () => {
      trackUserCountry();
      navigate("/", { replace: true });
      toast.success("Logged in successfully");
    },
    onError: () => {
      toast.error("Google sign-in failed");
    },
  });

  return { googleLogin, isPending };
}
