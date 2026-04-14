# Next.js Architecture Rules (App Router Enforcement)

## 🔒 Core Rules

* app/ MUST be used for routing only
* Business logic MUST NOT exist in page.tsx
* Modules MUST be domain-based
* Components MUST be separated from logic

---

## 🧱 Routing Layer Rules

### app/

* MUST contain only:

  * page.tsx
  * layout.tsx
  * loading.tsx
  * error.tsx
  * not-found.tsx

* MUST NOT contain business logic

* MUST NOT call services directly in complex flows

---

## 📦 Module Rules

* One domain = one module
* MUST NOT import across modules
* Business logic MUST live in:

  * hooks
  * services

---

## 🧩 Component Rules

* MUST be UI only
* MUST NOT contain data fetching logic (complex cases)
* SHOULD receive data via props or hooks

---

## 🏷️ Naming Rules

### File Naming

* Components → kebab-case
* Services → kebab-case
* Utils → kebab-case
* Types → kebab-case

---

### Component Naming

```tsx
export function UserCard() {}
```

* MUST use PascalCase

---

### Hook Naming

```ts
export function useUsers() {}
```

* MUST start with `use`
* MUST use camelCase

---

### Private Folders

```
_components/
_hooks/
```

* `_` prefix = private scope
* MUST NOT be reused outside

---

### Reserved Files (STRICT)

```
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
route.ts
```

* MUST NOT rename

---

## 🚨 Error Handling Rules

### MUST use centralized error structure

```ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number = 500,
    public details?: unknown
  ) {
    super(message);
  }
}
```

---

### API Route Handling

* MUST use try/catch
* MUST return structured error

---

### Fetcher Rules

```ts
export async function fetcher(url: string) {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "Unknown error");
  }

  return json.data;
}
```

---

## 🔁 Data Flow Rules

MUST follow:

```
UI → Hook → Service → Fetcher → API
```

---

## 🚫 Forbidden Patterns

### Business logic in page

```tsx
export default function Page() {
  // logic here
}
```

---

### Direct fetch in large component

```tsx
await fetch(...)
```

---

### Cross-module import

```ts
import from '@/modules/other-module'
```

---

### Hardcoded error

```ts
throw new Error("Something wrong")
```

---

## 🧪 Checklist

* [ ] page.tsx is clean
* [ ] hooks handle logic
* [ ] services handle API
* [ ] naming is correct
* [ ] no cross-module imports

---

## 🧠 AI Coding Rules

When generating code:

* NEVER put logic in page.tsx
* ALWAYS create hooks for logic
* ALWAYS use services for API calls
* ALWAYS follow naming conventions

---

## ✅ Summary

* app → routing
* modules → logic
* components → UI

This rule is **MANDATORY**.
