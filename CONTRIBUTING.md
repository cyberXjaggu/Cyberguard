# Contributing to CyberGuard

Thank you for your interest in contributing to CyberGuard! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- Basic knowledge of React, Node.js, and MongoDB

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/cyberguard.git
   cd cyberguard
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Start Development Environment**
   ```bash
   # Start MongoDB
   docker run -d -p 27017:27017 --name cyberguard-mongodb mongo:7.0
   
   # Start Backend (Terminal 1)
   cd backend && npm run dev
   
   # Start Frontend (Terminal 2)
   cd frontend && npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **JavaScript/React**: Use ESLint configuration provided
- **CSS**: Use Tailwind CSS utility classes
- **Naming**: Use camelCase for variables, PascalCase for components
- **Comments**: Document complex logic and business rules

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Add tests for new features
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new domain checking feature"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Use conventional commits format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add real-time threat notifications
fix: resolve authentication token refresh issue
docs: update API documentation
test: add unit tests for domain controller
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

### Frontend Testing

```bash
cd frontend
npm test                   # Run all tests
npm run test:watch        # Run tests in watch mode
```

### Test Guidelines

- Write unit tests for new functions
- Write integration tests for API endpoints
- Aim for >80% code coverage
- Test edge cases and error conditions

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs what you expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**: OS, Node.js version, browser version
4. **Screenshots**: If applicable
5. **Error Messages**: Full error logs

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Ubuntu 20.04]
- Node.js: [e.g. 18.17.0]
- Browser: [e.g. Chrome 91]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

When requesting features, please include:

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Use Cases**: Who would benefit from this?
4. **Alternatives**: Other solutions you've considered

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How should this feature work?

**Use Cases**
Who would benefit from this feature?

**Additional Context**
Any other context or screenshots about the feature request.
```

## 🔧 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] No sensitive data in commits

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No sensitive data exposed
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review code quality
3. **Testing**: Manual testing of changes
4. **Approval**: At least one maintainer approval required

## 🏗️ Architecture Guidelines

### Backend

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and external API calls
- **Models**: Database schemas and validation
- **Middleware**: Authentication, validation, error handling
- **Routes**: API endpoint definitions

### Frontend

- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Context**: Global state management
- **Services**: API client and utilities
- **Utils**: Helper functions

### Database

- **Schemas**: Use Mongoose for MongoDB
- **Validation**: Server-side validation required
- **Indexing**: Add indexes for performance
- **Migrations**: Document schema changes

## 🔒 Security Guidelines

- **Authentication**: Use JWT tokens securely
- **Authorization**: Implement proper role-based access
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Prevention**: Sanitize user inputs
- **CORS**: Configure properly for production

## 📚 Documentation

### Code Documentation

- **Functions**: Document parameters and return values
- **Components**: Document props and usage
- **API Endpoints**: Document request/response formats
- **Complex Logic**: Add inline comments

### README Updates

- Update installation instructions
- Add new features to feature list
- Update API documentation
- Add new environment variables

## 🎯 Hackathon Contributions

For hackathon participants:

### Quick Wins

- **UI Improvements**: Better styling, animations
- **New Charts**: Additional data visualizations
- **API Endpoints**: New functionality
- **Documentation**: Better examples, tutorials

### Advanced Features

- **Real-time Updates**: WebSocket integration
- **Machine Learning**: Threat prediction models
- **Browser Extension**: Chrome/Firefox extension
- **Mobile App**: React Native version

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Be Collaborative

- Help others learn and grow
- Share knowledge and best practices
- Mentor new contributors
- Participate in discussions

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord**: For real-time chat (if available)
- **Email**: For security issues

## 🏆 Recognition

Contributors will be recognized in:

- **README**: Contributors section
- **Release Notes**: Feature contributors
- **GitHub**: Contributor statistics
- **Documentation**: Code comments

Thank you for contributing to CyberGuard! 🛡️
