import { useCurrentApp } from "@/context/app.context";
import { Button, Result } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
}

const ProtectedRound = (props: IProps) => {
  const { isAuthenticated, user } = useCurrentApp();
  const location = useLocation();

  if (isAuthenticated === false) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    );
  }

  const isAdminRoute = location.pathname.includes("admin");

  if (isAuthenticated === true && isAdminRoute === true) {
    const role = user?.role;
    if (role === "USER") {
      <Result
        status="404"
        title="404"
        subTitle="Sorry, you don't have authorize to access this page !."
        extra={
          <Button type="primary">
            <Link to={"/"}>Back Home</Link>
          </Button>
        }
      />;
    }
  }

  return (
    <>
      <div>{props.children}</div>
    </>
  );
};

export default ProtectedRound;
