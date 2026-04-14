# Better Auth Integration & RBAC Strategy

## 1. Technical Overview

Better Auth is the unified authentication system for this monorepo, responsible for:

* User authentication (login, register, logout)
* Session management
* Role-based access control (RBAC)

The system is designed to be **framework-agnostic**, supporting both frontend and backend applications.

---

## 2. Key Design Principles

* Authentication logic MUST be centralized
* Session MUST be persistent and database-backed
* Authorization MUST be enforced at backend level
* Frontend MUST NOT be trusted for access control
* RBAC MUST be consistent across all services

---

## 3. Shared Auth Module (`libs/auth`)

All authentication-related logic is centralized in a shared library:

* Acts as the **single source of truth**
* Shared across:

  * Web (Next.js)
  * API (NestJS)

### Responsibilities

* Configure authentication system
* Manage session validation
* Provide reusable utilities for all services

---

## 4. Integration Strategy

### Frontend (Next.js)

* Consumes authentication via shared auth client
* Retrieves session for rendering and route protection
* Applies route-level protection for restricted pages (e.g., admin area)

### Backend (NestJS)

* Validates session on every protected request
* Extracts user identity and role from session
* Enforces authorization rules at controller level

---

## 5. RBAC Strategy

### Roles

The system defines two roles:

* `admin`
* `user`

### Storage

* Role is stored in the `User` entity in the database

### Access Model

* **Admin**

  * Full access to user management APIs
* **User**

  * Access limited to their own profile

### Enforcement

* Authorization is enforced at the backend layer
* All protected endpoints must validate role permissions

---

## 6. Session Strategy

### Persistence

* Sessions are stored in the database
* Enables:

  * Secure session validation
  * Remote logout
  * Multi-device tracking

### Synchronization

* Session state is shared between frontend and backend
* Achieved via cookies or headers

---

## 7. System Boundaries

| Layer    | Responsibility                                |
| -------- | --------------------------------------------- |
| Frontend | UI, session usage, route protection           |
| Backend  | Session validation, authorization enforcement |
| Auth Lib | Shared authentication logic                   |
| Database | Persistent session & user data                |

---

## 8. Comparison Note

| Feature               | NextAuth           | Better Auth        |
| --------------------- | ------------------ | ------------------ |
| Framework Flexibility | Limited to Next.js | Framework-agnostic |
| Monorepo Support      | Weak               | Strong             |
| RBAC Extensibility    | Limited            | Flexible           |
| Type Safety           | Moderate           | Strong             |

---

## 9. Summary

* Better Auth is the centralized authentication system
* RBAC is enforced at backend level
* Sessions are persistent and shared across services
* Architecture is designed for scalability and consistency
