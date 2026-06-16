# Testing Strategy (Solo Developer)

The goal is **confidence without slowing down delivery**. We do not aim for 100% test coverage. We test only what is absolutely necessary to prevent critical bugs. **Functionality comes first; tests follow only where they add real value.**

## Our Strategy: Pragmatic Testing

- **Vitest** is our single test runner across the entire monorepo.
- **Don't test the framework:** Trust Next.js, your backend framework, and your database to do their jobs.
- **Storybook covers the UI:** Visual components are handled in Storybook. We skip separate UI unit tests.

## Recommended Folder Structure

Inside each service (e.g., `user-service/`), use this structure to keep things organized:

```text
tests/
├── unit/       # Logic tests mirroring the 'src' folder structure.
├── fixtures/   # Reusable mock data containers.
│   ├── constants/ # Shared simple values (MOCK_USER_ID, MOCK_TOKEN).
│   └── dto/       # Factory functions for DTOs (Request/Result).
└── mocks/      # Shared fake classes for repositories or services.
```

## What to Test (ONLY THE NECESSARY)

1. **Core Business Logic:** Complex Use Cases, money calculations, or intricate state changes.
2. **Shared Utilities:** Helper functions or error mappers used by multiple services.
3. **Complex Frontend Logic:** High-value custom hooks or critical state management.
   _Rule of thumb: Skip testing simple CRUD, basic API wiring, and "dumb" UI components._

## Steps to Write a Test

1. **Mirror the Source:** Place your test in `tests/unit/` following the same path as the file in `src`.
2. **Use Fixtures, Constants & DTOs:** Use the `fixtures/` subfolders to stay organized. `constants/` for IDs and `dto/` for factory functions. This ensures your mocks and expected results always match.
3. **Mock Dependencies:** Use `vi.fn()` or "Fake" classes to mock repositories/interfaces. Never hit a real DB.
4. **Follow Arrange-Act-Assert:**
   - **Arrange:** Set up mock data and dependencies.
   - **Act:** Execute the function (use `await` for async).
   - **Assert:** Use `toStrictEqual()` for objects and `toBe()` for simple values.

## Master Example

For a complete, "all-in-one" example of how to write a test, refer to:
`smr-backend/user-service/tests/unit/application/use-case/SignUpUserUseCase.test.ts`
_(Note: This file is a great reference for seeing the core concepts in one place before you start splitting them into folders.)_

```typescript
// Simple Test Template
import { describe, it, expect, vi } from "vitest";

describe("FeatureLogic", () => {
  it("should return success when input is valid", async () => {
    // 1. Arrange
    // 2. Act
    // 3. Assert
  });
});
```
