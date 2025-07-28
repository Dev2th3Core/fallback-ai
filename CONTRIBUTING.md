# Contributing to fallback-ai

Thank you for your interest in contributing to `fallback-ai`! This document provides guidelines and information for contributors.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

Before contributing, please:
1. Read this document thoroughly
2. Check existing issues and pull requests to avoid duplicates
3. Join our community discussions (if available)

---

## Development Setup

### Prerequisites
- Node.js >= 16.0.0
- npm, yarn, or pnpm
- Git

### Installation
```sh
# Clone the repository
git clone https://github.com/Dev2th3Core/fallback-ai.git
cd fallback-ai

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Available Scripts
- `npm run build` - Build the TypeScript code
- `npm run dev` - Watch mode for development
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build artifacts

---

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add proper type annotations
- Use interfaces for object shapes
- Prefer `const` over `let` when possible

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons
- Follow the existing naming conventions
- Keep functions small and focused
- Add JSDoc comments for public APIs

### File Structure
```
src/
├── index.ts          # Main entry point
├── types.ts          # TypeScript type definitions
├── priority.ts       # Priority management logic
├── index.test.ts     # Tests for index.ts
└── priority.test.ts  # Tests for priority management logic 
```

---

## Testing

### Writing Tests
- Write tests for all new features
- Use descriptive test names
- Test both success and failure scenarios
- Mock external dependencies (like fetch)
- Aim for good test coverage

### Test Structure
```ts
describe('FeatureName', () => {
  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Running Tests
```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

---

## Pull Request Process

### Before Submitting
1. **Fork the repository** and create a feature branch
2. **Make your changes** following the coding standards
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Run the full test suite** and ensure all tests pass
6. **Check your code** with linting and formatting tools

### Creating a Pull Request
1. **Push your changes** to your fork
2. **Create a pull request** with a clear title and description
3. **Fill out the PR template** (if available)
4. **Link any related issues** in the description
5. **Request review** from maintainers

### PR Guidelines
- **Title**: Use conventional commits format (e.g., "feat: add new provider support")
- **Description**: Explain what the PR does and why
- **Tests**: Include tests for new features
- **Documentation**: Update README or docs if needed
- **Breaking Changes**: Clearly mark and explain any breaking changes

### Review Process
- All PRs require review before merging
- Address review comments promptly
- Maintainers may request changes or improvements
- Once approved, maintainers will merge the PR

---

## Reporting Issues

### Before Reporting
- Check existing issues to avoid duplicates
- Try to reproduce the issue with the latest version
- Check if the issue is already fixed in the main branch

### Issue Template
When reporting an issue, please include:
- **Description**: Clear description of the problem
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Node.js version, OS, etc.
- **Code Example**: Minimal code to reproduce the issue

### Bug Reports
- Be specific and detailed
- Include error messages and stack traces
- Provide minimal reproduction steps
- Mention the version of the package you're using

### Feature Requests
- Explain the use case and benefits
- Provide examples of how it would be used
- Consider implementation complexity
- Check if similar features already exist

---

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

### Enforcement
- Unacceptable behavior will not be tolerated
- Maintainers will remove, edit, or reject comments and commits
- Maintainers will ban temporarily or permanently any contributor for behaviors they deem inappropriate

---

## Getting Help

If you need help with contributing:
- Check the existing documentation
- Search existing issues and discussions
- Ask questions in issues or discussions
- Reach out to maintainers directly

---

## Recognition

Contributors will be recognized in:
- The project's README file
- Release notes
- GitHub contributors page

Thank you for contributing to `fallback-ai`! 