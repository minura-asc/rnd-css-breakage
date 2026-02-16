---
name: css-bug
description: Create CSS bug issue from analysis findings
---
Create a GitHub issue for CSS conflict found in analysis:

**Customer:** ${input:customer}
**Issue Summary:** ${input:issue}
**Severity:** ${input:severity}
**Page/Component:** ${input:page}

Generate a complete bug report with:

**Title Format:** [${input:customer} CSS] ${input:issue}

**Labels:** bug, css, ${input:customer}, ${input:severity}

**Issue Body Should Include:**

1. **Severity & Priority**
   - Severity: ${input:severity}
   - Priority: P1 (if CRITICAL), P2 (if HIGH), P3 (if MEDIUM/LOW)
   - Environment: Test

2. **Description**
   - Clear explanation of the visual/functional breakage

3. **Steps to Reproduce**
   - Uncomment ${input:customer} CSS in src/index.html
   - Run npm start
   - Navigate to ${input:page}
   - Observe the issue

4. **Expected vs Actual**
   - Expected Result: Normal appearance/behavior
   - Actual Result: Specific breakage observed

5. **Root Cause**
   - Include the problematic CSS code in code block
   - Explain why it breaks

6. **Impact Assessment**
   - User Impact: How users are affected
   - Business Impact: Deployment blocker, usability issue, etc.

7. **Affected Components**
   - List specific components/pages

8. **Related Documents**
   - Link to: qa_test_plan_${input:customer}.md
   - Link to: css_conflict_analysis.md

Create the issue now.