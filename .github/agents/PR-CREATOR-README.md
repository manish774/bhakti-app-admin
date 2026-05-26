\_# PR Creator Agent & Skills

Automated pull request creation with intelligent diff analysis and commit message generation.

## What's Included

### 1. **PR Creator Agent** (`pr-creator`)

Custom agent that automates the entire PR workflow.

#### Slash Command

```
/pr-creator
```

#### Workflow

1. ✅ Check git status and staged/unstaged changes
2. 🔍 Analyze code diffs using smart diff analyzer
3. 🤖 Generate intelligent commit message from changes
4. 💾 Stage and commit changes
5. 🌳 Create feature branch
6. 🚀 Create pull request with smart description

#### What It Does

- Analyzes your code changes semantically
- Generates Conventional Commits formatted messages
- Creates PR with:
  - Smart title (from commit message)
  - Detailed description explaining what changed and why
  - Appropriate change type labels
- Supports full automation or interactive review

#### Key Features

- **Smart Commit Messages**: Generated based on actual code changes
  - `feat(scope): description` for features
  - `fix(scope): description` for bug fixes
  - `refactor(scope): description` for refactoring
  - And more...
- **Diff Analysis**: Understands code patterns and intent
- **Interactive Confirmation**: Review before committing/creating PR
- **Conventional Commits**: Follows industry standard format
- **Breaking Change Detection**: Identifies and documents breaking changes

---

### 2. **Commit Message Generator Skill** (`commit-message-generator`)

Specialized skill for generating intelligent commit messages.

#### Usage

The agent uses this automatically, or invoke directly with:

```
Use the commit-message-generator skill to analyze my code changes and generate a meaningful commit message
```

#### Analyzes

- File additions/modifications/deletions
- Patterns in code changes
- Import/export changes
- Test file modifications
- Configuration changes
- Comment and documentation changes

#### Output

