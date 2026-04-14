# Next.js Design System (TailwindCSS 4)

## 1. Overview

This document defines the design system for UI development using:

* TailwindCSS 4 (CSS-first)
* Token-driven styling
* Component-based architecture

---

## 2. Goals

* Consistent UI across the system
* Scalable for large teams
* Single source of truth for styling
* Maintainable and reusable components

---

## 3. Folder Structure

```
src/
  components/
    ui/
    shared/
    features/
    layouts/

  styles/
    globals.css
    theme.css
    tokens.css

  lib/
    cn.ts
    variants.ts
```

---

## 4. Styling Architecture

### Design Flow

```
Tokens → Theme → Components → UI
```

---

## 5. Token Layer

`tokens.css`

```css
:root {
  --color-primary: 59 130 246;
  --color-secondary: 99 102 241;
  --color-danger: 239 68 68;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
```

---

## 6. Theme Layer

`theme.css`

```css
@theme {
  --color-primary: rgb(var(--color-primary));
  --color-secondary: rgb(var(--color-secondary));
  --color-danger: rgb(var(--color-danger));

  --spacing-xs: var(--spacing-xs);
  --spacing-sm: var(--spacing-sm);
  --spacing-md: var(--spacing-md);
  --spacing-lg: var(--spacing-lg);
  --spacing-xl: var(--spacing-xl);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
}
```

---

## 7. Component Architecture

### Layers

* ui → primitive components
* shared → reusable components
* features → domain components
* layouts → layout components

---

## 8. Variant System

```ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        danger: "bg-danger text-white",
      },
      size: {
        sm: "h-8 px-sm",
        md: "h-10 px-md",
        lg: "h-12 px-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

---

## 9. Utility Layer

### cn()

Used to merge Tailwind classes safely.

---

## 10. Layout System

### Container

```
max-w-screen-xl mx-auto px-lg
```

---

### Spacing Scale

```
xs / sm / md / lg / xl
```

---

## 11. Naming System

### Tokens

* Colors → primary, secondary, danger
* Spacing → xs, sm, md, lg, xl
* Radius → sm, md, lg

---

### Components

```
Button.tsx
Card.tsx
UserCard.tsx
```

---

## 12. Theming

```css
[data-theme="dark"] {
  --color-primary: 147 197 253;
}
```

---

## 13. Final Architecture

```
@theme → Tokens → Components → UI
```

---

## 14. Summary

This design system ensures:

* Consistent UI
* Reusable components
* Centralized styling
* Scalable frontend architecture
