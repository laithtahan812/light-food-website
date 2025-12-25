import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/menu");
    } catch (err) {
      setError(err.message || "Ошибка");
    }
  };

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <h1 className="h2">Вход</h1>
          <p className="muted">Войдите, чтобы оформлять заказы и смотреть историю.</p>
          {error && <div className="notice" style={{ borderStyle: "solid" }}>{error}</div>}
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-primary" type="submit">Войти</button>
          </form>
          <hr className="sep" />
          <div className="muted">
            Нет аккаунта? <Link to="/register" style={{ textDecoration: "underline" }}>Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
