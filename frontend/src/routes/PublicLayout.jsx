import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicLayout = () => {
  const { isAuth } = useSelector((state) => state.user);

  if (isAuth) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicLayout;
