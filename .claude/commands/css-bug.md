---
name: css-bug
description: Create CSS bug issue from analysis findings
---
Create a GitHub issue for CSS conflict found in analysis:

**Customer:** $0
**Issue Summary:** $1
**Severity:** $2
**Page/Component:** $3

Generate a complete bug report with:

**Title Format:** [$0 CSS] $1

**Labels:** bug, css, $0, $2

**Issue Body Should Include:**

1. **Severity & Priority**
   - Severity: $2
   - Priority: P1 (if CRITICAL), P2 (if HIGH), P3 (if MEDIUM/LOW)
   - Environment: Test

2. **Description**
   - Clear explanation of the visual/functional breakage

3. **Steps to Reproduce**
   - Uncomment $0 CSS in src/index.html
   - Run npm start
   - Navigate to $3
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
   - Link to: qa_test_plan_$0.md
   - Link to: css_conflict_analysis.md

Create the issue now.