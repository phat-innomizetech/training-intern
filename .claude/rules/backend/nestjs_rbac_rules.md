# RBAC Enforcement Rules (NestJS)

## 🔒 Core Principle

* **Deny by default**.
* Every protected route **MUST require authentication**.
* Every route **MUST explicitly define role access** using `@Roles()`.
* Never rely on frontend for authorization.

---

## 🧠 Source of Truth

* Role definitions and permission matrix are defined in:

  * `contexts/architecture/security/rbac_policy.md`
* This rule file only defines **how to enforce**, not redefine roles.

---

## 🛡️ Required Guards

All protected controllers **MUST** use:

```ts
@UseGuards(AuthGuard, RolesGuard)
```

* `AuthGuard`: validates session (Better Auth)
* `RolesGuard`: validates role permissions

❗ Missing either guard = **SECURITY VIOLATION**

---

## 🏷️ Roles Decorator (MANDATORY)

Every route handler **MUST** include `@Roles(...)`.

### ✅ Correct

```ts
@Get()
@Roles('admin')
async getAllUsers() {}
```

### ❌ Incorrect

```ts
@Get()
async getAllUsers() {}
```

→ Missing `@Roles` = **REJECT**

---

## 👤 Current User Access Pattern

### Get Current User

```ts
@Get('me')
@Roles('admin', 'user')
async getProfile(@User() user: UserEntity) {
  return user;
}
```

### Rules:

* `user` can only access **their own data**
* Never allow user to pass arbitrary `id` to fetch others

---

## 🚫 Forbidden Patterns

### 1. Missing Role Check

```ts
@Get()
async getAllUsers() {}
```

### 2. Manual Role Checking in Service

```ts
if (user.role === 'admin') { ... }
```

→ ❌ NEVER do this
→ ✔ Always use `RolesGuard`

---

### 3. Trusting Client Role

```ts
const role = req.body.role;
```

→ ❌ NEVER trust client input

---

## 🧩 RolesGuard Requirements

### MUST:

* Extract role from **Better Auth session**
* Compare against `@Roles()` decorator
* Throw `ForbiddenException` if not allowed

### Example Logic:

```ts
const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);

if (!requiredRoles) return true;

if (!requiredRoles.includes(user.role)) {
  throw new ForbiddenException();
}
```

---

## 🔐 AuthGuard Requirements

### MUST:

* Validate session via Better Auth
* Attach user to request context

```ts
request.user = session.user;
```

---

## 🧱 Controller-Level Protection (Recommended)

You SHOULD define base roles at controller level:

```ts
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {}
```

---

## 🧪 Enforcement Checklist (MANDATORY)

Before completing any RBAC-related code, ensure:

* [ ] All controllers use `AuthGuard` + `RolesGuard`
* [ ] All endpoints have `@Roles()`
* [ ] No manual role checks in services
* [ ] No client-side role trust
* [ ] User can only access their own resources
* [ ] Admin-only routes are strictly protected

---

## ⚠️ Failure Handling

If any rule above is violated:

* The implementation is **INVALID**
* Must be **rewritten before approval**

---

## 🧠 AI Coding Behavior Rules

When generating code:

* ALWAYS include guards
* ALWAYS include `@Roles`
* NEVER skip authorization for "simple" endpoints
* NEVER assume default access

---

## ✅ Summary

* Authentication = `AuthGuard`
* Authorization = `RolesGuard`
* Access Control = `@Roles()`
* Default = DENY

RBAC is **NOT OPTIONAL**. It is **MANDATORY SECURITY LAYER**.
