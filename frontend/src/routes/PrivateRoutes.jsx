import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/index";

const PrivateRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
