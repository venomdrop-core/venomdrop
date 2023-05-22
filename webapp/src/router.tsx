import {
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard } from "./pages/admin/collection/edit/Dashboard";
import { Details } from "./pages/admin/collection/edit/Details";

export const router = createBrowserRouter([
  {
    path: "/collections/:slug/edit/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/collections/:slug/edit/details",
    element: <Details />,
  },
]);
