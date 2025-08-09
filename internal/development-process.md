# Development Process Guidelines

**Date:** 2025-01-09 | **Version:** 1.0

This document defines the standard 6-phase development process for implementing new features in the article-agent project.

## 📋 Overview

All new feature implementations must follow this 6-phase process to ensure quality, maintainability, and proper documentation.

## 🔄 6-Phase Development Process

### Phase 1: Requirements Definition

#### Purpose
Clarify feature objectives, scope, and expected outcomes through human interaction.

#### Activities
1. **Feature Overview**
   - Define the feature's purpose and goals
   - Identify target users and use cases
   - Establish success criteria

2. **Human Interaction**
   - List all unclear points
   - Conduct Q&A sessions with humans
   - Document all decisions and rationales

3. **Documentation**
   - Create requirements document in `/internal/requirements/`
   - Include functional and non-functional requirements
   - Get human approval before proceeding

#### Deliverables
- Requirements document (`/internal/requirements/[feature-name]-req.md`)
- Approval confirmation from human

#### Checklist
```markdown
/todo: Phase 1 - Requirements Definition
- [ ] Feature purpose and goals defined
- [ ] Target users identified
- [ ] Success criteria established
- [ ] Unclear points listed and resolved
- [ ] Requirements document created
- [ ] Human approval obtained
```

---

### Phase 2: Detailed Design

#### Purpose
Design the technical architecture and implementation approach.

#### Activities
1. **Technical Architecture**
   - Select technology stack
   - Design system architecture
   - Define component interfaces

2. **Security Assessment**
   - Identify security risks
   - Define mitigation strategies
   - Review data handling practices

3. **Proof of Concept**
   - Create minimal PoC if needed
   - Validate technical feasibility
   - Document findings

#### Deliverables
- Design document (`/internal/design/[feature-name]-design.md`)
- PoC code (if applicable)
- Human approval for design

#### Checklist
```markdown
/todo: Phase 2 - Detailed Design
- [ ] Technology stack selected
- [ ] Architecture diagram created
- [ ] Component interfaces defined
- [ ] Security risks assessed
- [ ] Dependencies identified
- [ ] PoC implemented (if needed)
- [ ] Design document created
- [ ] Human design approval obtained
```

---

### Phase 3: Test Design

#### Purpose
Design comprehensive test strategies before implementation.

#### Activities
1. **Test Case Design**
   - Derive test cases from requirements
   - Design positive test scenarios
   - Design negative test scenarios
   - Define boundary value tests

2. **Test Planning**
   - Define test data requirements
   - Specify test environment needs
   - Plan performance tests (if needed)
   - Plan security tests (if needed)

3. **Acceptance Criteria**
   - Define clear acceptance criteria
   - Map criteria to requirements
   - Get human approval

#### Deliverables
- Test design document (`/internal/test-design/[feature-name]-test.md`)
- Test case specifications
- Acceptance criteria checklist

#### Checklist
```markdown
/todo: Phase 3 - Test Design
- [ ] Test cases derived from requirements
- [ ] Positive test scenarios created
- [ ] Negative test scenarios created
- [ ] Boundary value tests defined
- [ ] Performance test plan (if needed)
- [ ] Security test plan (if needed)
- [ ] Acceptance criteria documented
- [ ] Test data requirements defined
- [ ] Test environment specified
- [ ] Test design reviewed
- [ ] Human test design approval obtained
```

---

### Phase 4: Task Breakdown

#### Purpose
Decompose implementation into manageable tasks.

#### Activities
1. **Task Decomposition**
   - Break down feature into small tasks
   - Include test implementation tasks
   - Estimate effort for each task

2. **Priority Setting**
   - Define task dependencies
   - Set implementation order
   - Identify critical path

3. **Task Management**
   - Register tasks with TodoWrite tool
   - Set up progress tracking
   - Define completion criteria

#### Deliverables
- Task list with priorities
- TodoWrite entries
- Implementation schedule

#### Checklist
```markdown
/todo: Phase 4 - Task Breakdown
- [ ] Implementation tasks identified
- [ ] Test tasks included
- [ ] Task effort estimated
- [ ] Dependencies mapped
- [ ] Priorities assigned
- [ ] TodoWrite tasks created
- [ ] Schedule defined
```

---

### Phase 5: Implementation and Testing

#### Purpose
Develop the feature and ensure quality through testing.

#### Activities
1. **Implementation**
   - Write feature code
   - Follow coding standards
   - Implement error handling

2. **Unit Testing**
   - Write unit tests (80%+ coverage)
   - Execute all unit tests
   - Fix failing tests

3. **Integration Testing**
   - Test component interactions
   - Verify data flow
   - Test error scenarios

4. **Code Review**
   - Self-review code
   - Refactor as needed
   - Document complex logic

#### Deliverables
- Feature implementation
- Unit tests (`/tests/unit/`)
- Integration tests (`/tests/integration/`)
- Test execution reports

#### Checklist
```markdown
/todo: Phase 5 - Implementation and Testing
- [ ] Feature code implemented
- [ ] Unit tests written (80%+ coverage)
- [ ] All unit tests passing
- [ ] Integration tests written
- [ ] All integration tests passing
- [ ] Code review completed
- [ ] Refactoring done
- [ ] Code documented
```

---

### Phase 6: Verification and Documentation

#### Purpose
Ensure feature meets requirements and update documentation.

#### Activities
1. **Human Verification**
   - Demonstrate feature to human
   - Conduct acceptance testing
   - Gather feedback

2. **Feedback Integration**
   - Address human feedback
   - Make necessary adjustments
   - Re-test affected areas

3. **Documentation Update**
   - Update user documentation
   - Update technical documentation
   - Create release notes

#### Deliverables
- Acceptance test results (`/internal/test-reports/`)
- Updated documentation
- Release notes

#### Checklist
```markdown
/todo: Phase 6 - Verification and Documentation
- [ ] Feature demonstrated to human
- [ ] Acceptance tests executed
- [ ] Feedback collected
- [ ] Feedback addressed
- [ ] Documentation updated
- [ ] Release notes created
- [ ] Final approval obtained
```

---

## 📊 Test Coverage Requirements

| Test Type | Coverage Target | Measurement Tool | Report Location |
|-----------|----------------|------------------|-----------------|
| Unit Tests | 80% minimum | Built-in coverage | `/tests/coverage/` |
| Integration Tests | All critical paths | Manual tracking | `/internal/test-reports/` |
| Acceptance Tests | 100% requirements | Checklist | `/internal/test-reports/` |

## 📁 Directory Structure

```
/internal/
├── development-process.md      # This document
├── templates/                  # Process templates
│   ├── requirements.md
│   ├── design.md
│   ├── test-design.md
│   └── release-notes.md
├── requirements/               # Actual requirement docs
├── design/                     # Actual design docs
├── test-design/               # Actual test designs
│   ├── unit/
│   ├── integration/
│   └── acceptance/
└── test-reports/              # Test execution results
```

## 🚨 Important Notes

1. **Never skip phases** - Each phase builds on the previous one
2. **Get human approval** - Required at Phases 1, 2, 3, and 6
3. **Document everything** - Decisions, rationales, and changes
4. **Test first** - Design tests before implementation
5. **Maintain quality** - 80%+ test coverage is mandatory

## 🔗 Related Documents

- Main guidelines: `/CLAUDE.md`
- Quick reference: `/internal/dev-process-quick-ref.md`
- Templates: `/internal/templates/`

## 📝 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-01-09 | Initial creation | Claude Code |