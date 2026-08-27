import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return (
      <Navigate to="/signin" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
