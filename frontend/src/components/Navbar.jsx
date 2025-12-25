import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../state/ThemeContext.jsx";
import { useCart } from "../state/CartContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";

function activeStyle({ isActive }) {
  return { opacity: isActive ? 1 : 0.7, fontWeight: isActive ? 700 : 500 };
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const { isAuthed, user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <strong>ЛАЙТ FOOD</strong>
          <span>Ливанская кухня в России</span>
        </Link>

        <div className="row wrap right">
          <NavLink to="/menu" style={activeStyle} className="btn">Меню</NavLink>
          <NavLink to="/cart" style={activeStyle} className="btn">Корзина ({count()})</NavLink>

          {isAuthed ? (
            <>
              <NavLink to="/orders" style={activeStyle} className="btn">История заказов</NavLink>
              <NavLink to="/profile" style={activeStyle} className="btn">{user?.name || "Профиль"}</NavLink>
              <button className="btn" onClick={() => { logout(); nav("/"); }}>Выйти</button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={activeStyle} className="btn">Вход</NavLink>
              <NavLink to="/register" style={activeStyle} className="btn btn-primary">Регистрация</NavLink>
            </>
          )}

          <button className="btn" onClick={toggle}>
            {theme === "light" ? "Тёмная тема" : "Светлая тема"}
          </button>
        </div>
      </div>
    </div>
  );
}
