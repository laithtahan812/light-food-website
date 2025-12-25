import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <div className="badge">Доставка • Самовывоз • Оплата наличными/картой</div>
          <h1 className="h1" style={{ marginTop: 10 }}>ЛАЙТ FOOD</h1>
          <p className="muted" style={{ fontSize: 16 }}>
            Ливанская кухня: мезе, гриль, выпечка, десерты и напитки. 
            Выберите блюда в меню, добавьте в корзину и оформите заказ.
          </p>
          <div className="row wrap" style={{ marginTop: 12 }}>
            <Link to="/menu" className="btn btn-primary">Открыть меню</Link>
            <Link to="/orders" className="btn">История заказов</Link>
            <Link to="/profile" className="btn">Профиль</Link>
          </div>
        </div>

        <div className="col-12 card" style={{ padding: 18 }}>
          <h2 className="h2">Как это работает</h2>
          <hr className="sep" />
          <div className="grid">
            <div className="col-4">
              <div className="notice">
                <strong>1) Выберите блюда</strong><br/>
                Используйте поиск и фильтры по категориям.
              </div>
            </div>
            <div className="col-4">
              <div className="notice">
                <strong>2) Оформите заказ</strong><br/>
                Укажите адрес, телефон и способ оплаты.
              </div>
            </div>
            <div className="col-4">
              <div className="notice">
                <strong>3) Смотрите историю</strong><br/>
                Все заказы сохраняются в профиле.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        © {new Date().getFullYear()} ЛАЙТ FOOD — демонстрационный сайт (учебный проект)
      </div>
    </div>
  );
}
