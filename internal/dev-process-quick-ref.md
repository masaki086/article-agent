# Development Process Quick Reference

**Full Documentation:** `/internal/development-process.md`

## 📋 6-Phase Process Overview

| Phase | Purpose | Key Output | Approval |
|-------|---------|------------|----------|
| **1. Requirements** | Define what to build | `/internal/requirements/[feature]-req.md` | ✅ Required |
| **2. Design** | Define how to build | `/internal/design/[feature]-design.md` | ✅ Required |
| **3. Test Design** | Define how to test | `/internal/test-design/[feature]-test.md` | ✅ Required |
| **4. Task Breakdown** | Plan implementation | TodoWrite tasks | ❌ Not required |
| **5. Implementation** | Build and test | Code + Tests | ❌ Not required |
| **6. Verification** | Validate and document | Test reports + Docs | ✅ Required |

## 🚀 Quick Commands

```bash
# Start new feature
/todo: Create requirements document using /internal/templates/requirements.md

# After requirements approval
/todo: Create design document using /internal/templates/design.md

# After design approval
/todo: Create test design using /internal/templates/test-design.md

# During implementation
npm test           # Run unit tests
npm run coverage   # Check test coverage (target: 80%+)
npm run lint       # Check code quality

# Before completion
/todo: Create release notes using /internal/templates/release-notes.md
```

## ✅ Phase Checklists

### Phase 1: Requirements
- [ ] Purpose defined
- [ ] Questions asked
- [ ] Document created
- [ ] Human approved

### Phase 2: Design
- [ ] Architecture designed
- [ ] Security reviewed
- [ ] PoC tested (if needed)
- [ ] Human approved

### Phase 3: Test Design
- [ ] Test cases created
- [ ] Test data defined
- [ ] Acceptance criteria set
- [ ] Human approved

### Phase 4: Tasks
- [ ] Tasks broken down
- [ ] TodoWrite updated
- [ ] Priorities set

### Phase 5: Implementation
- [ ] Code written
- [ ] Tests written (80%+)
- [ ] All tests passing
- [ ] Code reviewed

### Phase 6: Verification
- [ ] Human tested
- [ ] Feedback addressed
- [ ] Docs updated
- [ ] Human approved

## 📁 Where to Save Documents

```
/internal/
├── requirements/[feature]-req.md     # Phase 1 output
├── design/[feature]-design.md        # Phase 2 output
├── test-design/[feature]-test.md     # Phase 3 output
├── test-reports/[feature]-report.md  # Phase 6 output
└── templates/                         # Use these templates
```

## 🎯 Key Rules

1. **Never skip phases** - Each builds on the previous
2. **Get approvals** - Required at phases 1, 2, 3, and 6
3. **Test first** - Design tests before coding
4. **Document everything** - Use templates provided
5. **80%+ test coverage** - Non-negotiable

## 🔗 Templates

- Requirements: `/internal/templates/requirements.md`
- Design: `/internal/templates/design.md`
- Test Design: `/internal/templates/test-design.md`
- Release Notes: `/internal/templates/release-notes.md`

---
*For detailed process documentation, see `/internal/development-process.md`*