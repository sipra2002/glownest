> **GlowNest – AI-Powered Skincare & Beauty Platform** | PERN Stack (PostgreSQL, Express.js, React.js, Node.js, all TypeScript) | AI: Demo Mode (Phase 1)

# 2. Technical Architecture

## 2.1 High-Level Architecture

```mermaid
flowchart LR
    U[User Browser<br/>React + TS + Tailwind] -->|HTTPS REST/JSON| API[Express API<br/>Node.js + TS]
    API --> DB[(PostgreSQL)]
    API --> OBJ[(Object Storage<br/>S3-compatible / R2)]
    API --> AIP{{Analysis Provider Interface}}
    AIP --> DEMO[DemoProvider<br/>Phase 1]
    AIP -.future.-> REAL[Real AI Provider<br/>Vision API / CV model]
    API --> MAIL[Email Service<br/>Resend / SMTP]
    API --> JOBS[Scheduler / Queue<br/>node-cron or BullMQ]
```

## 2.2 Repository Structure (monorepo, separated packages)

```
glownest/
├── README.md
├── docs/                      # this document, ADRs
├── client/                    # React app (Vite + TS)
│   ├── public/
│   ├── src/
│   │   ├── app/               # router, providers, layout
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui primitives
│   │   │   ├── layout/        # Navbar, Footer, ThemeToggle
│   │   │   ├── product/       # ProductCard, ProductGrid, Filters
│   │   │   ├── analysis/      # Uploader, ConcernPicker, ScoreBar, ReportView
│   │   │   ├── routine/       # RoutineStep, RoutineTimeline
│   │   │   ├── dashboard/     # ProgressChart, CompareView
│   │   │   └── common/        # EmptyState, ErrorState, Skeletons
│   │   ├── features/          # feature modules (api hooks + slices)
│   │   │   ├── auth/ analysis/ quiz/ routine/ store/ cart/ wishlist/
│   │   │   ├── reviews/ blog/ orders/ profile/ reminders/ support/
│   │   ├── hooks/
│   │   ├── lib/               # axios client, utils, constants
│   │   ├── pages/             # Home, Analyze, Report, Quiz, Shop, Product,
│   │   │                      # Cart, Checkout, Dashboard, Blog, Contact, Privacy...
│   │   ├── styles/
│   │   └── types/
│   ├── .env.example
│   └── vite.config.ts
├── server/                    # Express API (TS)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts            # sample products, articles, testimonials
│   ├── src/
│   │   ├── index.ts           # server bootstrap
│   │   ├── app.ts             # express app, middleware
│   │   ├── config/            # env (zod-validated), constants
│   │   ├── routes/            # route definitions per module
│   │   ├── controllers/       # HTTP layer
│   │   ├── services/          # business logic
│   │   ├── repositories/      # DB access (Prisma)
│   │   ├── middleware/        # auth, validate, rateLimit, error, upload
│   │   ├── validators/        # zod schemas
│   │   ├── analysis/
│   │   │   ├── pipeline.ts
│   │   │   ├── validation.ts      # file/magic-bytes/quality checks
│   │   │   ├── preprocess.ts      # sharp: strip EXIF, resize, normalize
│   │   │   ├── scoring.ts         # normalize to 0–100, severity bands
│   │   │   ├── recommend.ts       # routine + product matching
│   │   │   └── providers/
│   │   │       ├── AnalysisProvider.ts   # interface
│   │   │       ├── DemoProvider.ts       # Phase 1
│   │   │       └── (ClaudeVisionProvider.ts etc. – later)
│   │   ├── jobs/              # reminders, image-retention cleanup
│   │   ├── utils/
│   │   └── types/
│   ├── tests/
│   └── .env.example
└── package.json               # npm workspaces
```

**Layering:** `route → middleware → controller → service → repository → DB`. Controllers never touch the DB; services never touch `req/res`.

