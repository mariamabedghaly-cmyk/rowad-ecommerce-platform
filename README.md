# 🛒 Rowad E-Commerce Platform (Full-Stack Monorepo)

A complete, production-ready E-Commerce system featuring a modern **React 19 Frontend** seamlessly integrated with an autonomous **Polyglot Microservices Backend** (Node.js Express, Python FastAPI, C# ASP.NET Core).

---

## 🏛️ System Architecture

```
[ Frontend: React 19 + TypeScript + Vite (:5173) ]
                      │
   ┌──────────────────┼──────────────────┬──────────────────┐
   ▼                  ▼                  ▼                  ▼
[ Auth Service ]  [ Product Service ]  [ Cart Service ]   [ Order Service ]
  Node.js :5001     Python :5002         Node.js :5004      Node.js :5005
        │                  │                   │                  │
        │                  │                   │         ┌────────┴────────┐
        ▼                  ▼                   ▼         ▼                 ▼
   (Auth DB)         (Products DB)         (Cart DB) [ Product :5002 ] [ Payment :5003 ]
                                                                             C# .NET
                                                                                │
                                                                                ▼
                                                                           (Ledger DB)
```

---

## 📁 Monorepo Structure

```text
rowad-ecommerce-platform/
├── backend/                        # Polyglot Microservices Backend
│   ├── auth-user-service/          # Port 5001 - Auth, User profile & JWT (Node.js)
│   ├── product-search-service/     # Port 5002 - Product catalog & search (Python FastAPI)
│   ├── payment-service/            # Port 5003 - Payment processing ledger (C# .NET)
│   ├── cart-service/               # Port 5004 - Shopping cart & pricing (Node.js)
│   ├── order-service/              # Port 5005 - Order placement & payment validation (Node.js)
│   ├── DEVOPS_HANDOVER.md          # Technical DevOps Handover Specification
│   └── README.md                   # Backend architecture documentation
│
├── frontend/                       # Storefront Web UI
│   ├── public/                     # Static assets & icons
│   ├── src/
│   │   ├── api/client.ts           # Typed REST client mapped to each microservice
│   │   ├── app/                    # Routes, App shell & central store Context
│   │   ├── components/             # Reusable UI components (Header, Notifications)
│   │   └── pages/                  # Home, Product, Cart, Auth, Checkout (with Country)
│   ├── .env.example                # Sample frontend environment config
│   ├── package.json                # React dependencies
│   ├── vite.config.ts              # Vite configuration
│   └── README.md                   # Frontend documentation
│
├── .gitignore                      # Monorepo git ignore rules
└── README.md                       # Root documentation
```

---

## ⚡ Quick Start: How to Run the Entire Platform

### 1. Run the Backend Microservices (5 Terminals or Services)

#### Auth & User Service (Port 5001):
```bash
cd backend/auth-user-service
npm install
npm start
```

#### Product & Search Service (Port 5002):
```bash
cd backend/product-search-service
python -m venv .venv
# Windows: .venv\Scripts\activate | Unix: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 5002
```

#### Payment Service (Port 5003):
```bash
cd backend/payment-service
dotnet run
```

#### Cart Service (Port 5004):
```bash
cd backend/cart-service
npm install
npm start
```

#### Order Service (Port 5005):
```bash
cd backend/order-service
npm install
npm start
```

---

### 2. Run the Frontend Storefront (Port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🩺 Microservices Health Probes

* **Auth Service:** `GET http://localhost:5001/health`
* **Product Service:** `GET http://localhost:5002/health`
* **Payment Service:** `GET http://localhost:5003/health`
* **Cart Service:** `GET http://localhost:5004/health`
* **Order Service:** `GET http://localhost:5005/health`
* **Interactive API Docs (FastAPI):** `http://localhost:5002/docs`

---

## 🤝 DevOps & Deployment

For containerization, Dockerfiles, Kubernetes, or deployment automation, refer to:  
👉 [`backend/DEVOPS_HANDOVER.md`](backend/DEVOPS_HANDOVER.md)
