# Better Auth Integration & RBAC Strategy

## 1. Technical Overview

Better Auth is the unified authentication system for this monorepo, responsible for:

* User authentication (login, register, logout)
* Session management
* Role-based access control (RBAC)

---

## 2. Key Design Principles

* Authentication logic MUST be centralized at the backend
* Sessions MUST be persistent and database-backed
* Authorization MUST be enforced at the backend level
* Frontend MUST NOT be trusted for access control
* RBAC MUST be consistent across all services

---

## 3. Architecture

apps/
├── api/                        # NestJS
│   └── src/
│       └── auth/               # Better Auth instance, Guards, Decorators
├── web/                        # Next.js
│   └── src/
│       └── auth/               # Better Auth client
libs/
├── config/                     # Shared configuration
├── shared-types/
│   └── auth.ts                 # AuthenticatedUser, UserRole, SessionUser...
└── utils/                      # Shared utility functions

---

## 4. Shared Types (`libs/shared-types`)

Contains only what **both frontend and backend use**:

* `AuthenticatedUser` — shape of the authenticated user attached to requests
* `UserRole` — role enum/constants (`admin`, `user`)
* `SessionUser` — shape of session data

### Must NOT contain:

* Better Auth instance or configuration
* Guards or Decorators (NestJS-only)
* Auth client (Next.js-only)
* Database logic

---

## 5. Backend (`apps/api/src/auth`)

All backend auth logic lives here:

* Better Auth instance & configuration
* Session validation
* Auth Guards
* User decorator
* Database session storage

---

## 6. Frontend (`apps/web/src/auth`)

All frontend auth logic lives here:

* Better Auth client configuration
* Session retrieval for UI rendering
* Route protection (redirect unauthorized users)

---

## 7. RBAC Strategy

### Roles

* `admin`
* `user`

### Storage

* Role is stored in the `User` entity in the database

### Access Model

| Role  | Access                               |
|-------|--------------------------------------|
| admin | Full access to user management APIs  |
| user  | Access limited to their own profile  |

### Enforcement

* Authorization is enforced at the backend (controller level)
* Frontend may use role for UI rendering only — never for access control

---

## 8. Session Strategy

### Persistence

* Sessions are stored in the database
* Enables: secure validation, remote logout

### Synchronization

* Session is shared between frontend and backend via cookies or headers

---

## 9. System Boundaries

| Layer       | Responsibility                                 | Location                |
|-------------|------------------------------------------------|-------------------------|
| Frontend    | Auth client, session usage, route protection   | `apps/web/src/auth`     |
| Backend     | Better Auth instance, session validation, RBAC | `apps/api/src/auth`     |
| Shared Types| AuthenticatedUser, UserRole, SessionUser       | `libs/shared-types`     |
| Database    | Persistent session & user data                 | managed by `apps/api`   |

---

## 10. Summary

* Better Auth instance → backend only (`apps/api/src/auth`)
* Auth client → frontend only (`apps/web/src/auth`)
* Shared types → `libs/shared-types` only
* RBAC enforced at the backend
* Sessions are persistent and shared via cookies or headers