# 🤖 WhatsApp AI SaaS Engine (Clean Architecture)

A production-ready, multi-tenant WhatsApp AI assistant built with Node.js, TypeScript, and OpenAI. Designed for scalability, this engine uses a queued messaging pipeline to handle high-volume traffic without timing out.

---

## 🚀 Key Features

- **Multi-Tenant Architecture**: Support multiple business accounts on a single server instance.
- **AI-Powered Conversations**: Integrated with OpenAI's GPT-4o for intelligent, context-aware responses.
- **Persistent Memory**: Stores full chat history in PostgreSQL, allowing for coherent multi-turn conversations.
- **Reliable Queuing (BullMQ/Redis)**: Offloads message processing to background workers to stay within Meta's strict 3-second webhook timeout.
- **Strict Type Safety**: 100% TypeScript with strict null checks and validated environment variables.
- **Clean Architecture**: Decoupled layers (Core, Infrastructure, Application, Interfaces) for maximum maintainability.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v20+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Caching & Queues**: Redis & BullMQ
- **AI**: OpenAI API
- **Communication**: WhatsApp Cloud API (Meta)
- **Validation**: Envalid & Zod

---

## 📁 Project Structure

```text
src/
├── core/             # Business Logic & Entities (Types, Interfaces)
├── application/      # Use Cases (Messaging Pipeline Orchestration)
├── infrastructure/   # External Tools (WhatsApp, OpenAI, DB, Queue, Workers)
├── interfaces/       # Entry points (Controllers, Webhook Handlers)
├── config/           # Environment validation & global constants
└── shared/           # Utility functions & helpers
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v20 or higher)
- **PostgreSQL** (Running instance)
- **Redis** (Running instance)
- **Ngrok** (For local webhook testing)

### 2. Environment Configuration
Create a `.env` file in the root directory and fill in your credentials:

```bash
PORT=3000
NODE_ENV=development

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_API_VERSION=v20.0

# OpenAI
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/whatsapp_bot
```

### 3. Database Migration
Initialize the database schema using Prisma:
```bash
npm run prisma:push
```

### 4. Seed Initial Account
Create your first business/tenant account in the database:
```bash
npm run seed
```

---

## 🏃 Running the Project

### Development Mode
Runs the server with `nodemon` and `ts-node` for real-time reloading:
```bash
npm run dev
```

### Production Build
Compiles TypeScript and runs the optimized JavaScript:
```bash
npm run build
npm start
```

---

## 📡 Webhook Configuration

1. **Expose Localhost**: Run `ngrok http 3000`.
2. **Meta Portal**: Go to your App Dashboard > WhatsApp > Configuration.
3. **Callback URL**: `https://your-ngrok-url.app/webhook`
4. **Verify Token**: Must match your `WHATSAPP_VERIFY_TOKEN` in `.env`.
5. **Webhooks Fields**: Click **Manage** and subscribe to `messages`.

---

## 🏗️ Architecture Flow

1. **Webhook**: Receives POST from Meta.
2. **Controller**: Validates payload and pushes message to **BullMQ (Redis)**.
3. **Queue**: Immediately returns `200 OK` to Meta (preventing timeouts).
4. **Worker**: Picks up the job and triggers the **Messaging Pipeline**.
5. **Repository**: Fetches Tenant data and User chat history from **PostgreSQL**.
6. **AI Service**: Sends history + new message to **OpenAI**.
7. **WhatsApp Service**: Sends AI-generated response back to the user via Meta Graph API.

---

## 🔒 Security & Reliability

- **Idempotency**: Message IDs are used as Job IDs in BullMQ to prevent duplicate processing.
- **Fail-Fast**: The app won't start if required environment variables are missing (via `envalid`).
- **Retries**: BullMQ is configured with exponential backoff for failed OpenAI/WhatsApp calls.

---

## 📜 License
ISC License - Feel free to use this for your own SaaS products!