## 2.3 Frontend Architecture
- **Build:** Vite + React 18 + TypeScript (strict).
- **Routing:** React Router v6 with lazy-loaded routes and protected-route wrapper.
- **Server state:** TanStack Query (caching, retries, loading/error states).
- **Client state:** Zustand (theme, cart drawer, UI); cart persisted to server for logged-in users, localStorage for guests.
- **Forms/validation:** React Hook Form + Zod (schemas shared in spirit with server).
- **UI:** Tailwind CSS + shadcn/ui + Radix; Framer Motion for animation; Lucide icons.
- **Charts:** Recharts (progress line chart, concern radar chart, compare bars).
- **Theming:** CSS variables for cream/blush/sage tokens; `class="dark"` strategy.
- **Accessibility:** semantic landmarks, focus management, aria labels on all icon buttons.

## 2.4 Backend Architecture
- **Runtime:** Node.js 20 LTS, Express 4/5, TypeScript.
- **ORM:** Prisma (type-safe, migrations) on PostgreSQL.
- **Validation:** Zod on all inputs (body, params, query).
- **Auth:** JWT access token (15 min) + rotating refresh token (7–30 days) in httpOnly cookie; `argon2` password hashing.
- **Uploads:** `multer` (memory storage, size/type limits) → validate → preprocess with `sharp` → store.
- **Logging:** pino + request IDs. **Errors:** central error handler with typed `AppError`.
- **Jobs:** `node-cron` (Phase 1) for reminders and image-retention cleanup; BullMQ + Redis if scale demands.
- **API docs:** OpenAPI/Swagger (generated from Zod via `zod-to-openapi`).

## 2.5 Database Design (PostgreSQL)

### ER Overview
```mermaid
erDiagram
    USERS ||--o| SKIN_PROFILES : has
    USERS ||--o{ CONSENTS : gives
    USERS ||--o{ SKIN_ANALYSES : owns
    SKIN_ANALYSES ||--o{ ANALYSIS_SCORES : contains
    SKIN_ANALYSES ||--o| UPLOADED_IMAGES : uses
    SKIN_ANALYSES ||--o| ROUTINES : generates
    ROUTINES ||--o{ ROUTINE_STEPS : has
    ROUTINE_STEPS }o--|| PRODUCTS : recommends
    USERS ||--o{ CARTS : has
    CARTS ||--o{ CART_ITEMS : contains
    USERS ||--o{ WISHLIST_ITEMS : saves
    USERS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ REVIEWS : receives
    PRODUCTS }o--|| CATEGORIES : belongs_to
    PRODUCTS ||--o{ PRODUCT_INGREDIENTS : lists
    USERS ||--o{ REMINDERS : sets
    ARTICLES }o--|| ARTICLE_CATEGORIES : belongs_to
    USERS ||--o{ SUPPORT_TICKETS : submits
```

### Core Tables (key columns)

