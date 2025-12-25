import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <h1 className="h2">Профиль</h1>
          <p className="muted">Данные аккаунта и быстрые действия.</p>

          <div className="grid" style={{ marginTop: 10 }}>
            <div className="col-6">
              <div className="notice">
                <div><strong>Имя:</strong> {user?.name}</div>
                <div><strong>Email:</strong> {user?.email}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="notice">
                <div><strong>Функции:</strong></div>
                <div className="muted" style={{ fontSize: 13 }}>
                  • История заказов<br/>
                  • Темная/светлая тема<br/>
                  • Оплата наличными/картой (демо)
                </div>
              </div>
            </div>
          </div>

          <hr className="sep" />
          <div className="row wrap">
            <Link className="btn btn-primary" to="/menu">Перейти в меню</Link>
            <Link className="btn" to="/orders">История заказов</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
