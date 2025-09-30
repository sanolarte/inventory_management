import { useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { types } from "../types/types";

const STORAGE = {
  token: "access_token",
  user:  "auth_user",
};

const initializer = () => {
  try {
    const token = localStorage.getItem(STORAGE.token);
    const raw   = localStorage.getItem(STORAGE.user);
    const user  = raw ? JSON.parse(raw) : null;
    return { logged: !!token, token: token ?? null, user };
  } catch {
    return { logged: false, token: null, user: null };
  }
};

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, undefined, initializer);

  const login = ({ token, user }) => {
    localStorage.setItem(STORAGE.token, token);
    if (user) localStorage.setItem(STORAGE.user, JSON.stringify(user));
    dispatch({ type: types.login, payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE.token);
    localStorage.removeItem(STORAGE.user);
    dispatch({ type: types.logout });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
