import { Routes, Route } from "react-router-dom";
import Layout from "../pages/Layout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { Login } from "../auth/pages/Login";
import Products from "../auth/pages/Products";
import Landing from "../auth/pages/Landing";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Landing />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute redirectPath="/">
              <Login />
            </PublicRoute>
          }
        />
      </Route>
    </Routes>
  );
}
