import {
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard } from "./pages/collections/edit/Dashboard";
import { Details } from "./pages/collections/edit/Details";
import { Graphics } from "./pages/collections/edit/Graphics";
import { DropSettings } from "./pages/collections/edit/DropSettings";
import { CollectionsIndex } from "./pages/collections/CollectionsIndex";
import { CollectionMintPage } from "./pages/collections/CollectionMintPage";
import { Home } from "./pages/Home";
import { PreReveal } from "./pages/collections/edit/PreReveal";
import { Reveal } from "./pages/collections/edit/Reveal";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/collections",
    element: <CollectionsIndex />,
  },
  {
    path: "/collections/:slug",
    element: <CollectionMintPage />,
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
  {
    path: "/collections/:slug/edit/pre-reveal",
    element: <PreReveal />,
  },
  {
    path: "/collections/:slug/edit/reveal",
    element: <Reveal />,
  },
]);
