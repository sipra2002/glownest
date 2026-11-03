> **GlowNest – AI-Powered Skincare & Beauty Platform** | PERN Stack (PostgreSQL, Express.js, React.js, Node.js, all TypeScript) | AI: Demo Mode (Phase 1)

# 4. Security Architecture

## 4.1 Security Principles
Least privilege · defense in depth · secure by default · data minimization · privacy by design · fail closed.

## 4.2 Threat Model (STRIDE-oriented summary)

| Threat | Example | Mitigation |
|---|---|---|
| Spoofing | Credential stuffing, stolen tokens | argon2 hashing, rate limits, short-lived JWT, refresh rotation, optional email verification/2FA later |
| Tampering | Price manipulation at checkout, parameter tampering | Server-side pricing, Zod validation, DB constraints, ownership checks |
| Repudiation | Disputed orders/actions | Audit logs, request IDs |
| Information disclosure | Leaked face images, IDOR on reports | Private storage, signed URLs, ownership checks on every resource, EXIF strip, TLS |
| Denial of service | Large uploads, brute force | Size caps, rate limiting, timeouts, CDN/WAF |
| Elevation of privilege | User calling admin endpoints | RBAC middleware, deny by default |

## 4.3 Authentication & Authorization
- Passwords: **argon2id**, min 10 chars, breached-password check (HIBP k-anonymity) optional.
- JWT: HS256 (or RS256) with strong secrets from env; access token 15 min, in memory (not localStorage); refresh token httpOnly + Secure + SameSite=Lax/Strict cookie, stored hashed, rotated on use.
- RBAC: `user`, `admin`. Admin routes (product management) behind `requireRole('admin')`.
- **Ownership checks** on every resource (analyses, images, orders, reminders) to prevent IDOR.
- Account lockout/backoff on repeated failures; generic error messages (no user enumeration).
- Password reset via single-use, hashed, time-limited tokens.

## 4.4 Input Validation & API Hardening
- Zod validation on all body/query/params; reject unknown fields (`.strict()`).
- Parameterized queries only (Prisma); no raw SQL with interpolation.
- `helmet` security headers; strict CORS allow-list (`CLIENT_ORIGIN`).
- Rate limiting (`express-rate-limit` + store): global, plus tighter limits on `/auth/*`, `/images`, `/analyses`, `/support`.
- CSRF: cookie-based refresh endpoint protected via SameSite + CSRF token/double-submit or custom header check.
- Body size limits; request timeouts; `hpp` for parameter pollution.
- Output encoding: React escapes by default; blog markdown rendered with sanitizer (DOMPurify / rehype-sanitize); no `dangerouslySetInnerHTML` on unsanitized content.
- Content-Security-Policy configured on the Vercel frontend.

## 4.5 Secure Image Handling (Highest-Sensitivity Data)

| Control | Detail |
|---|---|
| Explicit consent | Mandatory, versioned, stored with timestamp; no upload without it |
| Upload validation | Allow-list JPEG/PNG/WebP; magic-byte verification (not just extension); 5 MB limit; decode test; reject polyglots/SVG |
| Sanitization | Re-encode via `sharp`; **strip EXIF/GPS metadata**; randomized storage keys (no user-supplied filenames) |
| Storage | Private bucket, server-side encryption at rest, access only through short-lived signed URLs |
| Retention | Default **delete immediately after analysis**; optional "keep for progress tracking" with expiry |
| User control | View/delete any image or report; account deletion purges images |
| Third-party sharing | None in demo mode. If a real AI provider is added later, disclose it in the privacy policy/consent, use zero-retention settings where available, and send only the preprocessed image |
| No biometric identification | Images are never used for face recognition/identification or model training |
| Malware | Optional AV scan (ClamAV) before storage in production |

## 4.6 Data Protection & Compliance
- **In transit:** TLS 1.2+ everywhere (HSTS).
- **At rest:** managed Postgres encryption; object storage SSE; sensitive tokens stored hashed.
- **Secrets:** environment variables via platform secret stores; never committed; `.env.example` only; rotate on leak.
- **Privacy regulations:** design for GDPR/CCPA-style rights (access, export, deletion, consent withdrawal). Facial imagery may be treated as sensitive/biometric-adjacent data in some regions (e.g., Illinois BIPA, GDPR special categories), so keep explicit consent and minimal retention. *Legal review of the privacy policy is recommended before launch; this document is not legal advice.*
- **Health claims:** all reports carry the cosmetic-not-medical disclaimer; the app never claims to detect or diagnose disease.
- **Logging:** no passwords, tokens, or image data in logs; PII minimized and masked.

## 4.7 Payments (Future)
Use a hosted gateway (Stripe/Razorpay) so card data never touches GlowNest servers (PCI SAQ-A scope). Verify webhooks via signatures. Phase 1 demo checkout stores no payment data.

## 4.8 Infrastructure & DevSecOps
- Dependabot/`npm audit` in CI; lockfiles committed; pin Node LTS.
- Secret scanning (gitleaks) in CI; SAST (CodeQL) on PRs.
- Least-privilege DB user for the app; migrations run with a separate role.
- Daily automated DB backups with periodic restore tests.
- Separate staging/production credentials and databases.
- Sentry for errors (with PII scrubbing); uptime monitoring; alerting on auth anomalies.
- Branch protection + required reviews on `main`.

## 4.9 Security Testing Checklist
- [ ] OWASP ASVS L1 review; OWASP Top 10 test pass
- [ ] Authz tests: every endpoint tested for cross-user access (IDOR)
- [ ] Upload fuzzing (oversized, wrong MIME, corrupted, polyglot files)
- [ ] Rate-limit and brute-force tests
- [ ] Dependency audit clean (no high/critical)
- [ ] Verify demo results are always labeled in API + UI
