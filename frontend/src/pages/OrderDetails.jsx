import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { apiOrderById } from "../utils/api.js";

function pm(pm) {
  return pm === "cash" ? "Наличными" : "Картой";
}

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError("");
      try {
        const res = await apiOrderById(id, token);
        setData(res);
      } catch (e) {
        setError(e.message || "Ошибка");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <div className="row wrap" style={{ justifyContent: "space-between" }}>
            <h1 className="h2">Заказ №{id}</h1>
            <Link to="/orders" className="btn">Назад к списку</Link>
          </div>

          {loading && <div className="notice">Загрузка...</div>}
          {error && <div className="notice" style={{ borderStyle: "solid" }}>{error}</div>}

          {!loading && data && (
            <>
              <div className="grid" style={{ marginTop: 10 }}>
                <div className="col-6">
                  <div className="notice">
                    <div><strong>Статус:</strong> {data.order.status_ru}</div>
                    <div><strong>Оплата:</strong> {pm(data.order.payment_method)}</div>
                    <div><strong>Дата:</strong> {new Date(data.order.created_at).toLocaleString("ru-RU")}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="notice">
                    <div><strong>Адрес:</strong> {data.order.address}</div>
                    <div><strong>Телефон:</strong> {data.order.phone}</div>
                    {data.order.comment ? <div><strong>Комментарий:</strong> {data.order.comment}</div> : null}
                  </div>
                </div>
              </div>

              <hr className="sep" />

              <h2 className="h2">Состав заказа</h2>
              <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                {data.items.map(it => (
                  <div className="card" key={it.id} style={{ padding: 12 }}>
                    <div className="row wrap" style={{ justifyContent: "space-between" }}>
                      <div className="row" style={{ gap: 12 }}>
                        <img src={it.image_url} alt={it.name_ru} style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }} />
                        <div>
                          <strong>{it.name_ru}</strong>
                          <div className="muted" style={{ fontSize: 13 }}>
                            {it.quantity} шт. × {it.price_rub} ₽
                          </div>
                        </div>
                      </div>
                      <div className="h2" style={{ margin: 0 }}>{it.quantity * it.price_rub} ₽</div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="sep" />

              <div className="row wrap" style={{ justifyContent: "space-between" }}>
                <div className="muted">Итого</div>
                <div className="h2" style={{ margin: 0 }}>{data.order.total_rub} ₽</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
