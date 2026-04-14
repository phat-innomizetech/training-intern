# Next.js 16 (App Router) – Architecture & Naming Convention Guide

## 🎯 Purpose
Provide a **production-ready, scalable, and consistent structure** for Next.js 16 projects, including:
- Folder architecture
- Naming conventions
- Component structure
- Error handling strategy

---

# 📦 1. Project Structure

```
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   └── users/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       ├── error.tsx
│   │       ├── not-found.tsx
│   │       └── _components/
│   │
│   ├── api/
│   │   └── users/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── common/
│   └── layout/
│
├── modules/
│   └── user/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── lib/
│   ├── fetcher.ts
│   ├── error.ts
│   └── constants.ts
│
├── hooks/
├── types/
├── utils/
└── config/
```

---

# 🧭 2. Architecture Principles

## 2.1 app/ (Routing Layer Only)

- Contains:
  - page.tsx
  - layout.tsx
  - loading.tsx
  - error.tsx
  - not-found.tsx
- ❌ No business logic

---

## 2.2 modules/ (Domain-driven)

Each domain is isolated:

```
modules/user/
├── components/
├── hooks/
├── services/
├── types/
└── utils/
```

### Rules
- One domain = one module
- No cross-module coupling
- Business logic lives here

---

## 2.3 components/ (Shared UI)

```
components/
├── ui/        # design system
├── common/    # reusable components
└── layout/    # layout components
```

---

# ⚡ 3. Page Structure

```
app/(dashboard)/users/
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── _components/
```

---

## 3.1 page.tsx (Orchestration only)

```tsx
import { UsersList } from "./_components/users-list";

export default function UsersPage() {
  return <UsersList />;
}
```

---

## 3.2 loading.tsx

```tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

---

## 3.3 error.tsx

```tsx
"use client";

export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

---

## 3.4 not-found.tsx

```tsx
export default function NotFound() {
  return <div>404 - Not Found</div>;
}
```
# 🔁 4. Data Flow

```
UI (Component)
   ↓
Hook (useX)
   ↓
Service
   ↓
Fetcher
   ↓
API Route
```

---

# 🧠 5. Best Practices

## ✅ DO
- Separate UI / Logic / Data
- Use domain-based modules
- Centralize error handling
- Keep page.tsx clean

## ❌ DON'T
- Put business logic in page.tsx
- Fetch directly in large UI components
- Hardcode error messages
- Cross-import between modules

---

# 🔥 6. TL;DR

- app/ = routing only
- modules/ = business logic
- components/ = shared UI
- naming = depends on file type (NOT all kebab-case)
- error = structured with code



