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

Branch off `develop` using a clear naming convention that reflects the type of work, the service affected, and the specific feature.

**Format:** `<type>/<service>/<feature-description>`

- **Type:** `feat`, `fix`, `chore`, `docs`, `refactor`
- **Service:** `user-service`, `api-gateway`, `frontend`, `shared`, `ui`, `workspace`
- **Description:** Kebab-case description of the task.

```bash
# Example:
git checkout -b feat/user-service/auth-signup
git checkout -b chore/workspace/ci-cd-setup
```

## 4. Develop, Test, and Commit

Work on your feature or fix in isolation.

- Write the core implementation.
- Write the corresponding unit/integration tests.
- Maintain strict **scope control**.

### Micro-Commit Format

Make incremental commits as you progress. Include the issue number in the title for traceability.

```text
<type>: <short description> (#<issue_number>)

  Modules Touched:
   - <Service/Module A>
   - <Service/Module B>

  Things Done
   - <Major change or implementation detail>
   - <Supporting change or refactor>
   - <Bug fix or edge-case handling included in the task>
   - <Testing or configuration updates>
```

---

## 5. Issue & Pull Request Templates

To maintain consistency, use the following templates for tracking and merging work.

### Issue Template

```text
[Module]: Feature Title

**Goal**
Briefly describe what this task achieves.

**Modules Affected**
- Service A
- Service B

**Check List**
- [ ] Requirement 1
- [ ] Requirement 2
```

### Pull Request (PR) Template

```text
## Overview
Briefly describe the changes in this PR.

## Related Issue
Closes #<issue_number>

## Changes Made
- [ ] Implemented X
- [ ] Fixed Y
- [ ] Added tests for Z

```

---

## 6. Push and Create a Pull Request

1. Push your branch: `git push origin feat/user-service/auth-signup`
2. Open a **Pull Request (PR)** targeting the **`develop`** branch.
3. **Important:** Add the keyword `Closes #<number>` in the **PR description**. This ensures the issue is automatically closed when the PR is merged into `develop`.

## 7. CI/CD & Verification

- Wait for CI/CD checks to pass.
- Once reviewed and verified, merge the PR into `develop`.
- On successful merge to `develop`, the CD pipeline will automatically promote changes to `master`.
