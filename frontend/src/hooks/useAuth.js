import { useState } from "react";
import { apiRequest } from "../api/client";

const initialAuthForm = { name: "", email: "", password: "" };

export function useAuth({ showMessage, showError, clearAlerts }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(initialAuthForm);
  const [loading, setLoading] = useState(false);

  const loadCurrentUser = async (currentToken = token) => {
    if (!currentToken) return;

    try {
      const response = await apiRequest("/auth/me", { token: currentToken });
      setUser(response.data);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
    clearAlerts();
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    showError("");

    try {
      const path = authMode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        authMode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };

      const response = await apiRequest(path, {
        method: "POST",
        body: payload,
      });

      const authToken = response.data.token;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(response.data.user);
      setAuthForm(initialAuthForm);
      showMessage(response.message);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    showMessage("Logged out");
  };

  return {
    token,
    user,
    authMode,
    authForm,
    loading,
    setUser,
    handleAuthChange,
    toggleAuthMode,
    handleAuthSubmit,
    loadCurrentUser,
    logout,
  };
}
