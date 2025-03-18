import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/add.header";
import { useEffect } from "react";
import { fetchAccountApi } from "./components/services/api";
import { useCurrentApp } from "./context/app.context";

function Layout() {
  const { setIsAuthenticated, setUser, isAppLoading, setIsisAppLoading } =
    useCurrentApp();
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountApi();
      console.log("check res", res);
      if (res.data) {
        setUser(res.data.user);
      }
      setIsisAppLoading(false);
    };
    fetchAccount();
  }, []);
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default Layout;