- Type: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`
- Scope: Affected area (e.g., `auth`, `api`, `types`)
- Description: Clear, imperative, present tense
- Body: Detailed explanation for complex changes

---

### 3. **Smart Diff Analyzer Skill** (`smart-diff-analyzer`)

Intelligent code diff analysis skill.

#### Usage

The agent uses this automatically, or invoke directly with:

```
Analyze the git diff and explain what changed and why
```

#### Provides

- **Change Summary**: Files, lines added/deleted
- **Impact Assessment**: Risk level, scope, complexity
- **Semantic Analysis**: Intent and purpose of changes
- **Classification**: Feature, fix, refactor, etc.
- **Risk Analysis**: Breaking changes, side effects
- **Recommendations**: Next steps and testing priorities

---

## Quick Start

### Using the PR Creator Agent

1. **Make your code changes** in the editor
2. **Stage changes** (git add) or leave unstaged
3. **Open Copilot Chat** and type:
   ```
   /pr-creator
   ```
4. **Follow the prompts**:
   - Confirm PR title
   - Select target branch (main, develop, etc.)
   - Review suggested commit message
   - Approve PR creation

5. **Done!** PR is created with smart description

### Customization

You can configure the agent behavior:

- **Auto-stage all changes**: Choose to stage only specific files or all changes
- **Edit commit message**: Review and modify generated message before committing
- **Edit PR description**: Add additional details before creating PR
- **Create branch from message type**:
  - `feat/*` for features
  - `fix/*` for fixes
  - `refactor/*` for refactoring
  - etc.

---

## How It Works

### Commit Message Generation Algorithm

1. **Analyze Files**: Determine what files changed
2. **Detect Patterns**:
   - New files → feature
   - Error handling changes → fix
   - Code reorganization → refactor
   - Test files → test
   - Dependencies → chore
3. **Extract Scope**: From file paths and modules
4. **Generate Message**: Format: `type(scope): description`
5. **Add Body**: For complex changes, include bullet points

### Smart Diff Analysis Algorithm

1. **Classify Changes**: Addition, modification, deletion, reorganization
2. **Assess Impact**: Risk level, affected modules, dependencies
3. **Recognize Patterns**: Feature, fix, refactor, test, chore
4. **Extract Intent**: Why was this change made?
5. **Present Analysis**: Detailed report with recommendations

---

## Examples

### Example 1: Consolidating Types

```
Original commit message (without agent): "update types"

Generated commit message:
feat(types): consolidate API response types to use data.ts

- Import all types from data.ts instead of api.ts
- Update all service files to use new import paths
- Maintain backward compatibility with re-exports in api.ts

Files changed:
- src/types/api.ts: Re-export from data.ts
- src/services/Services.ts: Update imports
- src/services/Temple/temple.api.ts: Update imports
- src/services/Temple/temple.controller.ts: Update imports
- src/component/TempleForm/PackagesSection.tsx: Update imports
```

### Example 2: Bug Fix

```
Generated commit message:
fix(auth): resolve token refresh timing issue

- Implement exponential backoff for token refresh
- Fix race condition in concurrent requests
- Add token expiry validation before API calls

Closes #456
```

### Example 3: Refactoring

```
Generated commit message:
refactor(services): simplify API response handling

- Remove duplicate response processing logic
- Consolidate error handling across services
- Extract common patterns to utility functions
```

---

## Conventional Commits Format

The agent uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, missing semicolons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process, dependencies, tooling, etc
- **ci**: Changes to CI/CD configuration files and scripts

### Scope

Identifies the part of the codebase affected:

- `auth` - Authentication
- `api` - API services
- `types` - Type definitions
- `ui` - User interface
- `db` - Database
- `build` - Build system
- etc.

---

## Tips & Best Practices

### ✅ Do

- Make focused commits: One feature/fix per commit
- Use clear, descriptive commit messages
- Group related changes together
- Include test changes with feature/fix commits
- Review generated messages before confirming
- Use the agent for all PRs for consistency

### ❌ Don't

- Mix multiple features/fixes in one commit
- Use vague messages like "update", "fix", "stuff"
- Commit without understanding what changed
- Ignore generated descriptions (customize if needed)
- Create PRs without the agent (breaking consistency)

---

## Troubleshooting

### PR Agent Won't Start

- Make sure you're in a git repository
- Check that you have git credentials configured
- Verify GitHub CLI (gh) is installed and authenticated

### Commit Message Seems Wrong

- The agent analyzes actual code changes
- Review the diff to understand what was detected
- Edit the message before confirming
- Provide additional context in PR description

### Files Not Staged Properly

- Specify which files to stage when prompted
- Or use git add manually, then run agent again
- Agent works with both staged and unstaged changes

### PR Title Not What You Want

- Edit the title when prompted
- Agent suggests title from commit message, but you can customize

---

## Advanced Usage

### Using Skills Directly

You can use the skills independently in Copilot Chat:

**Analyze changes without creating PR:**

```
/smart-diff-analyzer
Show me what changed in my recent commits and assess the impact
```

**Generate commit message for existing changes:**

```
/commit-message-generator
I've modified types and services, generate a good commit message
```

**Custom commit message for specific files:**

```
Use the commit-message-generator skill to create a message for:
- src/types/data.ts
- src/services/booking/
- src/component/MyComponent.tsx
```

### Integration with Workflow

The agent integrates with your development workflow:

1. **Make changes** in editor
2. **Test locally** to ensure they work
3. **Run /pr-creator** to automate PR creation
4. **Review PR** on GitHub
5. **Request reviews** from team members
6. **Merge** when approved

---

## Configuration

These agent customizations are stored in `.github/agents/` and `.github/skills/`:

- `.github/agents/pr-creator.agent.md` - Main agent configuration
- `.github/skills/commit-message-generator/SKILL.md` - Commit message skill
- `.github/skills/smart-diff-analyzer/SKILL.md` - Diff analysis skill

To modify behavior:

1. Edit the respective `.md` file
2. Update instructions or tool restrictions
3. Changes apply immediately

---

## Related Documentation

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [VS Code Agent Customization](./SKILL.md)
