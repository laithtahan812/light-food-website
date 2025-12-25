import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { openDb } from "./db.js";
import { authRoutes } from "./routes/auth.js";
import { menuRoutes } from "./routes/menu.js";
import { ordersRoutes } from "./routes/orders.js";

const app = express();

const port = Number(process.env.PORT || 4000);
const dbFile = process.env.DB_FILE || "./data/app.db";
const db = openDb(dbFile);

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes(db));
app.use("/api/menu", menuRoutes(db));
app.use("/api/orders", ordersRoutes(db));

app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(port, () => {
  console.log(`ЛАЙТ FOOD API running on http://localhost:${port}`);
});
