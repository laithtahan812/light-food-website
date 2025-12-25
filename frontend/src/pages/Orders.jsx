import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { apiOrders } from "../utils/api.js";

function pm(pm) {
  return pm === "cash" ? "Наличными" : "Картой";
}

export default function Orders() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError("");
      try {
        const data = await apiOrders(token);
        setItems(data.items || []);
      } catch (e) {
        setError(e.message || "Ошибка");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <h1 className="h2">История заказов</h1>
          <p className="muted">Список ваших заказов и их статусы.</p>
          {loading && <div className="notice">Загрузка...</div>}
          {error && <div className="notice" style={{ borderStyle: "solid" }}>{error}</div>}
          {!loading && !error && !items.length && (
            <div className="notice">Пока нет заказов. Перейдите в меню и оформите первый заказ.</div>
          )}
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {items.map(o => (
              <Link to={`/orders/${o.id}`} key={o.id} className="card" style={{ padding: 12 }}>
                <div className="row wrap" style={{ justifyContent: "space-between" }}>
                  <div>
                    <strong>Заказ №{o.id}</strong> <span className="badge">{o.status_ru}</span>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {new Date(o.created_at).toLocaleString("ru-RU")} • Оплата: {pm(o.payment_method)}
                    </div>
                  </div>
                  <div className="h2" style={{ margin: 0 }}>{o.total_rub} ₽</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
