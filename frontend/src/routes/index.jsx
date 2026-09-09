import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "./ProtectedLayout";
import Home from "../pages/Home";
import Orders from "../pages/Orders";
import Tables from "../pages/Tables";
import Menu from "../pages/Menu";
import Dashboard from "../pages/Dashboard";
import More from "../pages/More";
import PublicLayout from "./PublicLayout";
import Auth from "../pages/Auth";
import PaymentResult from "../pages/PaymentResult";

const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "tables",
        element: <Tables />,
      },
      {
        path: "menu",
        element: <Menu />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "more",
        element: <More />,
      },
      {
        path: "payment-result",
        element: <PaymentResult />,
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
]);

export default router;
