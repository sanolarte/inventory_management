import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";

export default function PrivateRoute({ children }) {
  const { logged } = useContext(AuthContext);
  const location = useLocation();
  return logged ? children : <Navigate to="/login" replace state={{ from: location }} />;
}
