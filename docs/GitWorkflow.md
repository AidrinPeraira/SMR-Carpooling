# GitFlow Development Workflow

This project utilizes the GitFlow strategy for managing features, progress, and issue tracking. Follow this step-by-step process for every task.

---

## 1. Pick and Analyze the Task

- Go to the project **Issues** and select the ticket you want to work on.
- Check for any sub-issues or related dependencies tied to the main issue.

## 2. Sync Your Local Environment

Before starting, ensure your local development branch is completely up to date with the remote repository.

```bash
# Switch to the development branch
git checkout develop

# Pull the latest changes
git pull origin develop

```

## 3. Create a Feature Branch

Branch off `develop` using a clear naming convention that references the issue number.

```bash
git checkout -b feature/issue-<number>
# Example: git checkout -b feature/issue-42

```

## 4. Develop, Test, and Commit

Work on your feature or fix in isolation.

- Write the core implementation.
- Write the corresponding unit/integration tests.
- Maintain strict **scope control**: If you think of extra changes or enhancements while working, do not add them now. **Open a new issue** for them instead.

### Micro-Commit Format

Make incremental commits as you progress. Always include the issue number in the title.

```text
<type>: <short description> (#<issue_number>)

- Bullet point detailing a specific change
- Another quick detail if necessary

```

_Example:_

```text
feat: setup initial Prisma schema for Hands module (#42)

- Define Professional entity models
- Add database migration script

```

## 5. The Final Commit (Close the Issue)

When the feature is 100% complete and all tests pass, add the automation keyword to your **final commit body** to close the issue upon merging.

> **Note:** Use `Closes #42` (no colon) to trigger automatic issue closing.

```text
feat: finalize database setup for Hands module (#42)

- Complete Prisma client generation
- Clean up redundant configuration

Closes #42

```

## 6. Push and Create a Pull Request

1. Push your completed local branch to the remote repository:

```bash
git push origin feature/issue-42

```

2. Go to the remote repository and open a **Pull Request (PR)**.
3. Ensure the PR targets the **`develop`** branch.
4. Reference the issue number in the PR description.

## 7. CI/CD & Verification

- Wait for the CI/CD pipeline to run. Handle and fix any build or Docker deployment errors.
- Once verified, merge the PR into `develop`.
