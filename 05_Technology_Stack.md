> **GlowNest – AI-Powered Skincare & Beauty Platform** | PERN Stack (PostgreSQL, Express.js, React.js, Node.js, all TypeScript) | AI: Demo Mode (Phase 1)

# 5. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend framework** | React 18 + TypeScript | Component reuse, type safety |
| **Build tool** | Vite | Fast dev/build |
| **Styling** | Tailwind CSS | Rapid, consistent design tokens |
| **UI components** | shadcn/ui (Radix) | Accessible, customizable, premium look |
| **Animation** | Framer Motion | Smooth transitions |
| **Routing** | React Router v6 | Nested/lazy routes |
| **Data fetching** | TanStack Query + Axios | Caching, retries, loading/error states |
| **State** | Zustand | Lightweight UI/cart state |
| **Forms** | React Hook Form + Zod | Validation, DX |
| **Charts** | Recharts | Progress/compare charts |
| **Icons / Fonts** | Lucide, Google Fonts (Playfair Display + Inter) | Elegant brand typography |
| **Backend runtime** | Node.js 20 LTS | Stable, widely supported |
| **Backend framework** | Express.js + TypeScript | Requested PERN stack |
| **Database** | PostgreSQL 16 | Relational integrity for orders/users, JSONB/array flexibility, full-text/trigram search |
| **ORM / migrations** | Prisma | Type-safe queries, migrations, seeding |
| **Validation** | Zod | Shared validation approach client/server |
| **Auth** | JWT (jsonwebtoken/jose) + argon2 | Requested JWT auth |
| **Uploads / images** | multer + sharp | Validation, EXIF strip, resize |
| **Object storage** | Cloudflare R2 / S3 / Cloudinary | Off-server private storage |
| **Security middleware** | helmet, cors, express-rate-limit, hpp | Hardening |
| **Jobs** | node-cron (→ BullMQ + Redis if needed) | Reminders, cleanup |
| **Email** | Resend / Nodemailer | Reminders, resets, support |
| **Logging / monitoring** | pino, Sentry | Observability |
| **AI (Phase 1)** | **DemoProvider (clearly labeled sample data)** | No AI configured yet |
| **AI (later)** | Pluggable provider (vision API or CV model) via `AnalysisProvider` | Swap without touching the rest of the app |
| **Testing** | Vitest + React Testing Library, Supertest, Playwright (E2E) | Unit/integration/E2E |
| **Quality** | ESLint, Prettier, Husky + lint-staged, strict TS | Maintainability |
| **API docs** | OpenAPI/Swagger | Contract clarity |
| **CI/CD** | GitHub Actions | Automated checks and deploy |
| **Hosting** | Vercel (client), Render (API), Render/Neon (Postgres) | Per brief |
| **Local dev** | Docker Compose (Postgres), npm workspaces | Reproducible setup |

## 5.1 Change Log vs. Original Brief
| Original | Now |
|---|---|
| Python FastAPI | **Node.js + Express.js (TypeScript)** |
| MongoDB | **PostgreSQL (via Prisma)** |
| Skin analysis via CV model/API | **Demo mode first**, pluggable real provider later |
| React + TS, Tailwind, Shadcn, Recharts, JWT, Vercel/Render | Unchanged |
