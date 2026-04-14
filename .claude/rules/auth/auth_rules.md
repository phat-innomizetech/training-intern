# Authentication & RBAC Enforcement Rules (Better Auth)

## 🔒 Core Rules

* All protected endpoints MUST require authentication
* Backend MUST validate session on every request
* Frontend MUST NOT be trusted for authorization
* RBAC MUST be enforced at controller level

---

## 🛡️ Authentication (MANDATORY)

### Backend Requirements

* MUST extract session token from:

  * Authorization header OR cookies
* MUST validate session using Better Auth
* MUST attach authenticated user to request context

---

## 👤 User Injection

A custom decorator MUST be used:

```ts
@User() user: AuthenticatedUser
```

### Rules:

* MUST contain user id
* MUST contain user role
* MUST come from validated session

---

## 🧩 Auth Guard (REQUIRED)

All protected routes MUST use AuthGuard:

```ts
@UseGuards(AuthGuard)
```

### Responsibilities:

* Validate session
* Reject unauthenticated requests
* Attach user to request

---
## 🚫 Forbidden Patterns

### Missing Auth Guard

```ts
@Get()
async getUsers() {}
```

→ ❌ INVALID


## 🧠 Session Validation Rules

* MUST validate against database
* MUST reject expired or invalid sessions
* MUST NOT trust unsigned tokens

---

## 🌐 Frontend Rules (Next.js)

### Session Usage

* MUST retrieve session from shared auth client
* MUST use session for UI rendering only

---

### Route Protection

* MUST protect admin routes (e.g., `/admin`)
* MUST redirect unauthorized users

---

## 🧪 Enforcement Checklist

Before completing auth-related code:

* [ ] AuthGuard is applied
* [ ] User is injected via decorator
* [ ] Session is validated via Better Auth

---

## 🧠 AI Coding Rules

When generating code:

* ALWAYS include AuthGuard
* NEVER skip authentication

---

## ✅ Summary

* Authentication → AuthGuard
* Session source → Better Auth

This rule is **MANDATORY** for all backend services.
