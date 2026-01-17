# Contributing to ARBIT Trading Cards

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes (see [Commit Guidelines](#commit-guidelines))
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## 💻 Development Process

### Setting Up Development Environment

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Run development server: `npm run dev`
4. Run linter: `npm run lint`

### Making Changes

- Create a new branch for each feature/fix
- Keep changes focused and atomic
- Write clear commit messages
- Test your changes locally
- Update documentation if needed

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable names

### React/Next.js

- Use functional components with hooks
- Follow Next.js App Router conventions
- Use CSS Modules for styling
- Keep components small and focused

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Use semicolons
- Maximum line length: 100 characters

### Example

```typescript
'use client'

import { useState } from 'react'
import './styles/Component.css'

interface ComponentProps {
  title: string
  onAction: () => void
}

export default function Component({ title, onAction }: ComponentProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="component">
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  )
}
```

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(trading): add trade execution via Pear Protocol

Implement trade execution functionality that connects to Pear Protocol API
and executes basket trades based on card configurations.

Closes #123
```

```
fix(wallet): resolve wallet connection timeout issue

Fix issue where wallet connection would timeout after 30 seconds.
Added proper error handling and retry logic.

Fixes #456
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. PR will be reviewed by maintainers
2. Address any feedback or requested changes
3. Once approved, PR will be merged
4. Thank you for your contribution! 🎉

## 🐛 Reporting Bugs

### Before Submitting

- Check if the bug has already been reported
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

### Before Submitting

- Check if the feature has already been requested
- Consider if it fits the project scope
- Provide clear use cases

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information.
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Pear Protocol Docs](https://docs.pearprotocol.com)

## ❓ Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🚀
