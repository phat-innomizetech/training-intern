# 🚫 UI & Tailwind Enforcement Rules (Next.js + Design System)

---

# 🔒 1. Core Principles

This project uses a **strict design system architecture**.

You MUST follow:

* Tokens are the **single source of truth**
* UI must be built via **components only**
* Tailwind is **only a rendering tool**, NOT a design system

---

# 🚫 2. Global Forbidden Rules (NON-NEGOTIABLE)

## ❌ 2.1 No Tailwind in `page.tsx`

You MUST NOT use Tailwind classes inside any `page.tsx`.

```tsx
// ❌ FORBIDDEN
export default function Page() {
  return <div className="p-4 bg-white" />;
}
```

---

## ❌ 2.2 No Hardcoded Styles

You MUST NOT use:

* Raw Tailwind colors
* Raw spacing values
* Arbitrary values

```tsx
// ❌ FORBIDDEN
<div className="bg-red-500 p-4 rounded-lg" />
<div className="p-[13px]" />
```

---

## ❌ 2.3 No Inline Conditional Styling

```tsx
// ❌ FORBIDDEN
className={isActive ? "bg-blue-500" : "bg-gray-500"}
```

---

## ❌ 2.4 No Styling Outside Components

```tsx
// ❌ FORBIDDEN
export default function Page() {
  return <div className="p-4" />;
}
```

---

## ❌ 2.5 No Direct UI Duplication

```tsx
// ❌ FORBIDDEN
<button className="..." />
```

👉 ALWAYS use a UI component instead.

---

# ✅ 3. Required Rules (MANDATORY)

## ✅ 3.1 Always Use UI Components

```tsx
<Card />
<Button />
```

---

## ✅ 3.2 Always Use Design Tokens

Allowed:

```tsx
bg-primary px-md rounded-lg
```

Not allowed:

```tsx
bg-blue-500 px-4
```

---

## ✅ 3.3 Styling Must Flow Through Components

Flow MUST be:

```
page → feature → shared → ui
```

---

# 🧱 4. Component Architecture Rules

## Layers

* `ui/` → primitive components (Button, Input, Card)
* `shared/` → reusable cross-feature components
* `features/` → domain-specific components
* `layouts/` → layout components

---

## Component Requirements

All components MUST:

* Be reusable
* Be composable
* Accept `className`
* Use design tokens ONLY

---

# 🎛️ 5. Variant System Rules

## Mandatory

* MUST use `cva` (class-variance-authority)
* MUST centralize all variants

```ts
export const buttonVariants = cva(...)
```

---

## Forbidden

* Inline variant logic
* Conditional Tailwind classes in JSX

---

# 🧠 6. Token Enforcement Rules

## Source of Truth

All tokens MUST come from:

* `tokens.css`
* `theme.css`

---

## Allowed Token Categories

### Colors

* primary
* secondary
* danger

---

### Spacing

* xs / sm / md / lg / xl

---

### Radius

* sm / md / lg

---

## ❌ Forbidden

* `bg-blue-500`
* `p-4`
* `rounded-xl`

---

## ✅ Required

```tsx
bg-primary px-md rounded-md
```

---

# 🔧 7. Utility Rules

## Mandatory

* MUST use `cn()` for class merging

```ts
cn(buttonVariants({ variant }), className)
```

---

## ❌ Forbidden

```ts
className={`p-4 ${isActive && "bg-red-500"}`}
```

---

# 🌗 8. Theme Rules

* MUST use CSS variables
* MUST support theming
* MUST NOT hardcode colors

---

# 📦 9. Layout Rules

Use predefined layout system ONLY:

```tsx
max-w-screen-xl mx-auto px-lg
```

---

# 🤖 10. AI Enforcement Rules (CRITICAL)

When generating code, you MUST:

* NEVER use Tailwind in `page.tsx`
* ALWAYS create a component for UI
* ALWAYS use tokens (no raw values)
* ALWAYS use `cva` for variants
* ALWAYS use `cn()` for class merging

---

## If a required token does NOT exist:

👉 You MUST:

1. STOP
2. Suggest adding a new token
3. DO NOT hardcode

---

# 🧪 11. PR Checklist (STRICT)

All PRs MUST pass:

* [ ] No Tailwind in page
* [ ] No hardcoded styles
* [ ] Uses UI components
* [ ] Uses tokens ONLY
* [ ] Uses CVA
* [ ] Uses cn()

---

# 🚨 12. Enforcement Level

These rules are:

> 🔥 STRICTLY ENFORCED — NO EXCEPTIONS

Any violation MUST be rejected.

---

# ✅ 13. Summary

* Tokens → define design system
* Rules → enforce usage
* Components → enforce structure
* Tailwind → implementation detail ONLY

---
