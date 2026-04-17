# Database Architecture (Prisma & PostgreSQL)

## 1. Overview

This project uses **Prisma ORM** with **PostgreSQL** as the primary database solution.

The database layer is designed to be:

* Centralized inside the backend app (`apps/api`)
* Consistent across all backend modules
* Scalable for future extensions (RBAC, multi-tenant, auditing)

---

## 2. Schema Location

The Prisma schema is owned by the backend app:

* **Schema location**: `apps/api/prisma/schema.prisma`
* **Migrations location**: `apps/api/prisma/migrations/`

### Why not in `libs/`?

* Prisma is a **backend-only** concern; the frontend (`apps/web`) never touches the schema or client
* Generated artifacts (Prisma client + migrations) belong with the app that owns them
* `auth_rules.md` and `nestjs_architecture.md` both forbid placing backend infrastructure in `libs/`
* Sharing Prisma via `libs/` would force the frontend to depend on `@prisma/client`, leaking server types into the browser bundle

### Single source of truth

> The schema at `apps/api/prisma/schema.prisma` is the **single source of truth** for all data models. No other Prisma schema file may exist in the workspace.

---

## 3. PrismaClient Location (Backend Runtime)

The runtime client lives under the NestJS app's `shared/infrastructure/` layer per `nestjs_architecture.md`:

```
apps/api/src/shared/infrastructure/database/
├── prisma.ts            ← exported singleton PrismaClient (framework-free)
└── prisma.service.ts    ← Nest-injectable PrismaService (OnModuleInit/Destroy)
```

### Why `shared/infrastructure/`?

* Prisma is a **cross-module** infrastructure concern (used by `auth`, future `users`, etc.)
* `nestjs_architecture.md` reserves `modules/<name>/` for module-scoped code and `shared/` for code reused across modules
* Both `prisma.ts` (raw singleton) and `prisma.service.ts` (Nest-managed) coexist:
  * `prisma.ts` is for module-load-time consumers like `auth.ts` (Better Auth needs the instance before DI runs)
  * `prisma.service.ts` is for DI-friendly consumers (repositories, use cases)

---

## 4. Data Modeling Guidelines

### Naming Conventions

* Models represent domain entities (PascalCase)
* Fields use camelCase
* Tables map to snake_case via `@@map`

### Schema Design

* Each model represents a database table
* Relationships MUST be explicitly defined
* Avoid unnecessary complexity in schema design

### Auditing

* All non-Better-Auth-owned entities MUST include `createdAt` and `updatedAt`
* Better Auth-owned models (`User`, `Session`, `Account`, `Verification`) follow the CLI-generated structure

---

## 5. Layer Isolation & Access Control

### Backend (NestJS)

* `PrismaClient` access is restricted to the **infrastructure** layer:
  * `apps/api/src/shared/infrastructure/database/`
  * `apps/api/src/modules/<module>/infrastructure/repositories/` (when implementing repository pattern)
* Application layer MUST consume repository **interfaces**, never `PrismaClient` directly
* Domain layer MUST NOT import `@prisma/client` at all

### Frontend (Next.js)

* MUST NOT import `@prisma/client` under any circumstance
* MUST use backend APIs for all data operations

---

## 6. Authentication Integration (Better Auth)

The database supports authentication via Better Auth's official models:

### Required Models (CLI-generated)

* `User`
* `Session`
* `Account`
* `Verification`

### Allowed Modifications

* Add `Role` enum
* Add `role` field on `User`

See `spec/TI-31_integrate-prisma-adapter-better-auth.md` for the strict workflow.

---

## 7. Data Ownership & Boundaries

| Layer           | Responsibility       | Path                                            |
|-----------------|----------------------|-------------------------------------------------|
| Database        | Data persistence     | PostgreSQL                                      |
| Infrastructure  | Data access (Prisma) | `apps/api/src/shared/infrastructure/database/`  |
| Application     | Business logic       | `apps/api/src/modules/<m>/application/`         |
| Interface (API) | Data exposure        | `apps/api/src/modules/<m>/interface/`           |

---

## 8. Migration Strategy

* All schema changes MUST go through Prisma migrations:
  ```bash
  npx prisma migrate dev --schema apps/api/prisma/schema.prisma --name <change>
  ```
* Migration files MUST be committed
* Direct database modifications are NOT allowed

---

## 9. Scalability Considerations

* Schema must be extensible for:
  * RBAC expansion
  * Multi-tenant support (future)
  * Audit logging
* Avoid tight coupling between models

---

## 10. Summary

* Prisma is the single ORM used across the system
* Schema lives in `apps/api/prisma/schema.prisma`
* Runtime client lives in `apps/api/src/shared/infrastructure/database/`
* Strict layer isolation is enforced (Domain ⊥ Prisma)
* Authentication and RBAC rely on the database structure
* Schema must be maintainable and scalable
