import { createBrowserRouter } from "react-router";
import { HomePage } from "@/pages/home";
import { NotFound } from "@/pages/NotFound";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
