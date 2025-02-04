import React, { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { authContext } from "../context/AuthContextProvider";
import fetchRequest from "../api/api";
import { USER_AUTH_TOKEN_URL } from "../constants/api";
import { useNavigate } from "react-router";
const ProtectedRoute = ({ children }) => {
  const { setIsAuthenticated, setUser, user, isAuthenticated } =
    useContext(authContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function authenticateViaCustomLoginToken(token, config = {}) {
      try {
        const user = await fetchRequest(
          USER_AUTH_TOKEN_URL,
          {
            token: token,
          },
          "POST",
          { ...config }
        );
        console.log("TOKEN AUTH RESPONSE", user);
        if (user) return user.data;
        else return null;
      } catch (err) {
        console.log("Token Authentication Error", err);
      }
    }

    async function authenticateUser() {
      const authToken = Cookies.get("token");
      const googleToken = Cookies.get("google-token");
      console.log("AUTH, GOOGLE TOKENS", authToken, googleToken);
      const googleUser = await authenticateViaCustomLoginToken(googleToken, {
        withCredentials: true,
      });
      const user = await authenticateViaCustomLoginToken(authToken);
      console.log("AUTH-USER_GOOGLE", user, googleUser, isAuthenticated);
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else if (googleUser) {
        setIsAuthenticated(true);
        setUser(googleUser);
      } else {
        navigate("/login");
      }
    }
    if (!isAuthenticated) authenticateUser();
  }, [isAuthenticated]);

  return <>{isAuthenticated ? children : "Loading.."}</>;
};

export default ProtectedRoute;
