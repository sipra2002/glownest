> **GlowNest – AI-Powered Skincare & Beauty Platform** | PERN Stack (PostgreSQL, Express.js, React.js, Node.js, all TypeScript) | AI: Demo Mode (Phase 1)

# 3. System Workflow

## 3.1 User Journey Overview
```mermaid
flowchart TD
    A[Landing / Home] --> B{Choose}
    B -->|Analyze My Skin| C[Consent]
    B -->|Explore Products| S[Shop]
    C --> D{Method}
    D -->|Upload photo| E[Upload + Preview + Select concerns]
    D -->|Quiz| Q[Skin Quiz]
    E --> F[Run Analysis]
    Q --> F
    F --> G[Skin Report<br/>scores + summary + disclaimer + demo banner]
    G --> H[Personalized AM/PM Routine]
    H --> I[Add to Cart / Wishlist]
    I --> J[Checkout - demo payment]
    G --> K[Saved to Dashboard]
    K --> L[Progress tracking / Compare reports]
    S --> I
```

## 3.2 Skin Analysis Sequence
```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client
    participant A as Express API
    participant V as Validation/Preprocess
    participant P as Analysis Provider
    participant D as PostgreSQL
    participant O as Object Storage

    U->>C: Grant consent, select image + concerns
    C->>A: POST /images (multipart, JWT)
    A->>V: MIME/magic-byte check, size, decode
    V-->>A: Valid + sanitized image (EXIF stripped)
    A->>O: Store encrypted object (private)
    A->>D: Insert uploaded_images, consent check
    A-->>C: imageId
    C->>A: POST /analyses {imageId, concerns}
    A->>P: analyze(image, concerns)
    P-->>A: ProviderResult (mode: demo)
    A->>A: Score normalization + recommendations
    A->>D: Transaction: analysis, scores, routine, steps
    A->>O: Delete image if retention = delete_after_analysis
    A-->>C: Report DTO (mode, disclaimer, scores, routine)
    C-->>U: Report page (demo banner if mode=demo)
```

## 3.3 Authentication Workflow
```mermaid
sequenceDiagram
    actor U as User
    participant C as Client
    participant A as API
    participant D as DB
    U->>C: Login (email, password)
    C->>A: POST /auth/login
    A->>D: Find user, verify argon2 hash
    A-->>C: access JWT (body, 15m) + refresh token (httpOnly, Secure, SameSite cookie)
    C->>A: API calls with Authorization: Bearer
    A-->>C: 401 when access expired
    C->>A: POST /auth/refresh (cookie)
    A->>D: Validate + rotate refresh token (revoke old)
    A-->>C: New access JWT + new refresh cookie
```
Reuse of a revoked refresh token revokes the whole token family (theft detection).

## 3.4 Purchase Workflow
1. Browse/search/filter → product detail → **Add to cart** (guest cart in localStorage).
2. Login/register → `POST /cart/merge` merges guest cart.
3. Cart review → quantity update/remove → **Checkout**.
4. Enter shipping address → choose shipping → review summary.
5. **Demo payment step** (labeled "No real payment is taken") → `POST /orders` with idempotency key.
6. Server re-prices from DB (never trusts client prices), decrements stock in a transaction, creates order.
7. Confirmation page + order history entry.

## 3.5 Reminder Workflow
User creates reminder (AM/PM, time, timezone, channel) → stored → scheduler runs every minute, finds due reminders by timezone → sends email / creates in-app notification → logs delivery.

## 3.6 Data Lifecycle & Privacy Workflow
| Event | Action |
|---|---|
| Consent withdrawn | Block further image analyses; offer deletion of stored images |
| Analysis with default retention | Raw image deleted right after analysis; only scores/report stored |
| "Keep for progress" selected | Image stored, auto-expires per retention policy (default 12 months) |
| User deletes report/image | Hard delete from DB and object storage |
| Account deletion | Cascade delete user data; anonymize orders as required by law; purge within 30 days incl. backups rotation |

## 3.7 Error & Empty State Handling
- Validation failure → inline field errors with clear fix guidance.
- Image rejected → specific reason (too dark/blurry/small/unsupported).
- Network/API error → error card with **Retry**.
- No data → friendly empty states with a next action (e.g., "No reports yet → Analyze My Skin").
