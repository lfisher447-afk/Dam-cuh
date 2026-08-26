import { useMutation } from "@tanstack/react-query";
import { signUpApi } from "../services/apiAuth";
import { trackUserCountry } from "../services/apiGeolocation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignUp() {
  const navigate = useNavigate();

  const { data, mutate, error, isPending } = useMutation({
    mutationFn: signUpApi,

    onSuccess: () => {
      toast.success("Account created successfully");
      trackUserCountry();
      navigate("/login");
    },

    onError: () => {
      toast.error("Account already exists.");
    },
  });

  return { data, mutate, error, isPending };
}
