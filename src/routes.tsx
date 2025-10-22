import { createBrowserRouter } from "react-router-dom";
import PhotoGrid from "./pages/PhotoGrid";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PhotoGrid />,
  },
  {
    path: "photo",
    element: <h1>Photo Details Page</h1>,
  },
  {
    path: "*",
    element: <h1>404 Not Found</h1>,
  },
]);

export default router;
