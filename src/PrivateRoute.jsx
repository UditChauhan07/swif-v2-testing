import React from "react";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = localStorage.getItem("UserToken");
  const role = localStorage.getItem("Role");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Element {...rest} />;
};
export default PrivateRoute;
