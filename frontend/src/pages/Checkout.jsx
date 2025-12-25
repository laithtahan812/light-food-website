import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../state/CartContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { apiCreateOrder } from "../utils/api.js";

export default function Checkout() {
  const nav = useNavigate();
  const { items, total, clear } = useCart();
  const { token } = useAuth();

  const [payment, setPayment] = useState("cash");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const payloadItems = useMemo(() => items.map(x => ({ dishId: x.dish.id, qty: x.qty })), [items]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!items.length) return setError("Корзина пуста");
    setBusy(true);
    try {
      const res = await apiCreateOrder(
        { items: payloadItems, paymentMethod: payment, address, phone, comment },
        token
      );
      clear();
      nav(`/orders/${res.orderId}`);
    } catch (err) {
      setError(err.message || "Ошибка оформления заказа");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <h1 className="h2">Оформление заказа</h1>
          <p className="muted">Укажите адрес и способ оплаты (наличные/карта).</p>

          {error && <div className="notice" style={{ borderStyle: "solid" }}>{error}</div>}

          <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 10 }}>
            <div className="grid">
              <div className="col-6">
                <label className="muted">Адрес доставки</label>
                <input className="input" placeholder="Город, улица, дом, квартира" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="muted">Телефон</label>
                <input className="input" placeholder="+7 (___) ___-__-__" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="muted">Оплата</label>
                <select className="input" value={payment} onChange={e => setPayment(e.target.value)}>
                  <option value="cash">Наличными</option>
                  <option value="card">Картой</option>
                </select>
              </div>
              <div className="col-6">
                <label className="muted">Комментарий к заказу</label>
                <input className="input" placeholder="Например: без лука, позвонить за 5 минут" value={comment} onChange={e => setComment(e.target.value)} />
              </div>
            </div>

            <div className="card" style={{ padding: 12 }}>
              <div className="row wrap" style={{ justifyContent: "space-between" }}>
                <div className="muted">Товары: {items.reduce((s, x) => s + x.qty, 0)} шт.</div>
                <div><strong>Итого: {total()} ₽</strong></div>
              </div>
            </div>

            <button className="btn btn-primary" disabled={busy} type="submit">
              {busy ? "Оформляем..." : "Подтвердить заказ"}
            </button>

            <div className="muted" style={{ fontSize: 13 }}>
              Примечание: для оплаты картой здесь используется демо‑режим. Для реальной интеграции добавьте платежный провайдер.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
