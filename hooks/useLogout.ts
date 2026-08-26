import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogout() {
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    },

    onError: (err: Error) => {
      toast.error(`Logout failed: ${err.message}`);
    },
  });

  return { logout, isPending };
}
