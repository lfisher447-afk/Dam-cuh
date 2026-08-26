import { Navigate, createBrowserRouter } from "react-router";
import Home from "./Home";
import Browse from "./Browse";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default appRouter;
