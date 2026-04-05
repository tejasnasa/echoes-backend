# ⚙️ Echoes Backend Server

<div align="center">

**A robust, highly-optimized backend service built with Node.js, Express, PostgreSQL, and Drizzle ORM powering complex conversational trees.**

[GitHub](https://github.com/tejasnasa/echoes-backend) · [Frontend Repo](../echoes) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture)

*Note: No live link provided for backend API.*

</div>

---

## ✨ Features

### 🏗️ Scalable REST Architecture
- **API Suite** — Designed and implemented 35+ RESTful endpoints managing a comprehensive suite of user flows.
- **High-Performance Data Modeling** — Architected an optimized database schema using PostgreSQL to retrieve deep conversational threads without performance degradation.

### 🛡️ Secure Authentication Pipeline
- **Stateless Tokens** — Highly secure session management using HTTP-only cookies and JWT (jsonwebtoken).
- **Password Hashes** — Secure credential encryption via bcrypt hashing.
- **Boundary Validation** — Employed Zod for foolproof request parsing to eliminate malformed payloads.

### 🤖 GPT-5 Content Moderation
- **Event-driven Intelligence** — A dedicated Express controller securely interfaces with GPT-5 to instantly analyze reported posts for community guideline adherence.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | Drizzle ORM |
| **Auth** | JWT + bcrypt |
| **Validation** | Zod |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation & Setup

```bash
# Clone and install
git clone https://github.com/tejasnasa/echoes-backend.git
cd echoes-backend
npm install

# Setup your .env file with DATABASE_URL, JWT_SECRET
cp .env.example .env

# Run database migrations (via drizzle-kit)
npm run db:push

# Start development server
npm run dev
```

---


<div align="center">

**Built with ❤️ by [Tejas](https://github.com/tejasnasa)**

</div>
