
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedLayout() {
  const location = useLocation();

  const isLoggedIn = sessionStorage.getItem("patentgraph_logged_in") === "true";

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
