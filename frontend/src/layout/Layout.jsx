import { Outlet } from "react-router";
import Header from "../components/shared/Header";
import useLoadData from "../hooks/useLoadData";
import FullScreenLoader from "../components/shared/FullScreenLoader";

const Layout = () => {
  const isLoading = useLoadData();

  if (isLoading) return <FullScreenLoader />;
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
