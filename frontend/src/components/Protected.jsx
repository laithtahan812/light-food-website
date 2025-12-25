import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Protected({ children }) {
  const { isAuthed, ready } = useAuth();
  if (!ready) return <div className="container"><div className="notice">Загрузка...</div></div>;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}
