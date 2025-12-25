import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Protected from "./components/Protected.jsx";

import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={
          <Protected><Checkout /></Protected>
        } />

        <Route path="/orders" element={
          <Protected><Orders /></Protected>
        } />
        <Route path="/orders/:id" element={
          <Protected><OrderDetails /></Protected>
        } />

        <Route path="/profile" element={
          <Protected><Profile /></Protected>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<div className="container"><div className="notice">Страница не найдена</div></div>} />
      </Routes>
    </>
  );
}
