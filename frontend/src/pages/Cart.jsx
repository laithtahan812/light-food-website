import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../state/CartContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Cart() {
  const { items, add, dec, remove, total, clear } = useCart();
  const { isAuthed } = useAuth();
  const nav = useNavigate();

  const toCheckout = () => {
    if (!items.length) return;
    if (!isAuthed) return nav("/login");
    nav("/checkout");
  };

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <h1 className="h2">Корзина</h1>
          <p className="muted">Проверьте количество и оформите заказ.</p>

          {!items.length ? (
            <div className="notice">
              Корзина пуста. <Link to="/menu" style={{ textDecoration: "underline" }}>Перейти в меню</Link>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                {items.map(({ dish, qty }) => (
                  <div key={dish.id} className="card" style={{ padding: 12 }}>
                    <div className="row wrap" style={{ justifyContent: "space-between" }}>
                      <div className="row" style={{ gap: 12 }}>
                        <img src={dish.image_url} alt={dish.name_ru} style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border)" }} />
                        <div>
                          <div><strong>{dish.name_ru}</strong> <span className="muted">({dish.category_ru})</span></div>
                          <div className="muted" style={{ fontSize: 13 }}>{dish.price_rub} ₽ за порцию</div>
                        </div>
                      </div>

                      <div className="row">
                        <button className="btn" onClick={() => dec(dish.id)}>-</button>
                        <div className="badge">{qty} шт.</div>
                        <button className="btn" onClick={() => add(dish)}>+</button>
                        <button className="btn" onClick={() => remove(dish.id)}>Удалить</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="sep" />

              <div className="row wrap" style={{ justifyContent: "space-between" }}>
                <div>
                  <div className="muted">Итого</div>
                  <div className="h2">{total()} ₽</div>
                </div>
                <div className="row wrap">
                  <button className="btn" onClick={clear}>Очистить</button>
                  <button className="btn btn-primary" onClick={toCheckout}>Оформить заказ</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
