# NX Monorepo Architecture Guidelines (Assignment Compliance)

## 1. Executive Summary

This project uses **NX** as the build system and monorepo manager. The architecture fulfills the "Auth + User Management System" assignment requirements with a clear separation between apps (executable) and shared libraries (cross-app contracts), while keeping framework-specific concerns inside the apps that own them.

## 2. Workspace Structure

### Applications (`apps/`)

* **`web/`**
  * **Framework**: Next.js (App Router)
  * **Responsibility**: Frontend UI, Server Components (RSC), Client Components, middleware-based route protection, and the Better Auth **client** (`apps/web/src/auth/`)

* **`api/`**
  * **Framework**: NestJS (Clean Architecture per `nestjs_architecture.md`)
  * **Responsibility**: Backend REST API, Better Auth **server** instance, Prisma schema + client, RBAC guards, business logic
  * **Internal layout**:
    ```
    apps/api/
    ├── prisma/                              # Prisma schema + migrations (single source of truth)
    │   ├── schema.prisma
    │   └── migrations/
    └── src/
        ├── modules/                         # Domain modules (Clean Architecture)
        │   └── auth/
        │       ├── infrastructure/          # Better Auth instance, env validation
        │       ├── interface/
        │       │   ├── controllers/         # auth.controller.ts (toNodeHandler delegation)
        │       │   ├── guards/              # AuthGuard, RolesGuard
        │       │   └── decorators/          # @User(), @Roles()
        │       └── auth.module.ts
        ├── shared/
        │   └── infrastructure/
        │       └── database/                # PrismaClient singleton + PrismaService
        ├── app/                             # Root NestJS module (composition root)
        └── main.ts
    ```

### Shared Libraries (`libs/`)

Only types and helpers that are **genuinely shared between `web` and `api`** live in `libs/`:

* **`shared-types/`** — TypeScript interfaces, DTOs, RBAC role enums (e.g., `AuthenticatedUser`, `UserRole`, `SessionUser`)
* **`config/`** — Environment variable schemas and workspace-wide constants
* **`utils/`** — Pure helper functions (validation, date formatting) with no framework dependencies

### What does NOT live in `libs/`

| Concern | Why not in `libs/` | Where it lives |
|---------|--------------------|-----------------|
| Better Auth server instance | Backend-only; importing into `libs/` would force the frontend to bundle NestJS-adjacent code | `apps/api/src/modules/auth/infrastructure/auth.ts` |
| Prisma schema + client | Backend-only; would leak `@prisma/client` into the browser bundle | `apps/api/prisma/` and `apps/api/src/shared/infrastructure/database/` |
| Auth guards / decorators | NestJS-specific; `auth_rules.md` forbids this | `apps/api/src/modules/auth/interface/{guards,decorators}/` |
| Better Auth client | Next.js-specific | `apps/web/src/auth/` |

> **Rule of thumb:** if it imports from `@nestjs/*`, `next/*`, `@prisma/client`, or `better-auth/*`, it belongs in an `apps/*/` directory, not in `libs/`.

## 3. RBAC & Data Flow Implementation

### Backend Enforcement (NestJS)

* **Guards**: every protected endpoint MUST use `AuthGuard` + `RolesGuard` (see `nestjs_rbac_rules.md`)
* **Session validation**: handled by the Better Auth server instance at `apps/api/src/modules/auth/infrastructure/auth.ts`
* **Role checks**: `@Roles()` decorator on every protected handler

### Frontend Enforcement (Next.js)

* **Middleware**: global route protection (e.g., redirecting unauthenticated users away from `/admin`)
* **Server-Side Checks**: permission checks in Server Components before rendering sensitive data
* **Frontend role checks are NEVER the source of truth** — they only drive UI rendering

## 4. Scaling by Domain

As the project grows, follow Domain-Driven Design within NX. **Backend and frontend modules use intentionally different shapes:**

| Side | Module shape | Why |
|---|---|---|
| Backend (`apps/api/src/modules/<name>/`) | Layered Clean Architecture: `{domain, application, infrastructure, interface}` + `<name>.module.ts` at the root | Server-side business logic benefits from explicit layer boundaries (testability, swappable infra, framework-independent domain). Mandated by `nestjs_architecture.md`. |
| Frontend (`apps/web/src/modules/<name>/`) | Flat: `{components, hooks, services, types, utils}` | React UI doesn't benefit from the same layering — components, hooks, and services map directly to UI concerns. Mandated by `nextjs_architecture.md`. |

**Do NOT** apply backend layering to frontend modules, and **do NOT** flatten backend modules into the frontend shape. They are different by design.

Other scaling rules:

1. **Cross-app contracts** — when both apps need a type or constant, put it in `libs/shared-types`
2. **NX boundaries** — use Nx tags (`type:app`, `type:lib`) to prevent circular dependencies

## 5. Task Pipeline & Performance

* **Caching**: local + remote caching enabled for `build`, `test`, `lint`
* **Dependency graph**: `npx nx graph` to visualize app↔lib relationships
* **Affected commands**: `nx affected` to scope CI runs to changed projects

## 6. Summary

* `apps/` owns runtime code and framework-specific concerns
* `libs/` owns only what `web` AND `api` both consume
* Backend Clean Architecture lives inside `apps/api/src/{modules,shared,app}/`
* Prisma + Better Auth server are backend-only and live inside `apps/api/`
