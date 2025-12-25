import React, { useEffect, useMemo, useState } from "react";
import { apiMenu } from "../utils/api.js";
import { useCart } from "../state/CartContext.jsx";

function unique(arr) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b, "ru"));
}

export default function Menu() {
  const { add } = useCart();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiMenu();
        setItems(data.items || []);
      } catch (e) {
        setError(e.message || "Ошибка загрузки меню");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(() => unique(items.map(x => x.category_ru)), [items]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items.filter(x => {
      const okCat = cat ? x.category_ru === cat : true;
      const okQ = qq
        ? (x.name_ru.toLowerCase().includes(qq) || x.description_ru.toLowerCase().includes(qq))
        : true;
      return okCat && okQ;
    });
  }, [items, q, cat]);

  return (
    <div className="container">
      <div className="grid">
        <div className="col-12 card" style={{ padding: 18 }}>
          <h1 className="h2">Меню</h1>
          <p className="muted">Выберите блюда и добавьте в корзину. Цены указаны в рублях.</p>

          <div className="grid" style={{ marginTop: 10 }}>
            <div className="col-6">
              <input className="input" placeholder="Поиск: хумус, фалафель, табуле..." value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <div className="col-6">
              <select className="input" value={cat} onChange={e => setCat(e.target.value)}>
                <option value="">Все категории</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {loading && <div className="notice" style={{ marginTop: 12 }}>Загрузка меню...</div>}
          {error && <div className="notice" style={{ marginTop: 12, borderStyle: "solid" }}>{error}</div>}
        </div>

        <div className="col-12">
          <div className="grid">
            {filtered.map(d => (
              <div className="col-3" key={d.id}>
                <div className="card dish">
                  <img src={d.image_url} alt={d.name_ru} />
                  <div className="dish-body">
                    <div className="badge">{d.category_ru}</div>
                    <div style={{ display: "grid", gap: 4 }}>
                      <strong>{d.name_ru}</strong>
                      <span className="muted" style={{ fontSize: 13 }}>{d.description_ru}</span>
                    </div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="price">{d.price_rub} ₽</span>
                      <button className="btn btn-primary" onClick={() => add(d)}>В корзину</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!loading && !error && filtered.length === 0 && (
              <div className="col-12">
                <div className="notice">Ничего не найдено. Попробуйте изменить запрос или категорию.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}
