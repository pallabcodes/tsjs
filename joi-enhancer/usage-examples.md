# ✅ Checklist: Other Usage Examples

`/src/examples` directory already covers the following use cases:

### 🔹 Basic Usage & Type Inference

* `consumer-usage.ts`
* `joi-infer-type.ts`

---

### 🔹 Conditional Logic

* `consumer-usage.ts`
* `usage.ts`
* `type-safe-conditional.ts`

---

### 🔹 Alternatives / Conditional Fields

* `consumer-usage.ts`
* `usage.ts`

---

### 🔹 Stripping Fields

* `consumer-usage.ts`
* `helpers.test.ts`

---

### 🔹 Custom Error Formatting

* `format-error.ts`
* `custom-error.ts`

---

### 🔹 Type Guards

* `type-guards.ts`

---

### 🔹 Schema Fragments / Composition

* `schema-fragments.ts`

---

### 🔹 Helper Tests

* `helpers.test.ts`

---

### 🔹 Deep Partials, Pick/Omit, Merge, etc.

* Covered in: `consumer-usage.ts`
  *(Consider expanding for more clarity if needed.)*

---

### 🔹 Field Masking / Redaction

* Use `.withRedactedFields(['password', ...])` to automatically redact sensitive fields from validated objects.
* Example:
  ```typescript
  const redact = schema.withRedactedFields(['password']);
  const safe = redact(validatedUser);
  // safe.password === '[REDACTED]'
  ```

---

### 🔹 Async Validation Pipeline

Use `.validateAsync(input, [asyncValidator, ...])` to run Joi validation and then custom async checks (e.g., DB uniqueness):

```typescript
await schema.validateAsync(input, [
  async (value) => { if (await existsInDb(value.email)) throw new Error('Email taken'); }
]);
```

---

### ❗ What Was Missing (Now Added)

* **Schema diff / change detection**
  ✅ *Now included in the updated examples above.*

---

Let me know if you’d like this saved as a `.md` file or need a similar checklist for tests or documentation!
