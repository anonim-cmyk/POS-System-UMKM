import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Layout from "../layout/Layout";

const ProtectedLayout = () => {
  const { isAuth, authChecked } = useSelector((state) => state.user);

  if (!authChecked) return null; // atau loader kecil

  if (!isAuth) return <Navigate to="/auth" replace />;

  return <Layout />;
};

export default ProtectedLayout;
