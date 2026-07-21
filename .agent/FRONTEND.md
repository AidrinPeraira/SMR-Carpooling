# Frontend Conventions (Next.js)

## 1. Feature Isolation

- All domain-specific logic should live inside `features/[feature-name]`.
- A feature should only expose its public API through an `index.ts` barrel file.
- **Rule**: Never import from another feature's internal folders (e.g., `features/auth/components/LoginForm`). Import from `features/auth` instead.

## 2. Directory Structure

- **api/**: Hooks for data fetching (React Query) or Server Actions.
- **components/**: UI components specific to this feature.
- **types/**: TypeScript definitions for the feature.
- **views/**: Main page-level components for the feature.

## 3. UI Components

- Use components from `@sharemyride/ui` whenever possible.
- If a component is generic and reusable, add it to `smr-ui` first.
- If a component is specific to a feature, keep it in the feature's `components/` folder.

## 4. State Management

- **Local State**: Use React's `useState` or `useReducer`.
- **Server State**: Use React Query (if applicable) or Next.js fetch cache.
- **Global State**: Use Zustand (if needed).

## 5. Styling

- Use Tailwind CSS (v4) for all styling.
- Adhere to the theme defined in `globals.css` and the shared UI library.
