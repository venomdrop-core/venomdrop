import {
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard } from "./pages/admin/collection/edit/Dashboard";
import { Details } from "./pages/admin/collection/edit/Details";
import { Graphics } from "./pages/admin/collection/edit/Graphics";
import { DropSettings } from "./pages/admin/collection/edit/DropSettings";

export const router = createBrowserRouter([
  {
    path: "/collections/:slug/edit/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/collections/:slug/edit/details",
    element: <Details />,
  },
  {
    path: "/collections/:slug/edit/graphics",
    element: <Graphics />,
  },
  {
    path: "/collections/:slug/edit/drop-settings",
    element: <DropSettings />,
  },
]);
