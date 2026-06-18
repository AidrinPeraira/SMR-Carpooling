# Next.js 16, React 19 & Tailwind CSS v4 Guidelines

This guide details the conventions and best practices for building UI and client logic with **Next.js 16**, **React 19**, and **Tailwind CSS v4** in the [smr-frontend/](file:///home/aidrin-peraira/Projects/ShareMyRide/smr-frontend) and [smr-ui/](file:///home/aidrin-peraira/Projects/ShareMyRide/smr-ui) workspaces.

---

## 1. Next.js 16 & React 19 Patterns
React 19 changes several patterns related to components and ref passing:

### Key Rule: No `forwardRef`
In React 19, `ref` is passed as a standard prop to function components. Do not use `forwardRef`.

#### ❌ Incorrect (React 18 Style)
```typescript
import { forwardRef } from "react";
export const CustomInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

#### ✅ Correct (React 19 Style)
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export const CustomInput = ({ ref, ...props }: InputProps) => {
  return <input ref={ref} {...props} />;
};
```

### Key Rule: Prefer Server Actions for Mutations
Use Next.js Server Actions for handling form submissions and mutations where possible. Avoid creating custom API endpoints in the Next.js router unless strictly necessary for third-party webhook integrations.

---

## 2. Tailwind CSS v4 Configuration
Tailwind CSS v4 replaces the legacy JavaScript-based `tailwind.config.js` model with a modern CSS-first approach.

### Key Rule: Configure Custom Styles in CSS, Not Config Files
Do not look for or create a `tailwind.config.js`. Tailwind v4 builds directly using `@tailwindcss/postcss` (in `smr-frontend`) and `@tailwindcss/vite` (in `smr-ui`).
*   Configure all custom colors, fonts, spacing, or utilities using `@theme` and `@utility` rules inside your main CSS files (e.g., [globals.css](file:///home/aidrin-peraira/Projects/ShareMyRide/smr-frontend/app/globals.css) and [styles.css](file:///home/aidrin-peraira/Projects/ShareMyRide/smr-ui/src/styles.css)).

#### Example Custom Configurations (`globals.css`)
```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #10b981;
  --color-brand-secondary: #059669;
  
  --font-display: "Outfit", sans-serif;
  --font-sans: "Inter", sans-serif;
}

@utility custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-brand-primary) transparent;
}
```

### Key Rule: Use Class Merging Utilities
Always use `clsx` and `tailwind-merge` (typically exported as a `cn` helper) to safely merge Tailwind CSS v4 utility classes.

```typescript
import { clsx, type ClassValue } from "clsx";
import { tailwindMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return tailwindMerge(clsx(inputs));
}
```
