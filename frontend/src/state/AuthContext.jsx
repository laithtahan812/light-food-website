import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiRegister, apiMeHealth } from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // simple token sanity check (optional)
    const check = async () => {
      if (!token) { setReady(true); return; }
      try { await apiMeHealth(); }
      catch { setToken(""); setUser(null); }
      finally { setReady(true); }
    };
    check();
  }, []); // eslint-disable-line

  useEffect(() => {
    localStorage.setItem("token", token || "");
    if (!token) localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthed: Boolean(token && user),
    ready,
    async login(email, password) {
      const { token: t, user: u } = await apiLogin({ email, password });
      setToken(t); setUser(u);
    },
    async register(name, email, password) {
      const { token: t, user: u } = await apiRegister({ name, email, password });
      setToken(t); setUser(u);
    },
    logout() {
      setToken(""); setUser(null);
    }
  }), [token, user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
