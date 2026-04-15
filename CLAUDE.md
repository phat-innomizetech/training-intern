# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Project Name:** Auth + User Management System (Monorepo)

This is an intern assignment project that demonstrates a production-ready, full-stack monorepo architecture combining NestJS (backend), NextJS (frontend), Better Auth (authentication), and NX (monorepo tooling). The project covers authentication, user management, and role-based access control (RBAC).

### What This Project Is

A full-stack authentication and user management system built inside an NX monorepo. It serves as both a learning exercise and a reference architecture for:

- Structuring a scalable monorepo with shared libraries
- Integrating Better Auth across a NextJS frontend and NestJS backend
- Enforcing RBAC at the server level using NestJS Guards
- Protecting frontend routes using NextJS Middleware
- Managing users and permissions with two roles: **Admin** and **User**

### Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | NX |
| Frontend | NextJS 16 (App Router) |
| Backend | NestJS (Clean Architecture) |
| Authentication | Better Auth |
| Database | PostgreSQL (or SQLite for dev) |
| ORM | Prisma |
| Language | TypeScript |
| Package Manager | Bun |
| Styling | TailwindCSS 4 (token-driven design system) |

### Functional Targets

**Authentication**
- Register, Login, Logout
- Database-backed session management
- Protected routes (frontend + backend)
- Session refresh (if applicable)

**User Management (Admin only)**
- CRUD operations on users
- List all users
- View user details
- Update user role

**Permission Management (RBAC)**

| Feature | Admin | User |
|---|---|---|
| CRUD users | ✅ | ❌ |
| Access dashboard | ✅ | ❌ |
| View own profile | ✅ | ✅ |

- Guards enforced in NestJS (backend — primary enforcement)
- Middleware / permission logic in NextJS (frontend — secondary enforcement)
- Permissions are **never** based solely on UI visibility

---

## Expected Monorepo Structure

```
apps/
  web/          ← NextJS frontend (App Router)
  api/          ← NestJS backend (Clean Architecture)

libs/
  shared-types/ ← TypeScript interfaces, DTOs, RBAC Role Enums
  config/       ← Environment variables, workspace-wide constants
  utils/        ← Shared helpers (validation, date formatting, etc.)
```

---

## Architecture Guides in `.claude/contexts/architecture/`

Read these before implementing any layer:

| File | Purpose |
|---|---|
| `nx_monorepo_architecture.md` | **ALWAYS follow** — NX workspace structure, RBAC enforcement, app/lib separation |
| `database_architecture.md` | Prisma schema rules, DB access patterns |
| `rbac_policy.md` | Role definitions and permission matrix for Admin/User |
| `backend/nestjs_architecture.md` | Clean Architecture layers for NestJS (Domain/Application/Infrastructure/Interface) |
| `backend/nestjs_types_constants_architecture.md` | Type and constant isolation per layer |
| `backend/api_error_response_architecture.md` | Unified API response and error format |
| `frontend/nextjs_architechture.md` | App Router structure, module organization, data flow |
| `frontend/nextjs-design-system.md` | TailwindCSS 4 token-driven design system |
| `auth/better_auth_strategy.md` | Better Auth integration strategy across frontend and backend |

---

## Enforcement Rules in `.claude/rules/`

These rules are **always active** and must not be violated:

### Common Rules

| File | Scope |
|---|---|
| `common/coding-style.md` | Immutability, KISS/DRY/YAGNI, file organization, naming |
| `common/security.md` | No hardcoded secrets, input validation, SQL injection prevention |
| `common/testing.md` | 80% minimum coverage, TDD workflow (RED → GREEN → REFACTOR) |
| `common/git-workflow.md` | Conventional commits, PR workflow |
| `common/development-workflow.md` | Research → Plan → TDD → Review → Commit pipeline |
| `common/code-review.md` | When and how to review, severity levels |
| `common/patterns.md` | Repository pattern, API response format |
| `common/agents.md` | Agent delegation and parallel execution |
| `common/hooks.md` | Hook types, TodoWrite best practices |
| `common/performance.md` | Model selection, context window management |

### TypeScript / JavaScript Rules

| File | Scope |
|---|---|
| `typescript/coding-style.md` | Types, interfaces, `any` avoidance, immutability, error handling, Zod validation |
| `typescript/testing.md` | Playwright for E2E, test framework choices |
| `typescript/security.md` | Secret management patterns |
| `typescript/patterns.md` | API response types, custom hooks, repository interface |
| `typescript/hooks.md` | Prettier, TypeScript check, console.log warning |

### Backend Rules (NestJS)

