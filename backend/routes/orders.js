import express from "express";
import { all, get, run } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) return "Корзина пуста";
  for (const it of items) {
    const dishId = Number(it?.dishId);
    const qty = Number(it?.qty);
    if (!Number.isFinite(dishId) || dishId <= 0) return "Некорректный dishId";
    if (!Number.isFinite(qty) || qty <= 0 || qty > 50) return "Некорректное количество";
  }
  return null;
}

export function ordersRoutes(db) {
  const router = express.Router();

  router.post("/", requireAuth, async (req, res) => {
    const { items, paymentMethod, address, phone, comment } = req.body || {};
    const err = validateItems(items);
    if (err) return res.status(400).json({ error: err });

    const pm = String(paymentMethod || "").toLowerCase();
    if (!["cash", "card"].includes(pm)) return res.status(400).json({ error: "Выберите оплату: наличные или карта" });

    if (!address || !phone) return res.status(400).json({ error: "Введите адрес и телефон" });

    // Compute totals and validate dish existence
    const dishIds = items.map(i => Number(i.dishId));
    const placeholders = dishIds.map(() => "?").join(",");
    const dishes = await all(
      db,
      `SELECT id, price_rub FROM dishes WHERE id IN (${placeholders})`,
      dishIds
    );
    if (dishes.length !== new Set(dishIds).size) return res.status(400).json({ error: "В корзине есть неизвестные блюда" });

    const priceMap = new Map(dishes.map(d => [d.id, d.price_rub]));
    const total = items.reduce((sum, it) => sum + priceMap.get(Number(it.dishId)) * Number(it.qty), 0);

    const orderRes = await run(
      db,
      `INSERT INTO orders (user_id, status_ru, payment_method, address, phone, comment, total_rub, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [req.user.userId, "Новый", pm, String(address), String(phone), String(comment || ""), total]
    );

    for (const it of items) {
      await run(
        db,
        `INSERT INTO order_items (order_id, dish_id, quantity, price_rub)
         VALUES (?, ?, ?, ?)`,
        [orderRes.lastID, Number(it.dishId), Number(it.qty), priceMap.get(Number(it.dishId))]
      );
    }

    res.json({ orderId: orderRes.lastID });
  });

  router.get("/", requireAuth, async (req, res) => {
    const rows = await all(
      db,
      `SELECT id, status_ru, payment_method, total_rub, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY datetime(created_at) DESC`,
      [req.user.userId]
    );
    res.json({ items: rows });
  });

  router.get("/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Некорректный id" });

    const order = await get(
      db,
      `SELECT id, status_ru, payment_method, address, phone, comment, total_rub, created_at
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [id, req.user.userId]
    );
    if (!order) return res.status(404).json({ error: "Заказ не найден" });

    const items = await all(
      db,
      `SELECT oi.id, oi.quantity, oi.price_rub, d.name_ru, d.image_url
       FROM order_items oi
       JOIN dishes d ON d.id = oi.dish_id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({ order, items });
  });

  return router;
}
