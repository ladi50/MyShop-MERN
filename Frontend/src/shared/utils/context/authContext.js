import { createContext } from "react";

export const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  userId: null,
  username: null,
  token: null,
  isLoggedIn: false
});