# Next.js 16 (App Router) – Architecture & Naming Convention Guide

## 🎯 Purpose

Provide a **production-ready, scalable, and consistent structure** for the `apps/web` frontend, including:

- Folder architecture
- Naming conventions
- Component structure
- Error handling strategy
- Better Auth client location

---

# 📦 1. Project Structure

```
apps/web/src/
├── app/                          # Routing layer ONLY (App Router files)
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   └── users/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       ├── error.tsx
│   │       ├── not-found.tsx
│   │       └── _components/
│   ├── api/
│   │   └── users/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── auth/                         # Better Auth CLIENT (per auth_rules.md)
│   ├── client.ts                 # createAuthClient() instance
│   ├── hooks.ts                  # useSession, useUser
│   └── middleware.ts             # client-side guards
│
├── components/                   # Shared UI (design system)
│   ├── ui/                       # primitives (Button, Card, Input)
│   ├── shared/                   # cross-feature reusable components
│   ├── features/                 # domain-specific composed components
│   └── layouts/                  # layout components (Sidebar, Header)
│
├── modules/                      # Domain-driven business logic (FLAT — not Clean Architecture)
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
│   ├── cn.ts                     # class merging utility
│   ├── variants.ts               # cva variants
│   └── constants.ts
│
├── hooks/                        # cross-module hooks
├── types/                        # cross-module types
├── utils/                        # cross-module utils
├── styles/
│   ├── globals.css
│   ├── theme.css
│   └── tokens.css
└── config/
```

> **Note on layered architecture:** The frontend uses a **flat module structure** (`modules/<domain>/{components, hooks, services, types, utils}`). It does NOT use the backend's Clean Architecture layers (`domain/application/infrastructure/interface`). React components, hooks, and services do not benefit from that layering — see `nx_monorepo_architecture.md` § 4 for the rationale.

---

# 🧭 2. Architecture Principles

## 2.1 app/ (Routing Layer ONLY)

- Contains:
  - `page.tsx`
  - `layout.tsx`
  - `loading.tsx`
  - `error.tsx`
  - `not-found.tsx`
  - `route.ts` (under `app/api/`)
- ❌ No business logic
- ❌ No Tailwind classes (per `ui_rules.md`)

---

## 2.2 modules/ (Domain-driven, flat)

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
- Business logic lives in `hooks/` and `services/`

---

## 2.3 components/ (Shared UI — Design System)

```
components/
├── ui/         # primitives (Button, Card, Input)
├── shared/     # cross-feature reusable components
├── features/   # domain-specific composed components
└── layouts/    # layout components
```

> The four-folder structure (`ui`, `shared`, `features`, `layouts`) is mandated by `ui_rules.md` and `nextjs-design-system.md`. Do NOT use the older `{ui, common, layout}` shape.

---

## 2.4 auth/ (Better Auth Client)

```
auth/
├── client.ts                     # createAuthClient() singleton
├── hooks.ts                      # useSession, useUser
└── middleware.ts                 # client-side route protection helpers
```

### Rules

- MUST live at `apps/web/src/auth/` (top-level, sibling to `app/`) — see `auth_rules.md`
- MUST NOT live in `apps/web/src/modules/` (auth is a cross-cutting concern, not a domain module)
- MUST NOT live in `apps/web/src/lib/` (it owns runtime state, not pure utilities)
- MUST NOT import from `apps/api/` or `better-auth/node` (server-only)
- Symmetry note: backend Better Auth lives at `apps/api/src/modules/auth/infrastructure/`; frontend Better Auth lives at `apps/web/src/auth/`

---

# 🏷️ 3. Naming Conventions

| Artifact | File naming | Example file | Exported identifier |
|---|---|---|---|
| React component | **PascalCase** | `UserCard.tsx` | `UserCard` |
| Reserved Next.js file | lowercase (fixed) | `page.tsx` | (default export) |
| Hook | kebab-case | `use-users.ts` | `useUsers` |
| Service | kebab-case | `user-service.ts` | `userService` / `getUser` |
| Util | kebab-case | `format-date.ts` | `formatDate` |
| Type module | kebab-case | `user-types.ts` | `User`, `UserRole` |
| Constants | kebab-case | `app-constants.ts` | `APP_CONSTANTS` |
| Style | kebab-case | `tokens.css` | — |

### Why React components are PascalCase

- Mirrors the exported identifier (`UserCard.tsx` ↔ `UserCard`)
- Matches the dominant React community convention and the design-system examples in `nextjs-design-system.md`
- Reserved Next.js files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`) keep their **fixed lowercase names** — those are framework contracts, not component names

### Identifier naming (regardless of file)

```tsx
export function UserCard() {}        // PascalCase — components & types
export function useUsers() {}        // camelCase, `use` prefix — hooks
export const USER_STATUS = {} as const;  // UPPER_SNAKE_CASE — constants
```

### Private folders

```
_components/
_hooks/
```

- `_` prefix = private to the route segment
- MUST NOT be reused outside

### Reserved files (STRICT — never rename, never PascalCase)

```
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
route.ts
middleware.ts
```

---

# ⚡ 4. Page Structure

```
app/(dashboard)/users/
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── _components/
    └── UsersList.tsx
```

---

## 4.1 page.tsx (Orchestration only)

```tsx
import { UsersList } from './_components/UsersList';

export default function UsersPage() {
  return <UsersList />;
}
```

---

## 4.2 loading.tsx

```tsx
import { LOADING_LABEL } from '@/lib/constants';

export default function Loading(): JSX.Element {
  return <div>{LOADING_LABEL}</div>;
}
```

---

## 4.3 error.tsx

```tsx
'use client';

import { ERROR_LABELS } from '@/lib/constants';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  return (
    <div>
      <p>{ERROR_LABELS.GENERIC}</p>
      <button onClick={reset}>{ERROR_LABELS.RETRY}</button>
    </div>
  );
}
```

---

## 4.4 not-found.tsx

```tsx
import { NOT_FOUND_LABEL } from '@/lib/constants';

export default function NotFound(): JSX.Element {
  return <div>{NOT_FOUND_LABEL}</div>;
}
```

---

# 🔁 5. Data Flow

```
UI (Component)
   ↓
Hook (useX)
   ↓
Service
   ↓
Fetcher
   ↓
API (apps/api)
```

---

# 🧠 6. Best Practices

## ✅ DO

- Separate UI / Logic / Data
- Use domain-based modules
- Centralize error handling via `AppError`
- Keep `page.tsx` clean and side-effect-free
- Name component files PascalCase, everything else kebab-case
- Pull all user-facing strings from constants

## ❌ DON'T

- Put business logic in `page.tsx`
- Fetch directly in large UI components
- Hardcode error messages or labels
- Cross-import between modules
- Import `@prisma/client`, `better-auth/node`, or any backend-only package

---

# 🔥 7. TL;DR

- `app/` = routing only (lowercase reserved filenames)
- `modules/` = business logic (flat layout)
- `components/` = shared UI (`{ui, shared, features, layouts}`)
- `auth/` = Better Auth client (top-level)
- Naming = **PascalCase for React components, kebab-case for everything else**
- Errors = structured with code (`AppError`)
