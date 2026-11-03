# GlowNest – AI-Powered Skincare & Beauty Platform

GlowNest is a full-stack skincare and beauty web application built with a modern PERN architecture (**Neon PostgreSQL via Prisma, Express.js, React 18, Node.js, and TypeScript**). It empowers users with cosmetic skin analysis (facial photo upload or holistic 5-question skin quiz), personalized AM/PM regimens, an e-commerce storefront, educational beauty journal, and barrier recovery progress tracking.

---

## 🌟 Key Features

1. **Facial Photo Analysis (`/analyze`):**
   - Explicit consent check before processing facial imagery.
   - Metadata stripping (EXIF & GPS coordinates) via Sharp.
   - Multi-select concern prioritization (Acne, Dark Spots, Texture, Pores, Redness, Dryness, Oiliness).
   - Generates scores (0–100) and severity ratings across 7 visible traits.
   - **Phase 1 Demonstration Mode:** Clear disclaimer and persistent badge indicating simulated cosmetic assessment.

2. **Holistic Skin Quiz (`/quiz`):**
   - Alternative no-photo assessment answering 5 questions regarding midday skin feel, reactivity, primary goals, climate, and routine style.
   - Produces the identical structured report format labeled *"Quiz-based assessment"*.

3. **Personalized AM & PM Regimen (`/report/:id`):**
   - Dynamic step-by-step routine matching (Cleanser, Toner, Serum, Moisturizer, Sunscreen).
   - Direct *"Add to Bag"* button per step or *"Add Entire Routine to Bag"*.
   - Interactive Recharts radar visualization.

4. **Clean Botanical Storefront (`/shop`):**
   - Filter by Category, Skin Type, or Concern.
   - Price and rating sorting, instant keyword search.
   - Product details (`/shop/:slug`) with key active ingredients, benefits, and how-to-use tips.

5. **Shopping Bag & Demo Checkout (`/cart`, `/checkout`):**
   - Guest & authenticated cart syncing with auto-merge upon sign-in.
   - Free delivery progress meter (qualifies at ₹999+).
   - Promo code support (e.g., `GLOW10` for 10% discount).
   - Transparent Phase 1 demo payment step (zero real charge) creating confirmed orders in the database.

6. **Skin Profile Dashboard (`/dashboard`):**
   - Historical analyses timeline with deletion control for user privacy.
   - **Report Comparison Tool:** Evaluates baseline vs. current scores, computing delta improvements.
   - **Progress Trends:** Multi-line Recharts graph tracking concern score trajectories.
   - Order history with confirmed status and totals.

7. **The Glow Journal (`/blog`):**
   - Evidence-based articles on skin barrier repair, niacinamide layering, and mineral vs. chemical sunscreen.

8. **Theme & Design System:**
   - Soft cream, blush pink, and sage green palette with matching dark mode.
   - Typography: Playfair Display for headings, Inter for body.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- npm or pnpm

### 1. Installation
Install root and workspace dependencies:
```bash
npm install
```

### 2. Database Setup
GlowNest is connected to **Neon Serverless PostgreSQL** via Prisma:
```bash
# Push schema changes to Neon PostgreSQL
npm run prisma:push --workspace=server

# Seed products, blog articles, and sample users into Neon
npm run seed --workspace=server
```

### 3. Run Development Servers
Start both the Express API (`http://localhost:5000`) and the Vite React frontend (`http://localhost:3000`):
```bash
npm run dev
```

Alternatively, you can run them individually:
```bash
# In one terminal:
npm run dev:server

# In another terminal:
npm run dev:client
```

---

## 🔐 Demo Credentials

To test authenticated features immediately, click the **"Sign In as Demo User"** button on the `/login` page, or use:
- **Email:** `demo@glownest.com`
- **Password:** `Password123!`

Admin user:
- **Email:** `admin@glownest.com`
- **Password:** `Password123!`

---

## 📁 Repository Structure

```
glownest2/
├── package.json                 # npm workspaces root
├── server/                      # Express.js + TypeScript API
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.ts              # Database seed script
│   │   └── dev.db               # SQLite database
│   ├── src/
│   │   ├── analysis/            # Pluggable Analysis Engine & DemoProvider
│   │   ├── controllers/         # HTTP Controllers
│   │   ├── services/            # Core business logic (auth, cart, orders...)
│   │   ├── routes/              # Express /api/v1 routes
│   │   ├── middleware/          # JWT auth, error handler, multer upload
│   │   └── app.ts               # Express configuration
│   └── tsconfig.json
└── client/                      # React 18 + Vite + Tailwind CSS
    ├── src/
    │   ├── context/             # Auth, Cart, and Theme contexts
    │   ├── components/          # Navbar, Footer, ProductCard, ScoreBar...
    │   ├── pages/               # Home, Analyze, Quiz, Report, Shop, Dashboard...
    │   ├── api/                 # Axios client
    │   └── styles/              # Tailwind CSS styles
    └── vite.config.ts
```

---

## ⚖️ Legal & Medical Disclaimer
GlowNest assessments are **cosmetic evaluations only and never constitute medical diagnoses**. GlowNest does not detect or diagnose skin diseases. Users experiencing medical symptoms should consult a board-certified dermatologist.

"# glownest" 
