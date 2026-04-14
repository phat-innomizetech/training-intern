# API Response & Error Handling Rules (NestJS)

## 🔒 Core Enforcement

* All APIs MUST follow the standardized response format
* NEVER return raw data directly from controllers
* NEVER expose internal errors or stack traces
* NEVER return `null` fields
* Response format MUST be consistent across all endpoints

---

## ✅ Success Response Rules

### REQUIRED Format

```ts
{
  success: true,
  data: <response_data>
}
```

### Optional Meta

```ts
{
  success: true,
  data: <response_data>,
  meta?: {
    requestId?: string
    traceId?: string
    timestamp?: string
  }
}
```

---

## 🛑 Error Response Rules

### REQUIRED Format

```ts
{
  success: false,
  error: {
    code: string
    message: string
    type: 'BUSINESS' | 'VALIDATION' | 'SYSTEM' | 'AUTH'
    details?: Record<string, any>
  }
}
```

---

## 🧠 Mandatory Implementation (NestJS)

### 1. Response Interceptor (REQUIRED)

All applications MUST register a global interceptor:

```ts
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          data,
          ...(data?.meta && { meta: data.meta }),
        };
      }),
    );
  }
}
```

❗ Controllers MUST return raw data only
❗ Interceptor handles wrapping

---

### 2. Global Exception Filter (REQUIRED)

```ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    res.status(exception.status || 500).json({
      success: false,
      error: {
        code: exception.code || 'INTERNAL_ERROR',
        message: exception.message || 'Internal server error',
        type: exception.type || 'SYSTEM',
        ...(exception.details && { details: exception.details }),
      },
    });
  }
}
```

---

## 🔐 Validation Handling Rules

* MUST transform validation errors into structured format
* MUST use `VALIDATION_ERROR` code

### Example Output

```ts
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    type: 'VALIDATION',
    details: {
      email: 'Invalid email format'
    }
  }
}
```

---

## 🚫 Forbidden Patterns

### 1. Returning Raw Response

```ts
return user;
```

→ ❌ INVALID (without interceptor)

---

### 2. Returning Custom Inconsistent Shape

```ts
return {
  message: 'ok'
}
```

→ ❌ INVALID

---

### 3. Exposing Stack Trace

```ts
error: {
  message: exception.stack
}
```

→ ❌ SECURITY VIOLATION

---

### 4. Using Dynamic Error Without Code

```ts
throw new Error('Something went wrong');
```

→ ❌ MUST include error code

---

## 🧩 Error Code Rules

* MUST use UPPER_SNAKE_CASE
* MUST be stable
* MUST be domain-specific

### Examples

* USER_NOT_FOUND
* AUTH_INVALID_TOKEN
* VALIDATION_ERROR

---

## 🔁 Layer Responsibility Rules

* Domain layer → define errors only
* Application layer → handle logic
* Infrastructure → map external errors
* Controller layer → NEVER format response manually

---

## 🧪 Enforcement Checklist

Before completing any API:

* [ ] Response follows standard format
* [ ] Global interceptor is applied
* [ ] Global exception filter is applied
* [ ] No null fields returned
* [ ] All errors have `code`, `type`, `message`
* [ ] Validation errors are structured
* [ ] No raw exceptions exposed

---

## 🧠 AI Coding Rules

When generating code:

* ALWAYS assume interceptor is present
* NEVER wrap response manually in controller
* ALWAYS throw structured errors
* NEVER return inconsistent JSON shape

---

## ✅ Summary

* Success → `{ success: true, data }`
* Error → `{ success: false, error }`
* Interceptor → handles success
* Exception Filter → handles error

This rule is **MANDATORY** for all backend APIs.
