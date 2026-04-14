# Database Architecture (Prisma & PostgreSQL)

## 1. Overview

This project uses **Prisma ORM** with **PostgreSQL** as the primary database solution.

The database layer is designed to be:

* Centralized
* Consistent across the monorepo
* Scalable for future extensions (RBAC, multi-tenant, auditing)

---

## 2. Database Library (`libs/database`)

All database-related logic is centralized in a shared library:

* **Schema Location**: `libs/database/prisma/schema.prisma`
* **Purpose**:

  * Define all data models
  * Manage migrations
  * Provide a shared Prisma client

### Key Principle

> The database layer acts as a **single source of truth** for all data models.

---

## 3. Data Modeling Guidelines

### Naming Conventions

* Models represent domain entities
* Clear and consistent naming must be used across the system

### Schema Design

* Each model represents a database table
* Relationships must be explicitly defined
* Avoid unnecessary complexity in schema design

### Auditing

* All entities should support tracking changes over time

---

## 4. Layer Isolation & Access Control

### Backend (NestJS)

* Prisma access is restricted to the **infrastructure layer**
* Application and domain layers MUST NOT directly access Prisma

### Frontend (Next.js)

* MUST NOT directly query the database for business logic
* MUST use backend APIs for all secured operations

### Exception

* Read-only queries MAY be allowed in server-side execution (e.g., Server Actions)
* These cases MUST ensure proper session validation

---

## 5. Authentication Integration (Better Auth)

The database must support authentication and session management.

### Required Models

* `User`
* `Session`
* `Account`
* `Verification`

### Role Management

* User roles are stored in the database
* Role field must be part of the User model

---

## 6. Data Ownership & Boundaries

| Layer           | Responsibility       |
| --------------- | -------------------- |
| Database        | Data persistence     |
| Infrastructure  | Data access (Prisma) |
| Application     | Business logic       |
| Interface (API) | Data exposure        |

---

## 7. Migration Strategy

* All schema changes MUST go through Prisma migrations
* Migrations MUST be version-controlled
* Direct database modifications are NOT allowed

---

## 8. Scalability Considerations

* Schema must be extensible for:

  * RBAC expansion
  * Multi-tenant support
  * Audit logging
* Avoid tight coupling between models

---

## 9. Summary

* Prisma is the single ORM used across the system
* Database logic is centralized in `libs/database`
* Strict separation of layers is enforced
* Authentication and RBAC rely on database structure
* Schema must be maintainable and scalable
