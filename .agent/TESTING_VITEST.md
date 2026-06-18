# Vitest & Testcontainers Guidelines

This guide defines coding standards for writing tests using **Vitest (v4.x)** and **Testcontainers (v12.x)** across the ShareMyRide workspaces.

---

## 1. Testing Framework: Vitest v4
Vitest is our modern TypeScript-first test runner.

### Key Rule: Explicit Mock Typing with `vi.mocked()`
When mocking functions or dependency instances, always wrap them with `vi.mocked(target, options)` to ensure typescript understands the mocked methods (like `mockResolvedValue` or `mockReturnValue`).

```typescript
import { vi, describe, it, expect } from "vitest";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";

const mockUserRepository = {
  findByEmail: vi.fn(),
  save: vi.fn(),
} as unknown as IUserRepository;

// Correct usage of vi.mocked for type safety
vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
```

### Key Rule: Mirror the Source Structure
Store unit tests under the service's `tests/unit/` folder, mirroring the path structure of the code under test in `src/`. For example:
*   Code: `src/application/use-case/auth/SignUpUserUseCase.ts`
*   Test: `tests/unit/use-cases/auth/SignUpUserUseCase.test.ts`

---

## 2. Integration Testing with Testcontainers v12
We use Testcontainers to spin up temporary, isolated Docker containers (such as MongoDB, Redis, or RabbitMQ) during integration testing.

### Key Rule: Lifecycle Management in `beforeAll` / `afterAll`
Make sure containers are instantiated once before all tests run and properly stopped afterward to prevent container leakage and port collisions.

#### Example Mongoose + MongoDB Integration Test Setup
```typescript
import { MongoDBContainer, StartedMongoDBContainer } from "@testcontainers/mongodb";
import mongoose from "mongoose";
import { describe, beforeAll, afterAll, it, expect } from "vitest";

describe("User MongoDB Repository Integration", () => {
  let mongoContainer: StartedMongoDBContainer;

  beforeAll(async () => {
    // Spin up container dynamically
    mongoContainer = await new MongoDBContainer("mongo:6.0").start();
    const uri = mongoContainer.getConnectionString();
    
    // Connect mongoose
    await mongoose.connect(uri);
  }, 30000); // 30s timeout to allow container pull/start

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoContainer.stop();
  });

  it("should persist user document", async () => {
    // Perform database operations and assert results...
  });
});
```