| Table | Key columns |
|---|---|
| `users` | id (uuid PK), email (unique), password_hash, name, role (`user`/`admin`), email_verified, created_at, deleted_at |
| `refresh_tokens` | id, user_id FK, token_hash, expires_at, revoked_at, user_agent, ip |
| `skin_profiles` | user_id PK/FK, skin_type (`oily/dry/combination/normal/sensitive`), concerns (text[]), allergies (text[]), updated_at |
| `consents` | id, user_id FK, type (`image_processing`/`terms`/`privacy`), version, granted_at, revoked_at, ip |
| `uploaded_images` | id, user_id FK, storage_key, mime, size_bytes, sha256, retention (`delete_after_analysis`/`keep_for_progress`), expires_at, created_at |
| `skin_analyses` | id, user_id FK, source (`image`/`quiz`), **mode (`demo`/`real`)**, provider (`demo`/`<name>`), image_id FK null, selected_concerns text[], skin_type_estimate, summary, disclaimer_version, status, created_at |
| `analysis_scores` | id, analysis_id FK, concern (`acne`,`pigmentation`,`texture`,`pores`,`redness`,`dryness`,`oiliness`), score (0–100), severity (`low/moderate/high`), note |
| `quiz_responses` | id, analysis_id FK, answers jsonb |
| `categories` | id, name, slug |
| `products` | id, sku, name, slug, brand, category_id FK, description, how_to_use, price_cents, currency, image_urls text[], suitable_skin_types text[], target_concerns text[], rating_avg, rating_count, stock, is_active |
| `product_ingredients` | product_id FK, name, is_key (bool), benefit |
| `routines` | id, user_id FK, analysis_id FK, created_at |
| `routine_steps` | id, routine_id FK, period (`AM`/`PM`), step_order, step_type (`cleanser/toner/serum/moisturizer/sunscreen`), product_id FK, instructions |
| `carts`, `cart_items` | cart per user; items (product_id, qty) with unique (cart_id, product_id) |
| `wishlist_items` | user_id, product_id (unique pair) |
| `orders`, `order_items` | totals, status, shipping address jsonb, payment_mode (`demo`), price snapshot per item |
| `reviews` | id, product_id, user_id, rating (1–5), title, body, created_at; unique (product_id, user_id) |
| `articles`, `article_categories` | slug, title, excerpt, content (markdown), cover_image, author, published_at |
| `testimonials` | name, quote, rating, avatar |
| `reminders` | id, user_id, routine_period, time_local, timezone, days_of_week int[], channel (`in_app`/`email`), active |
| `support_tickets` | id, name, email, subject, message, status, created_at |
| `audit_logs` | id, user_id, action, entity, entity_id, ip, created_at |

**Indexes:** `products(category_id)`, GIN on `products(suitable_skin_types, target_concerns)`, trigram index on `products(name)` for search (`pg_trgm`), `skin_analyses(user_id, created_at DESC)`, unique constraints noted above.

## 2.6 REST API Design (`/api/v1`)

| Module | Endpoints |
|---|---|
| **Auth** | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh` · `POST /auth/logout` · `POST /auth/forgot-password` · `POST /auth/reset-password` |
| **Profile** | `GET/PATCH /me` · `GET/PUT /me/skin-profile` · `DELETE /me` (account + data deletion) · `GET/POST/DELETE /me/consents` |
| **Images** | `POST /images` (multipart, validated) · `DELETE /images/:id` |
| **Analysis** | `POST /analyses` (image or quiz; runs pipeline) · `GET /analyses` · `GET /analyses/:id` · `DELETE /analyses/:id` · `GET /analyses/compare?a=&b=` · `GET /analyses/progress` |
| **Quiz** | `GET /quiz/questions` · `POST /quiz/submit` |
| **Recommendations** | `GET /recommendations?analysisId=` · `GET /routines/:id` · `POST /routines/generate` |
| **Products** | `GET /products` (q, category, skinType, concern, minPrice, maxPrice, rating, sort, page) · `GET /products/:slug` · `GET /categories` · Admin: `POST/PATCH/DELETE /products` |
| **Cart** | `GET /cart` · `POST /cart/items` · `PATCH /cart/items/:id` · `DELETE /cart/items/:id` · `POST /cart/merge` |
| **Wishlist** | `GET /wishlist` · `POST /wishlist/:productId` · `DELETE /wishlist/:productId` |
| **Reviews** | `GET /products/:id/reviews` · `POST /products/:id/reviews` · `PATCH/DELETE /reviews/:id` |
| **Orders** | `POST /orders` (demo checkout) · `GET /orders` · `GET /orders/:id` |
| **Blog** | `GET /articles` (category, q, page) · `GET /articles/:slug` · `GET /article-categories` |
| **Reminders** | `GET/POST /reminders` · `PATCH/DELETE /reminders/:id` |
| **Support** | `POST /support` |
| **Misc** | `GET /testimonials` · `GET /health` · `GET /config/public` (reports `analysisMode: demo|real`) |

**Conventions:** JSON envelope `{ data, meta }` / `{ error: { code, message, details } }`; consistent HTTP status codes; pagination via `page`/`limit`; idempotency key on `POST /orders`.

## 2.7 AI Analysis Module (Modular Design)

```ts
// server/src/analysis/providers/AnalysisProvider.ts
export type Concern =
  | 'acne' | 'pigmentation' | 'texture' | 'pores'
  | 'redness' | 'dryness' | 'oiliness';

