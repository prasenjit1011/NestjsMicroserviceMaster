```md
# 🚀 Revest E-Commerce Microservices System

A scalable **microservices-based e-commerce platform** built using **NestJS, gRPC, Prisma ORM, PostgreSQL (Neon), API Gateway architecture**, along with a **Next.js frontend** and a **dynamic form system**.

---

## 🧩 Architecture Overview

This system follows a **microservices architecture** using **gRPC for inter-service communication**.

### 🔷 Services

- **API Gateway (NestJS)**
  - Single entry point for all client requests
  - Handles authentication, routing, and aggregation
  - Communicates with microservices via gRPC

- **Item Service (NestJS + gRPC Server)**
  - Handles Item CRUD operations
  - Uses Prisma ORM with PostgreSQL (Neon)

- **Order Service (NestJS + gRPC Server)**
  - Handles Order CRUD operations
  - Validates items and manages order lifecycle via gRPC

- **PostgreSQL (Neon Cloud)**
  - Serverless PostgreSQL database
  - Used by Item and Order services via Prisma ORM

- **Frontend (Next.js)**
  - E-commerce UI
  - Consumes API Gateway REST APIs

- **Dynamic Form System**
  - JSON-based dynamic form builder

---

## 🏗️ Final Architecture Flow

```

Frontend (Next.js)
│
▼
API Gateway (NestJS REST API)
│
▼
gRPC Communication Layer (HTTP/2)
│
┌───────────────────┬────────────────────┐
│                   │                    │
▼                   ▼                    ▼
Item Service     Order Service      Auth Module
(NestJS)          (NestJS)            (JWT)
│                   │
▼                   ▼
PostgreSQL (Neon DB) + Prisma ORM

````

---

## ⚙️ Tech Stack

- NestJS 10
- gRPC (HTTP/2 + Protobuf)
- Prisma ORM
- PostgreSQL (Neon.tech)
- Next.js (React)
- JWT Authentication
- Swagger API Documentation
- ESLint + Prettier + Jest

---

## 📦 Clone Repositories

```bash
git clone https://github.com/prasenjit1011/revest_dynamic_form.git revest_dynamic_form

git clone https://github.com/prasenjit1011/revest_ecom_frontend.git revest_ecom_frontend

git clone -b api-gateway --single-branch https://github.com/prasenjit1011/revest_ecom_backend.git revest_ecom_api_gateway

git clone -b item-service --single-branch https://github.com/prasenjit1011/revest_ecom_backend.git revest_ecom_item_service

git clone -b order-service --single-branch https://github.com/prasenjit1011/revest_ecom_backend.git revest_ecom_order_service
````

---

## ▶️ How to Run Locally

### 1️⃣ Dynamic Form System

```bash
cd revest_dynamic_form
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

### 2️⃣ Item Service

```bash
cd revest_ecom_item_service
npm install
npx prisma generate
npm run start:dev
```

---

### 3️⃣ Order Service

```bash
cd revest_ecom_order_service
npm install
npx prisma generate
npm run start:dev
```

---

### 4️⃣ API Gateway

```bash
cd revest_ecom_api_gateway
npm install
npm run start:dev
```

---

### 5️⃣ Frontend (Next.js)

```bash
cd revest_ecom_frontend
npm install
npm run dev
```

---

## 🌐 Access URLs

| Service          | URL                                                      |
| ---------------- | -------------------------------------------------------- |
| API Swagger Docs | [http://localhost:3001/docs](http://localhost:3001/docs) |
| Frontend         | [http://localhost:5173/](http://localhost:5173/)         |
| Dynamic Form     | [http://localhost:3000/](http://localhost:3000/)         |

---

## 📡 gRPC Communication Flow

* API Gateway → Item Service
* API Gateway → Order Service
* Order Service → Item Service (validation / stock check)

All services communicate using:

* Protocol Buffers (`.proto`)
* HTTP/2 gRPC transport

---

## 🗄️ Database Setup (Neon + Prisma)

Each service uses Prisma ORM with Neon PostgreSQL.

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 📚 API Documentation

Swagger UI:

```
http://localhost:3001/docs
```

API test files:

```
revest_ecom_api_gateway/api/
```

Includes:

* item.api.http
* order.api.http
* auth.api.http

---

## 🔐 Features

* JWT Authentication
* Item CRUD
* Order management
* Microservices architecture with gRPC
* Central API Gateway
* Prisma ORM integration
* PostgreSQL (Neon)
* Swagger API documentation
* Scalable NestJS design

---

## 📌 Highlights

* ⚡ High-performance gRPC communication
* 🧩 Fully decoupled microservices
* ☁️ Cloud-ready architecture (Neon PostgreSQL)
* 🔐 Secure JWT authentication
* 📦 Clean modular backend design

---

## 🧑‍💻 Author

**Prasenjit**
Full Stack / Backend Engineer
NestJS | gRPC | Microservices | Cloud Architecture

---

## 📄 License

This project is for learning and development purposes.

```
```
