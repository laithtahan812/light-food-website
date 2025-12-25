import dotenv from "dotenv";
dotenv.config();

import { openDb, run } from "./db.js";

const dbFile = process.env.DB_FILE || "./data/app.db";
const db = openDb(dbFile);

async function main() {
  await run(db, `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await run(db, `
    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ru TEXT NOT NULL,
      description_ru TEXT NOT NULL,
      category_ru TEXT NOT NULL,
      price_rub INTEGER NOT NULL,
      image_url TEXT NOT NULL
    );
  `);

  await run(db, `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status_ru TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      comment TEXT NOT NULL,
      total_rub INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await run(db, `
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      dish_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_rub INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE RESTRICT
    );
  `);

  // Reset dishes for repeatable seeding
  await run(db, "DELETE FROM order_items");
  await run(db, "DELETE FROM orders");
  await run(db, "DELETE FROM dishes");

  // Helper to build image path served by frontend/public
  const img = (file) => `/images/dishes/${file}`;

  const dishes = [
    // Закуски и мезе
    ["Хумус классический", "Нут, тахини, лимон, оливковое масло. Подаётся с лепёшкой.", "Мезе", 320, img("hummus-classic.jpg")],
    ["Хумус с мясом", "Хумус с пряной говядиной и кедровыми орехами.", "Мезе", 420, img("hummus-meat.jpg")],
    ["Баба гануш", "Запечённый баклажан, тахини, чеснок, лимон.", "Мезе", 350, img("baba-ganoush.jpg")],
    ["Мтабаль", "Крем из баклажана с тахини и йогуртом.", "Мезе", 360, img("moutabal.jpg")],
    ["Мухаммара", "Паста из печёного перца с грецким орехом и гранатовым сиропом.", "Мезе", 390, img("muhammara.jpg")],
    ["Лабне", "Густой йогурт с оливковым маслом и заатаром.", "Мезе", 330, img("labneh.jpg")],
    ["Фаттуш", "Салат из овощей с хрустящим лавашом и сумахом.", "Салаты", 420, img("fattoush.jpg")],
    ["Табуле", "Петрушка, булгур, томаты, мята, лимон.", "Салаты", 440, img("tabbouleh.jpg")],
    ["Варак энаб", "Виноградные листья с рисом и травами (долма по-ливански).", "Мезе", 460, img("warak-enab.jpg")],
    ["Киббе найе", "Тартар из говядины с булгуром и специями (по запросу).", "Мезе", 590, img("kibbeh-nayeh.jpg")],

    // Горячее
    ["Шаурма куриная", "Курица, соус, овощи, лаваш. Можно острая.", "Сэндвичи", 420, img("shawarma-chicken.jpg")],
    ["Шаурма говяжья", "Говядина, соус тахини, овощи, лаваш.", "Сэндвичи", 490, img("shawarma-beef.jpg")],
    ["Шиш-таук", "Куриные шашлычки на гриле, маринад с чесноком и лимоном.", "Гриль", 690, img("shish-tawook.jpg")],
    ["Кебаб кофта", "Говядина/баранина с травами на мангале.", "Гриль", 720, img("kofta-kebab.jpg")],
    ["Аришта (ливанская лапша)", "Домашняя лапша с курицей и ароматными специями.", "Горячее", 610, img("arishta.jpg")],
    ["Мансаф по-ливански", "Рис с мясом и пряным соусом, подача в арабском стиле.", "Горячее", 890, img("mansaf.jpg")],
    ["Фалафель (порция)", "Шарики из нута, хрустящие снаружи и нежные внутри.", "Вегетарианское", 390, img("falafel-plate.jpg")],
    ["Фалафель в лаваше", "Фалафель, овощи, тахини, маринованные огурчики.", "Сэндвичи", 420, img("falafel-wrap.jpg")],

    // Выпечка и пироги
    ["Мануше с заатаром", "Лепёшка с заатаром и оливковым маслом.", "Выпечка", 260, img("manoushe-zaatar.jpg")],
    ["Мануше с сыром", "Лепёшка с сырной начинкой.", "Выпечка", 320, img("manoushe-cheese.jpg")],
    ["Сфиха (ливанские мини-пироги)", "Открытые пироги с мясом и специями.", "Выпечка", 420, img("sfiha.jpg")],

    // Супы
    ["Шорбат адас", "Чечевичный суп с лимоном и специями.", "Супы", 340, img("shorbat-adas.jpg")],

    // Десерты
    ["Баклава ассорти", "Слоёная сладость с орехами и медовым сиропом.", "Десерты", 390, img("baklava-assorted.jpg")],
    ["Кнафе", "Тёплый десерт с сыром и сиропом из розовой воды.", "Десерты", 450, img("kunafa.jpg")],
    ["Маамуль", "Песочное печенье с финиками/орехами.", "Десерты", 320, img("maamoul.jpg")],

    // Напитки
    ["Айран", "Йогуртовый напиток, охлаждённый.", "Напитки", 180, img("ayran.jpg")],
    ["Чай с мятой", "Чёрный чай с свежей мятой.", "Напитки", 170, img("mint-tea.jpg")],
    ["Кофе по-арабски", "Крепкий кофе с кардамоном.", "Напитки", 220, img("arabic-coffee.jpg")],
    ["Лимонад гранатовый", "Домашний лимонад с гранатом.", "Напитки", 250, img("pomegranate-lemonade.jpg")]
  ];

  for (const d of dishes) {
    await run(
      db,
      "INSERT INTO dishes (name_ru, description_ru, category_ru, price_rub, image_url) VALUES (?, ?, ?, ?, ?)",
      d
    );
  }

  console.log("Seed done. Dishes inserted:", dishes.length);
  db.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
