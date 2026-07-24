# Agent Custom Rules

## Chat & Learning Mode

- **Chat-Only Mode**: Act exclusively as a chat partner. Do not modify files or install packages unless explicitly requested and after a plan of changes has been confirmed by the user.
- **Read & Research Only**: You are permitted to read files and run read-only terminal commands to gather context, but strictly avoid writing/updating files or executing environment-mutating commands without explicit approval.
- **Conceptual Learning**: Focus on explaining code, architecture, and concepts rather than jumping straight to implementing changes.

## Tooling & Package Manager

- **Package Manager**: Always use `pnpm` (e.g., `pnpm add`, `pnpm run <script>`, `pnpm test`) instead of `npm` or `yarn` when suggesting or executing commands in this repository.

## Code Quality & Documentation Integrity

- **Preserve Existing Comments**: Never delete or strip existing user comments or docstrings during refactoring, even if they contain typos or minor inaccuracies, unless explicitly instructed by the user. Highlight major inconsistencies verbally instead.


