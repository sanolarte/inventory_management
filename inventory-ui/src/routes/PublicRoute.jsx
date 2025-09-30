import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";

export default function PublicRoute({ children, redirectPath = "/" }) {
  const { logged } = useContext(AuthContext);
  return logged ? <Navigate to={redirectPath} replace /> : children;
}
