import React, { useContext, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputBase,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { useErrorBoundary } from "../components/useErrorBoundary";
import { authContext } from "../context/AuthContextProvider";
import fetchRequest from "../api/api";
import { LOGIN_URL, REGISTER_URL } from "../constants/api";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(authContext);
  const { handleError, ErrorModal } = useErrorBoundary();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Reg", isNewUser);
    if (isNewUser) {
      //handle registration
      try {
        if (password == confirmPassword) {
          const user = await fetchRequest(REGISTER_URL, {
            name: "test",
            email: email,
            password,
          });
          if (user.data) {
            Cookies.set("token", user.data.token);
            setIsAuthenticated(true);
            setUser(user.data.user);
            navigate("/");
          }
        } else {
          //handle validation
          return;
        }
      } catch (err) {
        handleError({
          title: "Registration Error",
          message: err.response.data,
        });
        console.log("Registration error", err);
      }
    } else {
      // handle login
      try {
        if (email && password) {
          const user = await fetchRequest(LOGIN_URL, {
            email: email,
            password: password,
          });
          if (user.data) {
            Cookies.set("token", user.data.token);
            setIsAuthenticated(true);
            setUser(user.data.user);
            navigate("/");
          } else {
            //handle validation
            return;
          }
        }
      } catch (err) {
        handleError({ title: "Login Error", message: err.response.data });
        console.log("LOGIN ERROR", err);
      }
    }
  }

  useEffect(() => {
    const authToken = Cookies.get("token");
    const googleToken = Cookies.get("google-token");
    if (isAuthenticated || authToken || googleToken) {
      navigate("/");
    }
  }, [isAuthenticated]);

  function handleGoogleAuthentication() {
    window.location.href =
      "https://task-board-backend-cbnz.onrender.com/user/auth";
  }

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Paper
        component={"form"}
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "350px",
          maxHeight: "450px",
          width: "400px",
          padding: "2rem",
          borderRadius: "10px",
        }}
        elevation={3}
      >
        <Typography
          sx={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}
        >
          {isNewUser ? "Register" : "Login"}
        </Typography>
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          label="email"
          placeholder="email"
          margin="normal"
        ></TextField>
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          fullWidth
          label="password"
          placeholder="password"
        ></TextField>
        {isNewUser && (
          <TextField
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            fullWidth
            label="confirm password"
            placeholder="confirm password"
          ></TextField>
        )}
        <Box
          sx={{ margin: "10px", cursor: "pointer" }}
          onClick={() => setIsNewUser((prev) => !prev)}
        >
          {!isNewUser ? (
            <Typography>No Account ? Get started with TaskBoard</Typography>
          ) : (
            <Typography>Already part of Taskboard family ?</Typography>
          )}
        </Box>
        <Button
          fullWidth
          sx={{
            marginTop: "1rem",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
          variant="contained"
          type="submit"
        >
          {isNewUser ? "Register" : "Login"}
        </Button>

        <Button
          fullWidth
          sx={{
            marginTop: "1rem",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
          variant="contained"
          onClick={handleGoogleAuthentication}
        >
          Continue with Google
        </Button>
      </Paper>
      <ErrorModal />
    </Paper>
  );
};

export default Login;
