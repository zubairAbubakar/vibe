# Auto-Generated PR Messages

This repository is configured with automated Pull Request description generation to streamline the code review process and maintain consistent PR documentation.

## 🚀 Features

### Automatic PR Description Generation
- **Smart Analysis**: Automatically analyzes changed files, commit messages, and PR metadata
- **Conventional Commits**: Supports conventional commit format (feat, fix, docs, etc.)
- **File Categorization**: Groups changes by type (Frontend, API, Database, etc.)
- **Dynamic Checklists**: Generates testing and deployment checklists based on file types
- **Respectful**: Only auto-generates if PR description is empty or very short (< 100 chars)

### Conventional Commit Validation
- **Format Validation**: Ensures commits follow conventional commit format
- **Helpful Feedback**: Provides examples and suggestions for invalid commits
- **CI Integration**: Fails CI checks for non-conventional commits (optional)

## 📋 How It Works

### When a PR is Created or Updated:

1. **File Analysis**: The workflow categorizes all changed files:
   - 🧩 Frontend Components (`src/components/**/*.tsx`)
   - 📄 Pages & Routes (`src/app/**/*.tsx`)
   - 🎨 Styles (`**/*.css`, tailwind configs)
   - ⚙️ Configuration (`*.config.*`, `*.json`)
   - 📚 Documentation (`**/*.md`)
   - 🗄️ Database (`prisma/**/*`)
   - 🔌 API/Backend (`src/api/**/*`, `src/lib/**/*`)
   - 🧪 Tests (`**/*.test.*`, `**/*.spec.*`)

2. **Commit Message Analysis**: Extracts meaningful information from:
   - Conventional commits (`feat:`, `fix:`, `docs:`, etc.)
   - Alternative patterns (`add`, `implement`, `fix`, `improve`)

3. **Description Generation**: Creates a structured description with:
   - 📊 Changes summary with categorized features/fixes/improvements
   - 📁 Organized file listing by category
   - 🔍 Technical details (branch, commits, lines changed)
   - ✅ Dynamic testing checklist based on changed file types
   - 🚢 Deployment checklist with relevant items

### Example Generated Description:

```markdown
## 🚀 Changes Summary

This PR introduces new features in the **feature/user-auth** branch.

### ✨ New Features
- Add user authentication system
- Implement login/logout functionality

### 🐛 Bug Fixes
- Fix session timeout issue

## 📁 Files Changed (8)

### Frontend Components (3)
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/LogoutButton.tsx`
- `src/components/ui/Button.tsx`

### API/Backend (2)
- `src/lib/auth.ts`
- `src/api/auth/route.ts`

## 🔍 Technical Details

- **Branch**: `feature/user-auth` → `main`
- **Commits**: 5
- **Files Modified**: 8
- **Additions**: +245 lines
- **Deletions**: -12 lines

## ✅ Testing Checklist

- [ ] Code builds successfully
- [ ] Linting passes
- [ ] Manual testing completed
- [ ] No breaking changes introduced
- [ ] UI components render correctly
- [ ] Responsive design verified
- [ ] API endpoints tested
- [ ] Error handling verified

## 🚢 Deployment Checklist

- [ ] Ready for deployment
- [ ] Environment variables updated (if needed)
- [ ] Dependencies updated in package.json (if needed)

---
*🤖 This description was automatically generated based on the changes in this PR.*
```

## ⚙️ Configuration

The auto-generation behavior can be customized via `.github/auto-pr-config.yml`:

```yaml
# Enable/disable the feature
enabled: true

# Skip if PR already has description longer than this
skip_if_description_length: 100

# Customize file categories and their patterns
file_categories:
  frontend_components:
    name: "Frontend Components"
    patterns: 
      - "src/components/**/*.tsx"
      - "components/**/*.tsx"

# Maximum files to show per category
max_files_per_category: 8
```

## 🛠️ Manual Override

The system is designed to be helpful but not intrusive:

- **Respects Existing Content**: Won't override substantial PR descriptions
- **Manual Templates**: Use `.github/pull_request_template.md` for manual PRs
- **Disable**: Set `enabled: false` in config or add `[skip-auto-description]` to PR title

## 🔧 Workflows Included

### 1. Auto PR Description (`.github/workflows/auto-pr-description.yml`)
- Triggers: PR opened/updated
- Generates comprehensive PR descriptions
- Respects existing content

### 2. Conventional Commit Validation (`.github/workflows/validate-commits.yml`)
- Triggers: PR opened/updated
- Validates commit message format
- Provides helpful feedback comments

## 📝 Best Practices

### For Maximum Effectiveness:

1. **Use Conventional Commits**:
   ```bash
   git commit -m "feat: add user authentication"
   git commit -m "fix(api): resolve null pointer exception"
   git commit -m "docs: update setup instructions"
   ```

2. **Organize Your Changes**:
   - Group related files together
   - Make atomic commits
   - Use descriptive commit messages

3. **File Organization**:
   - Keep components in `src/components/`
   - Place pages in `src/app/`
   - Use clear directory structure

### Conventional Commit Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

## 🎯 Benefits

- **Consistency**: All PRs have structured, informative descriptions
- **Time Saving**: No need to manually write repetitive PR content
- **Better Reviews**: Reviewers quickly understand what changed
- **Documentation**: Automatic change tracking and categorization
- **Quality**: Encourages good commit message practices

## 🚀 Getting Started

The auto-generation is already configured and active! Just:

1. Create a new PR
2. The workflow will automatically generate a description
3. Review and edit if needed
4. The description updates on new commits

## 🔍 Troubleshooting

**Q: The auto-generation didn't trigger**
- Check if PR description is already substantial (>100 chars)
- Verify GitHub Actions are enabled
- Check workflow permissions

**Q: I want to disable it for a specific PR**
- Add `[skip-auto-description]` to your PR title
- Or manually add a description >100 characters before the workflow runs

**Q: The categorization is wrong**
- Update patterns in `.github/auto-pr-config.yml`
- File an issue for common miscategorizations

**Q: Commit validation is too strict**
- This encourages good practices, but can be disabled
- Edit `.github/workflows/validate-commits.yml`