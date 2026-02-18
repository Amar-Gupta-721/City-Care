import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
