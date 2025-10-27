import { createBrowserRouter } from "react-router-dom";
import PhotoGrid from "./pages/PhotoGrid";
import PhotoDetails from "./pages/PhotoDetails/PhotoDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PhotoGrid />,
  },
  {
    path: "/photo/:id",
    element: <PhotoDetails />,
  },
  {
    path: "*",
    element: <h1>404 Not Found</h1>,
  },
]);

export default router;
