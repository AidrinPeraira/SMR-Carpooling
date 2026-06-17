# Coding Conventions

Follow these rules to keep the codebase consistent and high quality.

## 1. General Rules
-   **Language**: TypeScript for everything.
-   **Package Manager**: `pnpm`. Use `pnpm install` and `pnpm run`.
-   **Formatting**: Prettier is used. Run `pnpm run format` before committing.
-   **Linting**: ESLint is configured. Fix all warnings and errors.

## 2. Naming Conventions
-   **Files/Folders**: Use kebab-case for everything (e.g., `user-service`, `user-repository.ts`).
-   **Classes**: PascalCase (e.g., `SignUpUserUseCase`).
-   **Interfaces**: PascalCase prefixed with `I` (e.g., `IUserRepository`).
-   **Variables/Functions**: camelCase.
-   **Constants/Enums**: UPPER_SNAKE_CASE.

## 3. Backend Conventions (Clean Architecture)
-   **Dependency Injection**: Always inject dependencies via constructors using interfaces.
-   **No Cross-Layer Leaks**: Infrastructure details (like Mongoose models) should never leak into the Domain or Application layers.
-   **Mappers**: Use mappers to convert between Entities and DTOs in the Presentation layer.
-   **Validation**: Use Zod (in `@smr/shared`) for request body validation.

## 4. Git & Commits
-   **Branching**: Follow GitFlow. `feat/service/description`, `fix/service/description`.
-   **Commit Format**:
    ```text
    <type>: <short description> (#<issue_number>)

      Modules Touched:
       - <Service Name>

      Things Done:
       - <Detail 1>
       - <Detail 2>
    ```

## 5. Documentation
-   **JSDoc**: Use JSDoc for all classes and public methods to explain intent and parameters.
-   **Comments**: Use comments only for "Why", not "What". Code should be self-explanatory.
