# AGENTS.md - GitHub Automation & CI/CD

This document outlines automation, GitHub Actions workflows, and development processes for SimeonShop.rs.

## 🤖 GitHub Actions Workflows

### Planned Workflows

#### 1. Frontend CI/CD (`.github/workflows/frontend-ci.yml`)
```yaml
# Triggers: Push to main/develop, Pull Requests
# Jobs:
# - Install dependencies
# - Run linting
# - Type checking
# - Build verification
# - (Optional) Deploy to Netlify preview
```

#### 2. Backend CI/CD (`.github/workflows/backend-ci.yml`)
```yaml
# Triggers: Push to main/develop, Pull Requests
# Jobs:
# - Set up Python environment
# - Install dependencies
# - Run linting (flake8, black)
# - Type checking (mypy)
# - Test suite
# - (Optional) Deploy to production
```

#### 3. Integration Tests (`.github/workflows/integration-tests.yml`)
```yaml
# Triggers: On merged PRs
# Jobs:
# - Start backend server
# - Start frontend build
# - Run integration tests
# - Test API connectivity
```

## 📋 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/feature-name

# Work on your feature
# Commit regularly with meaningful messages

git push origin feature/feature-name
```

### 2. Pull Request Process
1. Create PR with clear description
2. Link related issues
3. Ensure all checks pass
4. Request review from maintainers
5. Merge when approved

### 3. Commit Message Convention
```
type(scope): subject

- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting changes
- refactor: code restructuring
- test: test additions
- chore: maintenance

Example:
feat(products): add product filtering
fix(cart): fix quantity calculation
docs(readme): update setup instructions
```

## 🔄 Deployment Pipeline

### Frontend Deployment (Netlify)
1. **Trigger**: Push to `main` branch
2. **Build**: `npm run build`
3. **Deploy**: Automatic to production
4. **Preview**: Pull requests get automatic previews

### Backend Deployment
1. **Trigger**: Push to `main` branch
2. **Build**: Install dependencies
3. **Test**: Run test suite
4. **Deploy**: To production environment (Heroku/Railway/Render)

## 🧪 Testing Strategy

### Frontend Tests
```bash
# Unit tests (Jest - planned)
npm run test

# E2E tests (Playwright - planned)
npm run test:e2e
```

### Backend Tests
```bash
# Unit tests (pytest - planned)
pytest

# Coverage report
pytest --cov=app
```

## 📊 Code Quality Standards

### Frontend
- TypeScript strict mode enabled
- ESLint configuration
- Prettier for formatting
- 80% code coverage target

### Backend
- Python 3.10+
- Black for code formatting
- Flake8 for linting
- MyPy for type checking
- 85% code coverage target

## 🔐 Environment Secrets

### Required GitHub Secrets
```
# Frontend
NETLIFY_SITE_ID
NETLIFY_AUTH_TOKEN

# Backend
DATABASE_URL
PROD_API_SECRET_KEY
SENTRY_DSN
```

## 📈 Performance Monitoring

### Frontend
- Lighthouse CI integration (planned)
- Performance budgets
- Bundle analysis

### Backend
- Error tracking (Sentry - planned)
- Performance monitoring (New Relic - planned)
- API response time monitoring

## 🔄 Continuous Integration Checklist

- [ ] All tests passing
- [ ] Type checking passing
- [ ] Linting passing
- [ ] No console errors
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Security review completed

## 📚 Documentation Standards

- README.md in each app directory
- Inline code comments for complex logic
- API documentation via Swagger/ReDoc
- Architecture decisions in ADRs (Architectural Decision Records)

## 🚀 Release Process

1. **Version Bump**: Update version in package.json and setup.py
2. **Changelog**: Update CHANGELOG.md
3. **Tag**: Create git tag (v1.0.0)
4. **Release Notes**: Create GitHub release with notes
5. **Deployment**: Automated via GitHub Actions

## 🐛 Bug Reporting

Report bugs via GitHub Issues with:
- Clear title
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Environment info (OS, browser, Python version)

## 💡 Feature Requests

Submit feature requests via GitHub Issues with:
- Clear title starting with "Feature:"
- Detailed description
- Use cases/benefits
- Proposed implementation (optional)

## 📞 Communication

- Issues: GitHub Issues
- Discussions: GitHub Discussions (planned)
- Real-time: Slack/Discord (planned)
- Email: dev@simeonshop.rs

## 🎯 Future Automation Goals

- [ ] Automated database migrations
- [ ] Dependency update automation (Dependabot)
- [ ] Security scanning (CodeQL, OWASP)
- [ ] Performance regression detection
- [ ] Load testing automation
- [ ] Documentation auto-generation
- [ ] Changelog generation from commits

---

**Last Updated**: January 2024
**Maintained by**: SimeonShop.rs Development Team
