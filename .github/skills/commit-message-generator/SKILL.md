---
name: commit-message-generator
description: |
  Generate intelligent, descriptive commit messages based on code diffs.

  Use when: You have code changes and need meaningful commit messages following 
  Conventional Commits format. The skill analyzes file changes, imports, patterns,
  and context to generate appropriate messages.
---

# Commit Message Generator Skill

Analyzes code diffs and generates meaningful commit messages following Conventional Commits standard.

## How It Works

1. **Diff Analysis** - Reviews file modifications to understand change types
2. **Pattern Recognition** - Identifies patterns in code changes:
   - New files/imports → feature
   - Error handling/conditions → fix
   - Reorganized code → refactor
   - Test files → test
   - Dependencies → chore
3. **Context Extraction** - Determines scope and impact
4. **Message Generation** - Creates conventional format message

## Change Type Detection

### Feature (feat)

- New files added
- New exports/functions
- New component classes
- Database schema changes
- New API endpoints

### Fix (fix)

- Condition changes
- Error handling improvements
- Type corrections
- Property value fixes
- Logic error corrections

### Refactor (refactor)

- Code reorganization without behavior change
- Variable/function renaming
- Moving code between files
- Simplifying logic
- Removing duplication

### Test (test)

- Test file modifications
- Test additions
- Coverage improvements

### Chore (chore)

- Dependency updates
- Build config changes
- Package.json updates
- CI/CD configuration

### Docs (docs)

- Comment improvements
- README updates
- Documentation files

### Style (style)

- Formatting changes (no logic change)
- Whitespace cleanup
- Import reordering (without behavior change)

## Scope Determination

The scope identifies the affected area:

- **API/Service Layer**: `feat(api): add user endpoint`
- **Component**: `feat(auth): create login form`
- **Type System**: `refactor(types): consolidate response types`
- **Build/Config**: `chore(build): update vite config`
- **UI**: `feat(ui): add dark mode toggle`
- **Database**: `feat(db): add user schema`

## Usage Template

When analyzing changes, produce messages like:

```
feat(auth): add JWT token refresh mechanism

- Implement refresh token endpoint
- Add automatic token refresh on expiry
- Update auth interceptor with refresh logic
- Add token storage utilities
```

or for fixes:

```
fix(api): resolve missing error handling in booking service

- Add try-catch blocks to booking endpoints
- Implement proper error response formatting
- Log errors for debugging
```

## Analysis Process

1. Identify all files changed
2. Group changes by module/component
3. Determine primary change type
4. Extract scope from file paths
5. Analyze impact (breaking, deprecation, new features)
6. Generate concise, actionable message
7. Add bullet points for complex changes

## Conventional Commits Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Type**: feat, fix, refactor, docs, style, test, chore, perf, ci

**Scope**: Optional, identifies the affected area

**Description**: Imperative, present tense, lowercase, no period

**Body**: Detailed explanation of changes (optional)

**Footer**: Breaking changes (BREAKING CHANGE:), issue references

## Examples

### Simple Feature

```
feat(temple): add temple listing with pagination
```

### Complex Feature

```
feat(booking): implement complete booking workflow

- Create booking form with validation
- Add payment integration with Razorpay
- Implement booking confirmation email
- Add booking status tracking in dashboard
```

### Bug Fix

```
fix(types): resolve conflicting type definitions in data.ts
```

### Refactoring

```
refactor(services): consolidate API response types to use data.ts

- Update all imports from types/api to types/data
- Remove duplicate type definitions
- Maintain backward compatibility with re-exports
```

## Breaking Changes

If your analysis detects breaking changes, include:

```
feat(api): redesign booking response structure

BREAKING CHANGE: bookingDate format changed from string to ISO 8601 Date object
```

## Tips for Better Analysis

- Check file paths to understand module structure
- Look at imports to understand dependencies
- Review test file changes to validate behavior changes
- Check for config file modifications
- Look for deprecation comments
- Analyze variable/function name changes for semantic meaning
- Consider performance implications
- Check for security-related changes
