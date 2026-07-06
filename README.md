
## 🧩 System Architecture Overview – Item–Order CRUD Microservices System

A scalable **microservices-based backend system** built using **NestJS, gRPC, Prisma ORM, PostgreSQL (Neon), and API Gateway architecture**, along with a **Next.js frontend**

This project demonstrates a real-world **microservices architecture with gRPC-based service-to-service communication**.

The system is designed using a **microservices-first approach**, where each service is independently deployable and communicates via **gRPC (HTTP/2 + Protobuf)**.


## 🏗️ System Architecture Flow

```
                       ┌──────────────────────────────┐
                       │       Client Layer           │
                       │   (Next.js Frontend UI)     │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
            ┌────────────────────────────────────────────┐
            │        API Gateway (NestJS REST)          │
            │────────────────────────────────────────────│
            │ • JWT Authentication Guard                 │
            │ • Request Validation                      │
            │ • Routing & Aggregation                   │
            │ • gRPC Client Layer                       │
            └──────────────┬─────────────────┬──────────┘
                           │                 │
                           │                 │
           ┌───────────────▼───────┐ ┌──────▼────────────────┐
           │   Item Service        │ │   Order Service       │
           │ (NestJS + gRPC)       │ │ (NestJS + gRPC)       │
           │───────────────────────│ │───────────────────────│
           │ • Item CRUD           │ │ • Order CRUD          │
           │ • Inventory Control   │ │ • Order Workflow      │
           │ • Business Logic      │ │ • Stock Validation    │
           └───────────────┬───────┘ └───────────┬──────────┘
                           │                     │
                           └──────────┬──────────┘
                                      │
                                      ▼
                ┌────────────────────────────────────────┐
                │        Shared Auth Module              │
                │        (JWT Strategy Service)         │
                └────────────────────┬───────────────────┘
                                     │
                                     ▼
                ┌────────────────────────────────────────┐
                │   Data Layer (Neon PostgreSQL DB)     │
                │   Prisma ORM (Type-safe DB access)    │
                └────────────────────────────────────────┘
---

## 🚀 Tech Stack

- **Backend Framework:** NestJS 10
- **Microservices Communication:** gRPC (HTTP/2 + Protocol Buffers)
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon.tech)
- **Frontend:** Next.js (React)
- **Authentication:** JWT (Token-based auth)
- **API Documentation:** Swagger (OpenAPI)
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest

---



### 🔷 Core Services

- **API Gateway (NestJS)**
  - Single entry point for all client applications
  - Handles authentication, request routing, and aggregation
  - Communicates with microservices using gRPC

- **Item Service (NestJS + gRPC Server)**
  - Manages product/item lifecycle (CRUD operations)
  - Uses Prisma ORM with PostgreSQL (Neon)

- **Order Service (NestJS + gRPC Server)**
  - Handles order creation and order management
  - Performs validation via Item Service using gRPC

- **PostgreSQL (Neon Cloud Database)**
  - Serverless PostgreSQL database
  - Shared via Prisma ORM across services

- **Frontend (Next.js)**
  - E-commerce UI for users
  - Consumes API Gateway REST endpoints

- **Dynamic Form System**
  - JSON-driven dynamic form builder application

---

## 📦 Clone All Repositories

```bash
git clone https://github.com/prasenjit1011/revest_dynamic_form.git revest_dynamic_form

git clone https://github.com/prasenjit1011/revest_ecom_frontend.git revest_ecom_frontend

git clone -b api-gateway --single-branch https://github.com/prasenjit1011/revest_ecom_backend.git revest_ecom_api_gateway

git clone -b item-service --single-branch https://github.com/prasenjit1011/revest_ecom_backend.git revest_ecom_item_service

git clone -b order-service --single-branch https://github.com/prasenjit1011/revest_ecom_backend.git revest_ecom_order_service
````

---


## ▶️ How to Run Locally

### 1️⃣ Start Dynamic Form System

## ⚙️ 
```bash
cd revest_dynamic_form
npm install
npm run dev
```

👉 Open:

```
http://localhost:3000
```

---

### 2️⃣ Start Item Service

```bash
cd revest_ecom_item_service
npm install
npx prisma generate
npm run start:dev
```

---

### 3️⃣ Start Order Service

```bash
cd revest_ecom_order_service
npm install
npx prisma generate
npm run start:dev
```

---

### 4️⃣ Start API Gateway

```bash
cd revest_ecom_api_gateway
npm install
npm run start:dev
```

---

### 5️⃣ Start Frontend (Next.js)

```bash
cd revest_ecom_frontend
npm install
npm run dev
```

---

## 🌐 Application URLs

| Service                     | URL                                                      |
| --------------------------- | -------------------------------------------------------- |
| API Documentation (Swagger) | [http://localhost:3001/docs](http://localhost:3001/docs) |
| Frontend (E-Commerce UI)    | [http://localhost:5173/](http://localhost:5173/)         |
| Dynamic Form System         | [http://localhost:3000/](http://localhost:3000/)         |

---

## 📡 gRPC Communication Flow

The services communicate using **gRPC over HTTP/2**:

* API Gateway → Item Service (CRUD operations)
* API Gateway → Order Service (Order handling)
* Order Service → Item Service (validation / stock checks)

---

## 🗄️ Database Layer (Neon + Prisma)

Each service uses **Prisma ORM** connected to a **Neon PostgreSQL serverless database**.

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev
```

---

## 📚 API Documentation

Swagger UI:

```
http://localhost:3001/docs
```

API Testing Files:

```
revest_ecom_api_gateway/api/
```

Includes:

* item.api.http
* order.api.http
* auth.api.http

---

## 🔐 Key Features

* Secure JWT Authentication
* Item CRUD Management
* Order Processing System
* Microservices architecture using gRPC
* Central API Gateway design
* Prisma ORM integration
* Neon PostgreSQL cloud database
* Swagger API documentation
* Modular and scalable NestJS architecture

---

## 📌 Key Highlights

* ⚡ High-performance gRPC-based communication
* 🧩 Fully decoupled microservices design
* ☁️ Cloud-ready architecture using Neon DB
* 🔐 Secure authentication system (JWT)
* 📦 Clean, maintainable NestJS codebase

---

## 🧑‍💻 Author

**Prasenjit**
Full Stack / Backend Engineer
Specialized in NestJS, Microservices, gRPC, and Cloud Architecture

---

## 📄 License

This project is intended for educational and development purposes only.

```

---

If you want next upgrade, I can make it even more powerful:

- 🔥 :contentReference[oaicite:0]{index=0}
- 🧠 :contentReference[oaicite:1]{index=1}
- 🐳 :contentReference[oaicite:2]{index=2}
- ☁️ :contentReference[oaicite:3]{index=3}

Just tell me 👍
```
