# 🛒 E-Commerce Polyglot Microservices Backend

This repository contains the decoupled, polyglot backend microservices architecture for the E-Commerce platform. Each microservice is completely isolated with its own runtime, dependencies, database connection, and domain business logic.

---

## 🏛️ System Architecture

| Service | Technology | Port | Database Type | Default Database Name |
|:---|:---|:---|:---|:---|
| **Auth & User Service** | Node.js (Express 5) | `5001` | MongoDB | `ecommerce_auth_db` |
| **Product & Search Service** | Python 3.11+ (FastAPI) | `5002` | MongoDB | `ecommerce_products_db` |
| **Payment Service** | C# (.NET 8/9 Web API) | `5003` | SQLite / Relational | `payments.db` |
| **Cart Service** | Node.js (Express) | `5004` | MongoDB | `ecommerce_cart_db` |
| **Order Service** | Node.js (Express) | `5005` | MongoDB | `ecommerce_orders_db` |

---

## 📁 Repository Structure

```text
ecommerce-backend/
├── auth-user-service/          # Port 5001 - User management, registration, login & JWT
├── product-search-service/     # Port 5002 - Product catalog, regex search & categories
├── payment-service/            # Port 5003 - Simulated payment processor with SQLite ledger
├── cart-service/               # Port 5004 - Shopping cart with authoritative product pricing
├── order-service/              # Port 5005 - Order snapshots, payment validation & idempotency
└── DEVOPS_HANDOVER.md          # Technical specifications and port requirements for DevOps
```

---

## 🚀 How to Run the Services Locally

### 1. Auth & User Service (Node.js - Port 5001)
```bash
cd auth-user-service
npm install
npm start
```

### 2. Product & Search Service (Python FastAPI - Port 5002)
```bash
cd product-search-service
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 5002
```

### 3. Payment Service (C# .NET - Port 5003)
```bash
cd payment-service
dotnet build
dotnet run -f net9.0
```

### 4. Cart Service (Node.js - Port 5004)
```bash
cd cart-service
npm install
npm start
```

### 5. Order Service (Node.js - Port 5005)
```bash
cd order-service
npm install
npm start
```

---

## 🔗 Inter-Service REST Flow

* **Cart Service ➔ Product Service (`:5002`):** Validates product existence, stock availability, and retrieves authoritative prices before adding to cart.
* **Order Service ➔ Product Service (`:5002`):** Verifies inventory stock and locks in trusted price snapshot at purchase time.
* **Order Service ➔ Payment Service (`:5003`):** Submits synchronous payment requests (`POST /api/payment/process`). Orders are only marked as `paid` if the payment processor returns status `Approved`.
* **Order Service ➔ Cart Service (`:5004`):** Retrieves the customer's cart and empties it upon successful payment.

---

## 🩺 Health Check Probes

All microservices implement standard health check endpoints:
* `GET http://localhost:5001/health`
* `GET http://localhost:5002/health`
* `GET http://localhost:5003/health`
* `GET http://localhost:5004/health`
* `GET http://localhost:5005/health`
