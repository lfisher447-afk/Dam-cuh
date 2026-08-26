import { useUser } from "../hooks/useUser";
import { ButtonProp } from "types";
import Spinner from "./Spinner";
import IntroAnimation from "./IntroAnimation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: ButtonProp) {
  const navigate = useNavigate();
  const { isPending, isAuthenticated } = useUser();
  const [introDone, setIntroDone] = useState(false);

  useEffect(
    function () {
      if (!isAuthenticated && !isPending) {
        navigate("/login");
      }
    },
    [isAuthenticated, isPending, navigate],
  );

  if (isPending) return <Spinner />;

  if (!isAuthenticated) return null;

  if (!introDone)
    return <IntroAnimation onComplete={() => setIntroDone(true)} />;

  return children;
}
export default ProtectedRoute;
