import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { get, run } from "../db.js";

export function authRoutes(db) {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Заполните имя, email и пароль" });
    }
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await get(db, "SELECT id FROM users WHERE email = ?", [normalizedEmail]);
    if (existing) return res.status(409).json({ error: "Пользователь уже существует" });

    const hash = await bcrypt.hash(String(password), 10);
    const result = await run(
      db,
      "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, datetime('now'))",
      [String(name).trim(), normalizedEmail, hash]
    );

    const token = jwt.sign(
      { userId: result.lastID, email: normalizedEmail, name: String(name).trim() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: result.lastID, name: String(name).trim(), email: normalizedEmail } });
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Введите email и пароль" });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await get(db, "SELECT id, name, email, password_hash FROM users WHERE email = ?", [normalizedEmail]);
    if (!user) return res.status(401).json({ error: "Неверный email или пароль" });

    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) return res.status(401).json({ error: "Неверный email или пароль" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });

  return router;
}
