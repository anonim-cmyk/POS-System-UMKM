import { RouterProvider } from "react-router";
import router from "./routes";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";

const App = () => {
  const isLoading = useLoadData();

  if (isLoading) return <FullScreenLoader />;

  return <RouterProvider router={router} />;
};

export default App;
