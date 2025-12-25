import express from "express";
import { all, get } from "../db.js";

export function menuRoutes(db) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    const rows = await all(
      db,
      `SELECT id, name_ru, description_ru, category_ru, price_rub, image_url
       FROM dishes
       ORDER BY category_ru, name_ru`
    );
    res.json({ items: rows });
  });

  router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Некорректный id" });

    const row = await get(
      db,
      `SELECT id, name_ru, description_ru, category_ru, price_rub, image_url
       FROM dishes WHERE id = ?`,
      [id]
    );
    if (!row) return res.status(404).json({ error: "Блюдо не найдено" });

    res.json({ item: row });
  });

  return router;
}