| File | Scope |
|---|---|
| `backend/nestjs_rules.md` | Clean Architecture enforcement — no logic in controllers, layer boundaries |
| `backend/nestjs_rbac_rules.md` | `@Roles()` decorator required on all endpoints, `AuthGuard` + `RolesGuard` mandatory |
| `backend/nestjs_types_constants_rules.md` | No `any`, no cross-layer type leakage, constants over magic strings |
| `backend/api_response_rules.md` | Standardized `{ success, data }` / `{ success, error }` response shape |

### Frontend Rules (NextJS)

| File | Scope |
|---|---|
| `frontend/nextjs_rules.md` | app/ routing only, business logic in modules, naming conventions |
| `frontend/ui_rules.md` | No Tailwind in page.tsx, design tokens only, `cva` + `cn()` required |

### Auth Rules

| File | Scope |
|---|---|
| `auth/auth_rules.md` | `AuthGuard` on all protected routes, session via Better Auth, no client-side role trust |

### Database Rules

| File | Scope |
|---|---|
| `database/database_rules.md` | Prisma only, audit fields required, enums for roles, Prisma access restricted to infrastructure layer |

---

## Agents in `.claude/agents/`

Use these agents proactively. Do not wait to be asked:

| Agent | When to Use |
|---|---|
| `planner.md` | Before any new feature — creates phased implementation plans |
| `architect.md` | Architectural decisions, system design, trade-off analysis |
| `tdd-guide.md` | New features, bug fixes — enforces RED → GREEN → REFACTOR |
| `code-reviewer.md` | After writing or modifying any code |
| `security-reviewer.md` | Auth code, API endpoints, user input handling, before any commit |
| `typescript-reviewer.md` | All TypeScript/JavaScript changes |
| `database-reviewer.md` | Schema design, migrations, query optimization |

---

## Skills in `.claude/skills/`

Reference these for implementation guidance:

| Skill | When to Use |
|---|---|
| `tdd-workflow/SKILL.md` | Full TDD workflow with mocking patterns and coverage verification |
| `security-review/SKILL.md` | OWASP Top 10 checklist, secrets management, input validation |
| `security-review/cloud-infrastructure-security.md` | Cloud deployment, IAM, CI/CD security |
| `backend-patterns/SKILL.md` | Repository pattern, service layer, middleware, caching, rate limiting |
| `frontend-patterns/SKILL.md` | React composition, hooks, state management, performance, forms |
| `api-design/SKILL.md` | REST conventions, status codes, pagination, error responses, versioning |
| `database-migrations/SKILL.md` | Safe Prisma migrations, zero-downtime patterns, rollback strategy |
| `docker-patterns/SKILL.md` | Docker Compose for local dev, multi-stage builds, container security |
| `deployment-patterns/SKILL.md` | CI/CD pipelines, health checks, rollback, production checklist |
| `e2e-testing/SKILL.md` | Playwright Page Object Model, flaky test handling, CI integration |
| `everything-claude-code/SKILL.md` | Repo-specific commit conventions and workflow patterns |

---

## Commands in `.claude/commands/`

| Command | Purpose |
|---|---|
| `plan.md` | `/plan` — Invoke planner agent, wait for confirmation before coding |
| `tdd.md` | `/tdd` — TDD workflow (delegates to `tdd-workflow` skill) |
| `feature-development.md` | `/feature-development` — Standard feature implementation scaffold |
| `database-migration.md` | `/database-migration` — Database schema change workflow |
| `add-language-rules.md` | `/add-language-rules` — Add new language rules to the system |

---

## Running Tests

```bash
# Run all tests
node tests/run-all.js

# Run individual test files
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
node tests/hooks/hooks.test.js
```

---

## Key Conventions

- **Package manager:** Bun (configured in `.claude/package-manager.json`)
- **Commits:** Conventional commits — `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- **File naming:** `lowercase-kebab-case` for all files
- **Test files:** `*.test.js` / `*.test.ts` pattern
- **No `console.log`** in production code — use structured logging
- **No `any`** in TypeScript — use `unknown` and narrow safely
- **No hardcoded secrets** — use `process.env` and validate at startup

---

## Development Workflow

1. **Research** — Search existing implementations before writing new code
2. **Plan** — Use `/plan` to create an implementation plan before touching code
3. **TDD** — Write tests first (RED), implement (GREEN), refactor (IMPROVE)
4. **Review** — Code reviewer agent runs after every change
5. **Security check** — Security reviewer runs before any commit touching auth/API/input
6. **Commit** — Conventional commit format with descriptive message

---

## Skills Reference (Table of Contents)

For the full set of 181+ skills, agents, and commands, see `.claude/AGENTS.md`.

For project-specific conventions extracted from git history, see `.claude/skills/everything-claude-code/SKILL.md`.