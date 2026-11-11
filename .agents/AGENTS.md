# Agent Custom Rules

## Chat & Learning Mode

- **Chat-Only Mode**: Act exclusively as a chat partner. Do not modify files or install packages unless explicitly requested and after a plan of changes has been confirmed by the user.
- **Read & Research Only**: You are permitted to read files and run read-only terminal commands to gather context, but strictly avoid writing/updating files or executing environment-mutating commands without explicit approval.
- **Conceptual Learning**: Focus on explaining code, architecture, and concepts rather than jumping straight to implementing changes.

## Tooling & Package Manager

- **Package Manager**: Always use `pnpm` (e.g., `pnpm add`, `pnpm run <script>`, `pnpm test`) instead of `npm` or `yarn` when suggesting or executing commands in this repository.

## Code Quality & Documentation Integrity

- **Preserve Existing Comments**: Never delete or strip existing user comments or docstrings during refactoring, even if they contain typos or minor inaccuracies, unless explicitly instructed by the user. Highlight major inconsistencies verbally instead.

## Monorepo & Shared Package Workflow

- **Rebuild Shared Package**: Whenever modifying or adding DTOs, schemas, or enums in `@sharemyride/shared` (`smr-shared`), always run `pnpm --filter @sharemyride/shared build` so dependent microservices pick up the updated TypeScript declaration files (`dist/`).

## API & Application DTO Casing Convention

- **API/External DTOs (`@sharemyride/shared`)**: Use `snake_case` for all property names in public API request/response types and Zod schemas. Group domain DTOs in dedicated files (e.g. `BookingDTO.ts`, `TripDTO.ts`) and suffix interface names with `DTO` or `Result` (e.g. `DriverBookingItemDTO`, `GetJourneyDetailsResult`).
- **Application DTOs (`src/application/dto/`)**: Use `camelCase` for all internal application DTO property names.
- **Mappers (`src/presentation/v1/mapper/`)**: Always map between `snake_case` API DTOs (validated via Zod) and `camelCase` internal Application DTOs. Explicitly annotate mapper return types with shared DTO interfaces from `@sharemyride/shared`.
- **Frontend Compatibility**: In frontend request helpers (`features/*/api/`), import shared DTOs and export backwards-compatible type aliases (`export type DriverBookingItem = DriverBookingItemDTO;`) to maintain clean component prop types during refactors.

## Database & Prisma Modeling

- **Explicit Foreign Key Relations**: Always define two-way `@relation` attributes in Prisma models (e.g. `driver Driver @relation(...)` on `Trip` and `trips Trip[]` on `Driver`) to enable safe nested `include` queries without runtime errors.

## TypeScript & Frontend Development

- **Strict Error Handling**: Never type caught errors as `any` in `catch` blocks. Always use `catch (error: unknown)` and type-guard the error (e.g., `error instanceof Error ? error.message : "Fallback error"`) before accessing its properties to comply with strict ESLint rules.
- **API Response Type Guarding**: When handling custom `ApiResponse<T>` responses, always verify the success state (`if (data?.success)`) before attempting to access `data.payload`. The `payload` property does not exist on `ApiFailureResponse` and will cause TypeScript build failures if accessed unconditionally.
