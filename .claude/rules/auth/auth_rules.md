# Authentication & RBAC Enforcement Rules (Better Auth)

## 🔒 Core Rules

* All protected endpoints MUST require authentication
* Backend MUST validate session on every request
* Frontend MUST NOT be trusted for authorization
* RBAC MUST be enforced at controller level

---

## 📁 Code Location Rules

| Code                              | Correct Location                                                | Wrong Location      |
|-----------------------------------|-----------------------------------------------------------------|---------------------|
| Better Auth instance/config       | `apps/api/src/modules/auth/infrastructure`                      | `libs/`             |
| Auth Controller                   | `apps/api/src/modules/auth/interface/controllers`               | `libs/`             |
| Auth Guards, Decorators           | `apps/api/src/modules/auth/interface/guards` (and `decorators`) | `libs/`             |
| Auth Module (`auth.module.ts`)    | `apps/api/src/modules/auth`                                     | `libs/`             |
| Better Auth client                | `apps/web/src/auth`                                             | `libs/`             |
| AuthenticatedUser, UserRole types | `libs/shared-types`                                             | `apps/`             |

> The auth module follows the layered structure mandated by `.claude/contexts/architecture/backend/nestjs_architecture.md`:
> `modules/auth/{infrastructure, interface, [domain], [application]}` + `auth.module.ts` at the module root.

---

## 🛡️ Authentication (MANDATORY)

### Backend Requirements

* MUST extract session token from Authorization header OR cookies
* MUST validate session using Better Auth instance at `apps/api/src/modules/auth/infrastructure`
* MUST attach authenticated user to request context

---

## 👤 User Injection

A custom decorator MUST be used:

```ts
@User() user: AuthenticatedUser
```

* `AuthenticatedUser` is imported from `libs/shared-types`
* MUST contain: user id, user role
* MUST come from validated session

---

## 🧩 Auth Guard (REQUIRED)

All protected routes MUST use AuthGuard:

```ts
@UseGuards(AuthGuard)
```

* `AuthGuard` lives at `apps/api/src/modules/auth/interface/guards/`
* Responsibilities: validate session, reject unauthenticated requests, attach user to request

---

## 🚫 Forbidden Patterns

### ❌ Missing Auth Guard

```ts
@Get()
async getUsers() {}
```

### ❌ Placing Guards or Decorators inside libs

```ts
// libs/shared-types/auth.guard.ts  ← WRONG, NestJS-only code must not go into libs
```

### ❌ Placing Better Auth instance inside libs

```ts
// libs/config/auth.instance.ts  ← WRONG, backend-only code must not go into libs
```

---

## 🧠 Session Validation Rules

* MUST validate against database
* MUST reject expired or invalid sessions
* MUST NOT trust unsigned tokens

---

## 🌐 Frontend Rules (Next.js)

* Better Auth client lives at `apps/web/src/auth/`
* MUST use session for UI rendering only
* MUST protect admin routes (e.g., `/admin`)
* MUST redirect unauthorized users
* MUST NOT use client-side role checks as the source of truth for access control

---

## 🧪 Enforcement Checklist

Before completing any auth-related code:

* [ ] AuthGuard is applied
* [ ] User is injected via decorator
* [ ] Session is validated via Better Auth
* [ ] Guards/Decorators are NOT placed inside `libs/`
* [ ] Shared types are imported from `libs/shared-types`

---

## 🧠 AI Coding Rules

When generating code:

* ALWAYS include AuthGuard on protected routes
* NEVER skip authentication
* NEVER place NestJS-specific code (guards, decorators) inside `libs/`
* NEVER place Next.js-specific code (auth client) inside `libs/`
* ONLY place in `libs/shared-types`: types and interfaces used by both frontend and backend

---

## ✅ Summary

* Authentication → `AuthGuard` at `apps/api/src/modules/auth/interface/guards`
* Session validation → Better Auth instance at `apps/api/src/modules/auth/infrastructure`
* HTTP routes → Controller at `apps/api/src/modules/auth/interface/controllers`
* Module registration → `apps/api/src/modules/auth/auth.module.ts`
* Shared types → `libs/shared-types`

This rule is **MANDATORY** for all backend services.