Here’s a clean and concise **Markdown quick guide** for `withCustomValidator` that you can use in documentation or a README:

---

# `withCustomValidator` Quick Guide

## 🔍 What is `withCustomValidator`?

`withCustomValidator` is a method on the `SchemaWrapper` class in `#file:joi-enhancer`.
It allows **type-safe, field-level custom validation** on any field in your Joi schema, integrating smoothly with Joi’s native error system and preserving **TypeScript inference**.

---

## 📍 Where is it Available?

You can use `withCustomValidator` on schemas created with:

* `joi.object(...)`
* `createSchema(...)`

✅ Available on **all main schema creation entry points** in `#file:joi-enhancer`.

---

## ✅ Why Use It?

* Enforce **complex business rules** beyond built-in Joi capabilities (e.g., reserved usernames, cross-field checks).
* Get **TypeScript-safe** validation logic.
* Add **custom error messages** that appear in Joi’s validation output.

---

## 🛠️ Usage Example

```ts
const schema = createSchema({
  username: joi.string()
}).withCustomValidator({
  key: 'username',
  validator: (value, helpers) => {
    if (['admin', 'root'].includes(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  },
  message: 'This username is reserved.'
});
```

**Parameters:**

* `key`: Field name to attach the validator to.
* `validator`: Custom function. Throw or return `helpers.error(...)` to fail validation.
* `message` *(optional)*: Custom error message for Joi.

---

## ✅ Best Practices

* Use for **business logic** not covered by Joi rules.
* Always **return the value if valid**, or **throw/error if invalid**.
* Take advantage of **TypeScript inference** for reliable, predictable validation.

---

## 🧾 Summary Table

| Feature                     | Supported? |
| --------------------------- | ---------- |
| Type-safe custom logic      | ✅          |
| Custom error messages       | ✅          |
| Works with `joi.object()`   | ✅          |
| Works with `createSchema()` | ✅          |
| No breaking changes         | ✅          |

---

`withCustomValidator` makes it easy to enforce real-world rules with type-safe, field-level custom validation — without sacrificing the benefits of Joi or TypeScript.

---

Let me know if you'd like this in a downloadable format (e.g. `.md` file)!
