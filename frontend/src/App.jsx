import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Home, Auth, Orders, Tables, Menu } from "../src/pages";
import Header from "../src/components/shared/Header";
import Layout from "../src/layout/Layout";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";

const PublicRoutes = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);
  if (isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedRoutes = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoutes>
            <Orders />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/tables",
        element: (
          <ProtectedRoutes>
            <Tables />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/menu",
        element: (
          <ProtectedRoutes>
            <Menu />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoutes>
        <Auth />
      </PublicRoutes>
    ),
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router}>
        <Header />
      </RouterProvider>
    </>
  );
};

export default App;
