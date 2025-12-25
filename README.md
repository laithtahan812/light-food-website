# ЛАЙТ FOOD — Полный сайт ресторана (демо)

Это готовый учебный шаблон сайта ресторана ливанской кухни в России (интерфейс на русском):

- Регистрация / Вход (JWT)
- Меню (много блюд, категории, поиск)
- Корзина
- Оформление заказа
- Оплата: наличные / карта (демо)
- История заказов + детали заказа
- Профиль
- Тёмная / светлая тема

## Запуск (2 терминала)

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:4000

## Где менять контент
- Меню/блюда: `backend/seed.js` (цены в рублях)
- Фото блюд: замените `frontend/public/images/placeholder.svg` на реальные изображения и обновите `image_url` в seed.
