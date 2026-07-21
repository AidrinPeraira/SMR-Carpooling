# Express 5 & Mongoose 9 Guidelines

This project leverages the latest versions of **Express (v5.2+)** and **Mongoose (v9.6+)** to implement the presentation and infrastructure layers of our backend services.

---

## 1. Express 5: Async Error Propagation

Express 5 native support for Promise rejection changes how we handle async controller methods and middlewares.

### Key Rule: No Boilerplate `try/catch` in Controllers

In Express 4, unhandled promise rejections would crash the application or hang the request. Developers had to use helper wrappers (like `express-async-errors`) or wrap every controller action in a `try/catch` and call `next(err)`.

- **Express 5 handles this automatically.** When a controller or middleware is async and throws an error or rejects a promise, Express 5 automatically catches it and passes it to the global error middleware.
- **Do not** wrap whole controller functions in `try/catch` blocks just to call `next(err)`. Write cleaner, linear code.

#### ❌ Incorrect Pattern (Express 4 Boilerplate)

```typescript
async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userData = toSignUpDTO(req.body);
    const newUser = await this._signUpUserUseCase.execute(userData);
    res.status(201).json(makeSuccessResponse("Registered", newUser));
  } catch (error) {
    next(error); // Boilerplate! Unnecessary in Express 5
  }
}
```

#### ✅ Correct Pattern (Express 5 Async Route Handler)

```typescript
// Express 5 automatically catches any exceptions or rejections from execute() and routes them to app.use((err, req, res, next) => {})
async signup(req: Request, res: Response): Promise<void> {
  const userData = toSignUpDTO(req.body);
  const newUser = await this._signUpUserUseCase.execute(userData);
  res.status(HttpStatusCodes.Created).json(
    makeSuccessResponse<SignUpResult>(
      UserSuccessMessage.REGISTERED,
      toSignUpResult(newUser),
    )
  );
}
```

---

## 2. Mongoose 9: Schema and Model Type Definitions

Mongoose 9 provides optimized typing for TypeScript.

### Key Rule: Prefer Lean Queries

Always use `.lean()` for read-only queries. It bypasses Mongoose document instantiation, resulting in 5-10x faster execution and cleaner JS objects that align with our Clean Architecture domain entities.

### Key Rule: Separate Mongoose Schema from Domain Entities

Ensure Mongoose models and database schemas are stored strictly inside the `infrastructure/database/models/` folder.

- Domain entities in `domain/entities/` must not import anything from `mongoose`.
- Infrastructure repositories in `infrastructure/repository/` must perform the mapping from Mongoose documents to Domain entities (using a Mapper class if needed).

#### Example Model Definition (`infrastructure/database/models/UserModel.ts`)

```typescript
import { Schema, model, Document } from "mongoose";

export interface IUserDocument extends Document {
  userId: string;
  emailId: string;
  passwordHash: string;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["Passenger", "Driver"], default: "Passenger" },
  },
  { timestamps: true },
);

export const UserModel = model<IUserDocument>("User", UserSchema);
```
