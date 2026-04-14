# Prisma Database Rules (Enforcement)

## 🔒 Core Rules

* Prisma MUST be the only ORM used
* All schema changes MUST be defined in `schema.prisma`
* Direct SQL queries are NOT allowed unless absolutely necessary
* Database access MUST follow layer isolation rules

---

## 🧱 Schema Definition Rules

### Naming Conventions (MANDATORY)

* Models → PascalCase

```ts
model User {}
```

* Fields → camelCase

```ts
createdAt DateTime
```

* Table mapping (if needed)

```ts
@@map("users")
```

---

## 🕒 Audit Fields (REQUIRED)

Every model MUST include:

```ts
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

❗ Missing audit fields = INVALID schema

---

## 🧩 ID Rules

* Every model MUST have a primary key

```ts
id String @id @default(cuid())
```

---

## 🔗 Relation Rules

* All relations MUST be explicitly defined
* Avoid implicit or unclear relationships

### Example:

```ts
user   User   @relation(fields: [userId], references: [id])
userId String
```

---

## 🧠 Enum Rules

* Use Prisma `enum` for fixed values

```ts
enum Role {
  admin
  user
}
```

* DO NOT use string literals for roles

---

## 🔐 Better Auth Requirements

The following models MUST exist and follow Better Auth structure:

* `User`
* `Session`
* `Account`
* `Verification`

### Custom Fields

* Additional fields (e.g., `role`) MUST be added to `User`
* MUST stay consistent with auth logic

---

## 🧱 Layer Access Rules

### Backend (NestJS)

* PrismaClient MUST only be used in:

  * Infrastructure layer
  * Repositories / data access services

---

### Forbidden

❌ Using Prisma in:

* Controllers
* Domain layer
* Application services (business logic)

---

### Frontend (Next.js)

* MUST NOT use Prisma for business logic
* MUST call backend APIs

---

## 🚫 Forbidden Patterns

### 1. Missing Audit Fields

```ts
model User {
  id String @id
}
```

→ ❌ INVALID

---

### 2. Using String Instead of Enum

```ts
role String
```

→ ❌ INVALID

---

### 3. Direct Prisma in Controller

```ts
@Get()
async getUsers() {
  return this.prisma.user.findMany();
}
```

→ ❌ INVALID

---

### 4. Business Logic in DB Layer

```ts
if (user.role === 'admin') {}
```

→ ❌ NOT ALLOWED

---

## 🧪 Migration Rules

* MUST use Prisma migration commands
* MUST NOT manually edit database
* Schema and DB MUST stay in sync

---

## 🧠 AI Coding Rules

When generating Prisma schema:

* ALWAYS include `id`, `createdAt`, `updatedAt`
* ALWAYS use enums for roles/status
* ALWAYS define relations explicitly
* NEVER skip audit fields

When generating backend code:

* NEVER access Prisma outside infrastructure layer
* ALWAYS use repository/service abstraction

---

## ✅ Summary

* Schema → strictly defined in Prisma
* Access → restricted by layers
* Audit → mandatory
* Enums → required for fixed values

This rule is **MANDATORY** for all database-related code.
