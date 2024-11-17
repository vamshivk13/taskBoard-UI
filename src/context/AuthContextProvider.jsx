import React, { useState } from "react";
import { createContext } from "react";

export const authContext = createContext();
const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <authContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
