# NestJS Architecture Rules (Enforcement)

## 🔒 Core Enforcement

* All modules MUST follow Clean Architecture
* Business logic MUST NOT exist in controllers
* Domain MUST be framework-independent
* Layer boundaries MUST NOT be violated

---

## 🧱 Layer Rules

### Domain Layer

* MUST NOT import NestJS
* MUST NOT access database
* MUST only contain business logic

---

### Application Layer

* MUST contain use cases only
* MUST NOT access database directly
* MUST use repository interfaces

---

### Infrastructure Layer

* MUST implement repository interfaces
* MUST handle database and external services
* MUST NOT contain business logic

---

### Interface Layer

* MUST handle request/response only
* MUST call application layer
* MUST NOT contain business logic

---

## 🧩 Use Case Rules

Each use case MUST:

* Be a separate class
* Have a single responsibility
* Expose an `execute()` method

### Example

```ts
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: CreateUserDto) {
    // business logic
  }
}
```

---

## 🏷️ Dependency Injection Rules

* MUST use interface-based injection

```ts
{
  provide: 'UserRepository',
  useClass: UserRepositoryImpl,
}
```

* MUST inject via constructor
* MUST NOT instantiate dependencies manually

---

## 📦 DTO Rules

* MUST use class-based DTOs
* MUST use validation decorators

Example:

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;
}
```

---

## 🔄 Mapper Rules

* MUST map between:

  * DTO ↔ Domain
  * Domain ↔ Persistence

* MUST NOT expose database schema to Domain

---

## 🚫 Forbidden Patterns

### Business logic in controller

```ts
@Post()
async create() {
  // logic
}
```

---

### Direct DB access in use case

```ts
this.prisma.user.create()
```

---

### Import NestJS in domain

```ts
import { Injectable } from '@nestjs/common';
```

---

### Tight coupling

```ts
constructor(private repo: UserRepositoryImpl)
```

---

## 🧪 Enforcement Checklist

* [ ] Layers are respected
* [ ] Controllers are thin
* [ ] Use cases exist
* [ ] Repository interfaces are used
* [ ] DTOs validated
* [ ] Domain is pure

---

## 🧠 AI Coding Rules

When generating code:

* ALWAYS create use case layer
* NEVER skip application layer
* NEVER put logic in controller
* ALWAYS follow DI pattern

---

## ✅ Summary

* Domain → business logic
* Application → orchestration
* Infrastructure → external systems
* Interface → request handling

Clean Architecture is **MANDATORY**.
