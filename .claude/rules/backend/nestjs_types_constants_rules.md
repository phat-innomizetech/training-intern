# Types & Constants Rules (Enforcement)

## 🔒 Core Rules

* Types MUST follow layer isolation
* Types MUST NOT leak across layers
* `any` is strictly forbidden
* Constants MUST replace magic strings

---

## 🧱 Layer Type Rules

### Domain

* MUST contain only business types
* MUST NOT include:

  * DTO
  * Database schema
  * API response

---

### Application

* MUST define input/output types
* MUST NOT contain business logic

---

### Infrastructure

* MUST reflect database/external schema
* MUST NOT be used in Domain

---

### Interface

* MUST define response types only
* MUST NOT be reused in other layers

---

## 🚫 Forbidden Patterns

### Reusing Types Across Layers

```ts
// ❌ DTO used in domain
```

---

### Using `any`

```ts
let data: any;
```

---

### Dump Types File

```ts
types.ts
```

---

### Magic Strings

```ts
if (status === 'ACTIVE') {}
```

---

## 🧠 Type Rules

* MUST use union types for fixed values

```ts
type Status = 'ACTIVE' | 'INACTIVE';
```

---

* SHOULD use branded types for IDs

```ts
type UserId = string & { readonly brand: unique symbol };
```

---

## 🔢 Constants Rules

* MUST centralize constants
* MUST use `as const`

```ts
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
} as const;
```

---

## 🔄 Mapping Rules

* MUST map between layers
* MUST NOT reuse types directly

---

## 🧪 Enforcement Checklist

* [ ] No `any` used
* [ ] No cross-layer type usage
* [ ] Constants replace magic strings
* [ ] Types are properly separated

---

## 🧠 AI Coding Rules

When generating code:

* NEVER use `any`
* NEVER reuse types across layers
* ALWAYS create proper type per layer
* ALWAYS use constants instead of raw strings

---

## ✅ Summary

* Types are isolated per layer
* Constants replace magic strings
* Mapping is mandatory

This rule is **MANDATORY**.
