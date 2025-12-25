import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      nav("/menu");
    } catch (err) {
      setError(err.message || "Ошибка");
    }
  };

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <h1 className="h2">Регистрация</h1>
          <p className="muted">Создайте аккаунт для заказов и истории.</p>
          {error && <div className="notice" style={{ borderStyle: "solid" }}>{error}</div>}
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <input className="input" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="input" placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-primary" type="submit">Создать аккаунт</button>
          </form>
          <hr className="sep" />
          <div className="muted">
            Уже есть аккаунт? <Link to="/login" style={{ textDecoration: "underline" }}>Войти</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
