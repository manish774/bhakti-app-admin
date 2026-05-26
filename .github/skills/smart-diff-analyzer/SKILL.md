---
name: smart-diff-analyzer
description: |
  Intelligent analysis of code diffs to understand changes comprehensively.

  Use when: You need to understand what changed in your code, why it matters,
  and what impact it has. Provides detailed analysis of file modifications,
  additions, and deletions.
---

# Smart Diff Analyzer Skill

Provides intelligent analysis of code diffs to understand modifications comprehensively.

## Analysis Dimensions

### 1. Change Type Classification

- **Addition**: New files, functions, components, types, configurations
- **Modification**: Logic changes, type updates, refactoring, feature enhancements
- **Deletion**: Removed code, deprecated functions, cleanup
- **Reorganization**: Moved code, renamed files/functions, restructuring

### 2. Impact Assessment

- **Scope**: How many files are affected?
- **Risk Level**: Low (non-breaking), Medium (behavior change), High (breaking changes)
- **Complexity**: Simple (single change), Complex (multi-file coordinated changes)
- **Dependencies**: What other files/modules depend on these changes?

### 3. Semantic Analysis

- **Intent**: Why was this change made?
- **Related Changes**: Are multiple related changes grouped together?
- **Consistency**: Do changes follow project patterns?
- **Coverage**: Are there corresponding test/documentation changes?

## Analysis Output Format

```
## Diff Summary
- Total files changed: X
- Additions: Y lines
- Deletions: Z lines
- Net change: ±N lines

## Changed Files
### [file1]
- Type: [Addition/Modification/Deletion]
- Purpose: [What is this file/change for?]
- Key changes: [Bullet list of important changes]
- Potential impact: [What might this affect?]

## Change Categories
- **Types/Interfaces**: [List type changes]
- **Features**: [New functionality added]
- **Fixes**: [Bugs fixed]
- **Refactoring**: [Code reorganization]
- **Tests**: [Test additions/modifications]
- **Documentation**: [Doc changes]
- **Dependencies**: [Package updates]

## Risk Analysis
- **Breaking Changes**: [Any breaking changes?]
- **Backward Compatibility**: [Impact on existing code]
- **Side Effects**: [Potential unintended consequences]

## Recommendations
- [Suggested next steps]
- [Testing recommendations]
- [Review priorities]
```

## Analysis Checklist

### For Each File Changed:

- [ ] Is this a new file or modification?
- [ ] What is the primary purpose of this change?
- [ ] Are there multiple unrelated changes in one file?
- [ ] Do changes follow project conventions?
- [ ] Are imports/exports consistent with changes?
- [ ] Are there comments explaining the change?
- [ ] Are tests updated/added?

### For the Overall Diff:

- [ ] Are changes logically grouped?
- [ ] Is there a coherent theme (feature, fix, refactor)?
- [ ] Are there any "cleanup" or "while I'm at it" changes?
- [ ] Do all files work together toward a goal?
- [ ] Are there dependencies between changes?
- [ ] Is the commit atomic/focused?

## Change Pattern Recognition

### Feature Pattern

```
✓ New files created
✓ New exports/functions
✓ Tests added
✓ Documentation updated
✓ No breaking changes
```

### Bug Fix Pattern

```
✓ Minimal changes to specific area
✓ Error handling improved
✓ Test case added for regression
✓ No unnecessary refactoring
```

### Refactoring Pattern

```
✓ Code reorganized
✓ Behavior unchanged (tests still pass)
✓ Naming improved
✓ No functional changes
```

### Type System Improvement

```
✓ Type definitions updated/consolidated
✓ Interfaces reorganized
✓ Exports rationalized
✓ Backward compatibility maintained
```

## File Classification

### Critical Files

- Type definitions (types/\*.ts)
- API service files (services/\*.ts)
- Core components (component/core/\*.tsx)
- Main entry points (main.tsx, App.tsx)

### Moderate Impact

- Features (component/\*/), utilities, services

### Low Impact

- Tests, documentation, configuration, styling

## Detection Rules

### New Feature Indicators

- Files in `component/` or `services/` added
- New exports in index files
- `export interface` or `export type` additions
- New test files created

### Bug Fix Indicators

- Error handling/try-catch additions
- Condition/validation improvements
- Single file modifications (usually)
- Bug-specific test case additions

### Refactoring Indicators

- File reorganization/movement
- Naming improvements
- No new functionality
- Code deduplication
- Import path simplification

### Type System Changes

- `types/*.ts` or `*.types.ts` modifications
- Interface/type definition changes
- Import path consolidation in types
- Backward compatibility measures

## Diff Presentation Tips

1. **Group by category** - Show related changes together
2. **Highlight impact** - Flag breaking changes, critical updates
3. **Explain context** - Why did this change matter?
4. **Show patterns** - Identify if this follows a consistent pattern
5. **Assess risk** - What could go wrong?
6. **Suggest next steps** - What should happen now?

## Common Patterns in Your Project

Based on the BhaktiApp structure, look for:

- **Services**: API service modifications, type consolidation
- **Components**: React component updates, feature additions
- **Types**: Data structure improvements, type safety enhancements
- **Hooks**: Custom hook additions or modifications
- **Context**: State management changes
- **Utilities**: Helper function additions/refactoring

## Example Analysis

```
## Diff Summary for PR #123
- Total files changed: 6
- Net change: +45 -12 lines

## Change Categories
### Type System (3 files)
- Consolidated API response types to data.ts
- Added LoginCredentials, PujaType types
- Maintains backward compatibility with re-exports

### Services (2 files)
- Updated imports from types/api to types/data
- No functional changes, only import path updates

### Components (1 file)
- Updated PackagesSection to use new type imports
- No behavior changes

## Risk Analysis
- Breaking Changes: None
- Backward Compatibility: ✅ Maintained via re-exports
- Testing: Type system tests recommended

## Recommendations
1. Run type checking (tsc --noEmit)
2. Verify all imports work
3. Test component rendering
4. Update documentation if needed
```
