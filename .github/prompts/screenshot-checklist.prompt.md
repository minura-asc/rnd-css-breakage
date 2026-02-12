---
name: screenshot-checklist
description: Generate screenshot checklist for QA testing
---
Generate a screenshot checklist for ${input:customerName} CSS deployment testing.

Based on the pages that typically have CSS issues:

**Required Screenshots:**
1. Homepage - all buttons visible
2. Forms page - submit buttons, input fields
3. Modal dialogs - OK/Cancel buttons
4. Dashboard - widgets and action buttons
5. Tables page - action buttons
6. Navigation - header buttons

For each page, create checklist items in this format:

**Page Name:**
- [ ] Screenshot: [page]_before_deployment.png
- [ ] Screenshot: [page]_after_deployment.png
- [ ] Compare: Check for color changes
- [ ] Compare: Check for size changes
- [ ] Compare: Check for layout shifts

Include:
- Naming convention: ${input:customerName}_[page]_[timestamp].png
- Storage location: qa-evidence/screenshots/${input:customerName}/
- Notes section for each screenshot

Output as markdown checklist ready to copy into test plan.