export interface RawConcernEstimate {
  concern: Concern;
  score: number;        // 0–100, higher = more visible concern
  confidence?: number;  // 0–1 (real providers)
  note?: string;
}

export interface ProviderResult {
  mode: 'demo' | 'real';
  provider: string;
  skinTypeEstimate: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  estimates: RawConcernEstimate[];
}

export interface AnalysisProvider {
  readonly name: string;
  readonly mode: 'demo' | 'real';
  analyze(input: { image?: Buffer; quizAnswers?: Record<string, unknown>;
                   selectedConcerns: Concern[] }): Promise<ProviderResult>;
}
```

**Provider selection (`config`):** `ANALYSIS_PROVIDER=demo | <future provider>`. If a real provider is requested but its API key is missing, the server **falls back to demo and flags `mode: "demo"`**. It never silently labels demo output as real.

**DemoProvider rules**
- Produces plausible sample scores (seeded by image hash so the same image gives the same demo output, no random flicker).
- Sets `mode: 'demo'`; every API response and the UI show the demo banner.
- Does **not** claim to have looked at the face. Summary text says "sample results".

**Pipeline steps**

| Step | Module | Notes |
|---|---|---|
| 1. Upload | `middleware/upload` | multer memory storage, 5 MB cap |
| 2. Validation | `analysis/validation` | magic-byte MIME check, dimensions (min 480 px), decode test; reject SVG/GIF/animated |
| 3. Preprocessing | `analysis/preprocess` | `sharp`: auto-orient, **strip EXIF/GPS**, resize (max 1024 px), normalize color space, basic blur/brightness metrics for quality feedback |
| 4. Analysis | `providers/*` | Provider interface (demo now) |
| 5. Scoring | `analysis/scoring` | clamp/normalize 0–100; severity bands (0–33 low, 34–66 moderate, 67–100 high); combine with user-selected concerns |
| 6. Recommendations | `analysis/recommend` | match products via skin type + concern + ingredient rules; build AM/PM routine |
| 7. Report | `services/analysis.service` | persist analysis + scores + routine in one DB transaction; return report DTO |

**Recommendation engine (rules-based, deterministic):**
`score(product) = 3·concernMatch + 2·skinTypeMatch + 1·keyIngredientMatch + 0.5·rating − penalty(allergens, user-flagged exclusions)`, then pick the top product per routine step. Sunscreen is always included in AM.

## 2.8 Deployment Architecture

| Component | Host | Notes |
|---|---|---|
| React client | Vercel | SPA rewrites, env `VITE_API_URL`, preview deployments per PR |
| Express API | Render Web Service | Docker or Node build; health check `/api/v1/health`; auto-deploy from `main` |
| PostgreSQL | Render Postgres or Neon | Daily backups; connection pooling (PgBouncer / Prisma Accelerate optional) |
| Object storage | Cloudflare R2 / S3 / Cloudinary | Private bucket, signed URLs |
| Email | Resend / SMTP | Reminders, password reset, support |
| CI/CD | GitHub Actions | lint → typecheck → test → build → deploy; `prisma migrate deploy` on release |
| Monitoring | Sentry + uptime ping | Prevents Render free-tier cold-start sleep |

**Environments:** `local` (Docker Compose Postgres) · `staging` · `production`.

### Environment variables (examples)
```
# server/.env.example
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/glownest
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
CLIENT_ORIGIN=http://localhost:5173
ANALYSIS_PROVIDER=demo
# AI_API_KEY=            (leave empty in demo mode)
STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
EMAIL_API_KEY=
SENTRY_DSN=

# client/.env.example
VITE_API_URL=http://localhost:4000/api/v1
```
