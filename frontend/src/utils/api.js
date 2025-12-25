const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function http(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export async function apiMeHealth() {
  return http("/api/health");
}

export async function apiRegister(payload) {
  return http("/api/auth/register", { method: "POST", body: payload });
}

export async function apiLogin(payload) {
  return http("/api/auth/login", { method: "POST", body: payload });
}

export async function apiMenu() {
  return http("/api/menu");
}

export async function apiCreateOrder(payload, token) {
  return http("/api/orders", { method: "POST", body: payload, token });
}

export async function apiOrders(token) {
  return http("/api/orders", { token });
}

export async function apiOrderById(orderId, token) {
  return http(`/api/orders/${orderId}`, { token });
}
