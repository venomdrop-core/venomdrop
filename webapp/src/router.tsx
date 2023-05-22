import {
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard } from "./pages/admin/collection/edit/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/collections/:slug/edit/dashboard",
    element: <Dashboard />,
  },
]);
