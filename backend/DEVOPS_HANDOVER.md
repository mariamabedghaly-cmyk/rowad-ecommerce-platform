# DevOps Handover Specification: Polyglot E-Commerce Microservices

**From:** Senior Backend Architect  
**To:** DevOps / Cloud Engineering Team  
**Subject:** Microservices Inventory, Target Ports, Database Isolation, and Network Contracts  

---

## 1. System Topology & Service Inventory

The complete backend is decomposed into 5 autonomous, polyglot microservices, each with its own independent database connection and business logic:

| Service | Directory | Tech Stack | Port | Database Type & Default Name | Health Check |
|:---|:---|:---|:---|:---|:---|
| **Auth & User** | `auth-user-service/` | Node.js (Express 5) | `5001` | MongoDB (`ecommerce_auth_db`) | `GET /health` |
| **Product & Search** | `product-search-service/` | Python 3.11+ (FastAPI) | `5002` | MongoDB (`ecommerce_products_db`) | `GET /health` |
| **Payment Service** | `payment-service/` | C# (.NET 8/9 Web API) | `5003` | SQLite / Relational (`payments.db`) | `GET /health` |
| **Cart Service** | `cart-service/` | Node.js (Express) | `5004` | MongoDB (`ecommerce_cart_db`) | `GET /health` |
| **Order Service** | `order-service/` | Node.js (Express) | `5005` | MongoDB (`ecommerce_orders_db`) | `GET /health` |

---

## 2. Service Communication Contracts (Synchronous REST)

The microservices communicate internally over REST:

```
[Client / API Gateway]
    │
    ├──> Port 5001 : Auth & User Service (/api/auth, /api/users)
    ├──> Port 5002 : Product & Search Service (/api/products, /api/categories)
    ├──> Port 5003 : Payment Service (/api/payment)
    ├──> Port 5004 : Cart Service (/api/cart)
    └──> Port 5005 : Order Service (/api/orders)
             │
             ├──(Validate Stock & Price)──> [Product Service :5002]
             ├──(Process Payment)─────────> [Payment Service :5003]
             └──(Fetch & Clear Cart)──────> [Cart Service :5004]
```

### Key Request Headers:
* `Authorization`: `Bearer <jwt_token>` (validated independently by services)
* `X-Correlation-ID`: Forwarded across all downstream HTTP requests for distributed tracing.
* `X-Idempotency-Key`: Checked by Order Service to prevent duplicate order placements.

---

## 3. Environment Variables & Runtime Specifications

### Service A: Auth & User Service (`auth-user-service/`)
* **Port:** `5001`
* **Startup Command:** `node server.js`
* **Required Env:**
  * `PORT=5001`
  * `MONGO_URI=mongodb://<host>:27017/ecommerce_auth_db`
  * `JWT_SECRET=<strong_jwt_secret>`
  * `JWT_EXPIRES_IN=30d`

### Service B: Product & Search Service (`product-search-service/`)
* **Port:** `5002`
* **Startup Command:** `uvicorn app.main:app --host 0.0.0.0 --port 5002`
* **Required Env:**
  * `PORT=5002`
  * `HOST=0.0.0.0`
  * `MONGO_URI=mongodb://<host>:27017`
  * `DB_NAME=ecommerce_products_db`

### Service C: Payment Service (`payment-service/`)
* **Port:** `5003`
* **Startup Command:** `dotnet bin/Debug/net9.0/PaymentService.dll` (or `net8.0`)
* **Required Env:**
  * `ASPNETCORE_URLS=http://+:5003`
  * `ConnectionStrings__DefaultConnection=Data Source=/app/data/payments.db`
  * `PaymentGateway__AutoApproveThreshold=10000.00`
* **Volume Mount:** Mount persistent volume at `/app/data` to retain `payments.db`.

### Service D: Cart Service (`cart-service/`)
* **Port:** `5004`
* **Startup Command:** `node server.js`
* **Required Env:**
  * `PORT=5004`
  * `MONGO_URI=mongodb://<host>:27017/ecommerce_cart_db`
  * `PRODUCT_SERVICE_URL=http://<product-service-host>:5002`
  * `JWT_SECRET=<strong_jwt_secret>`

### Service E: Order Service (`order-service/`)
* **Port:** `5005`
* **Startup Command:** `node server.js`
* **Required Env:**
  * `PORT=5005`
  * `MONGO_URI=mongodb://<host>:27017/ecommerce_orders_db`
  * `PRODUCT_SERVICE_URL=http://<product-service-host>:5002`
  * `PAYMENT_SERVICE_URL=http://<payment-service-host>:5003`
  * `CART_SERVICE_URL=http://<cart-service-host>:5004`
  * `JWT_SECRET=<strong_jwt_secret>`

---

## 4. Suggested Reverse Proxy / Ingress Routes (For API Gateway)

* `/api/auth/` ➔ `http://auth-user-service:5001/api/auth/`
* `/api/users/` ➔ `http://auth-user-service:5001/api/users/`
* `/api/products/` ➔ `http://product-search-service:5002/api/products/`
* `/api/categories/` ➔ `http://product-search-service:5002/api/categories/`
* `/api/payment/` ➔ `http://payment-service:5003/api/payment/`
* `/api/cart/` ➔ `http://cart-service:5004/api/cart/`
* `/api/orders/` ➔ `http://order-service:5005/api/orders/`
