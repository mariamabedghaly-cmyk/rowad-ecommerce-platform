# 🛍️ Rowad Store E-Commerce Frontend

An online storefront built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**, designed to seamlessly integrate with a **Polyglot Microservices** backend.

---

## 🏛️ Integrated Microservices Architecture

The frontend connects directly to each dedicated domain microservice via `src/api/client.ts`:

| Domain | Backend Service | Tech Stack | Port | Endpoint Mappings |
|:---|:---|:---|:---|:---|
| **Authentication & Profile** | Auth & User Service | Node.js / Express | `5001` | `/api/auth/register`, `/api/auth/login`, `/api/users/profile` |
| **Catalog & Search** | Product & Search Service | Python / FastAPI | `5002` | `/api/products`, `/api/categories`, search queries |
| **Payments** | Payment Service | C# / ASP.NET Core | `5003` | `/api/payment/process` |
| **Shopping Cart** | Cart Service | Node.js / Express | `5004` | `/api/cart`, item additions, quantity updates |
| **Orders & Checkout** | Order Service | Node.js / Express | `5005` | `/api/orders`, shipping address with **Country**, checkout |

---

## ✨ Key Features

* **Dynamic Product Catalog:** Live product cards with real-time stock and prices fetched from the FastAPI product microservice.
* **Authentication Flow:** User registration and login with JWT stored in `localStorage` and reactive UI header showing logged-in user with sign-out capability.
* **Cart Management:** Persistent shopping cart with dynamic calculations and authoritative backend totals.
* **Shipping & Country Selector:** Full checkout address form including mandatory **Country** selection integrated into the order creation payload.
* **Instant Order Confirmation:** Post-checkout confirmation card displaying backend Order ID, simulated Transaction ID (`TXN-ID`), delivery country, and approved status.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Default ports point to local microservices:
```env
VITE_AUTH_SERVICE_URL=http://localhost:5001
VITE_PRODUCT_SERVICE_URL=http://localhost:5002
VITE_PAYMENT_SERVICE_URL=http://localhost:5003
VITE_CART_SERVICE_URL=http://localhost:5004
VITE_ORDER_SERVICE_URL=http://localhost:5005
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates production build in `dist/`.
