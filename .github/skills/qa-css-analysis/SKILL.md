---
name: qa-css-analysis
description: Generate QA test plans for customer CSS deployments by analyzing conflicts between customer CSS and application styles. Predicts breakages before deployment and provides step-by-step manual testing checklists.
---
## When to Use This Skill
- User mentions: "QA test plan", "CSS conflicts", "analyze CSS for [customer]"
- User asks: "what will break", "test plan for deployment"
- Customer CSS deployment scenarios
- Pre-deployment risk assessment

## Workflow

### Input Requirements
- Customer name (e.g., "customerA", "customerB")
- Location: `src/customers/[customer]/custom.css`

### Analysis Steps

1. **Read Customer CSS Files**
   - Location: `src/customers/[customer]/custom.css`
   - Identify: Global selectors, !important flags, class names
   - Flag: High-risk patterns (global `button`, element selectors)

2. **Read Application Styles**
   - Core: `src/app/@core/components/`
   - Theme: `src/app/@theme/`
   - Pages: `src/app/pages/`
   - Identify: Existing selectors that may conflict

3. **Conflict Detection**
   - Compare customer CSS selectors with application selectors
   - Check specificity battles
   - Identify `!important` conflicts
   - Predict cascade order issues

4. **Git History Analysis**
   - Search commits for: "CSS", "style", "button", "[customer name]"
   - Find past CSS bugs
   - Identify patterns (e.g., buttons frequently break)
   - Use historical data to improve predictions

5. **Generate QA Test Report**

### Output Format

Generate: `qa_test_plan_[customer].md`

#### Required Sections:

**1. Executive Summary**
````markdown
## 🎯 Executive Summary

**Recommendation:** 🔴 DO NOT DEPLOY / 🟡 CONDITIONAL / ✅ SAFE TO DEPLOY

**Quick Facts:**
- Conflicts found: [number] critical, [number] moderate
- Pages affected: [list]
- Test time needed: [hours]
- Risk level: CRITICAL/HIGH/MEDIUM/LOW

**One-Line Summary:** [Brief description of main issue]
````

**2. Risk Assessment**
````markdown
## 📊 Risk Assessment

| Issue | Severity | Priority | Confidence | Impact |
|-------|----------|----------|------------|--------|
| [Issue name] | 🔴 CRITICAL | P1 | 95% | [Description] |
````

Severity Levels:
- 🔴 CRITICAL: Blocks core functionality, application unusable
- 🟡 HIGH: Major visual issues, some functionality affected
- 🟢 MEDIUM: Minor cosmetic issues, workarounds available
- ⚪ LOW: Negligible impact

Priority Levels:
- P1: Test immediately, blocks deployment
- P2: Test before deployment, may block
- P3: Test if time permits, document only

**3. Predicted Breakages**
For each issue:
````markdown
### Issue #[N]: [Short Title]
**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** [percentage]%

**What Will Break:**
- [Specific component/feature]
- Expected: [Normal behavior]
- After deployment: [Broken behavior]

**Root Cause:**
```css
/* Show the problematic CSS */
```

**Impact:**
- User impact: [How users are affected]
- Business impact: [Revenue, reputation, etc.]

**Where to Test:**
- [Page 1]
- [Page 2]
- [Feature X]

**Test Steps:**
1. Navigate to [page]
2. Check [specific element]
3. Expected: [what should happen]
4. If broken: [what will happen instead]
````

**4. Manual Test Plan**
````markdown
## 📋 Manual Test Plan

### Test Session 1: Critical Issues (XX min)

**Setup:**
- Browser: Chrome (latest)
- User: [test account]
- Environment: [test/staging]

#### Test 1.1: [Test Name]
- [ ] Step 1: [Action]
- [ ] Step 2: [Action]
- [ ] Expected: [Result]
- [ ] If broken: [What to report]
- [ ] Screenshot: Required/Optional
- [ ] Stop condition: Yes/No
````

**5. Time Estimates**
````markdown
## ⏱️ Time Estimates

| Activity | Time | Resource |
|----------|------|----------|
| Critical tests | XX min | QA Lead |
| High priority | XX min | QA Engineer |
| Comprehensive | XX min | QA Engineer |
| Bug reporting | XX min | QA Lead |
| **Total** | **XX hours** | **QA Team** |
````

**6. Stop Conditions**
````markdown
## 🚨 Stop Conditions

**STOP testing and report immediately if:**
1. [Critical condition 1]
2. [Critical condition 2]

**Why stop:**
- No point continuing
- Critical blocker found
- Report to dev immediately
````

**7. Bug Report Template**
````markdown
## 📝 Bug Report Template

If issues found, use:

**Title:** [[Customer] CSS] [Short description]

**Severity:** CRITICAL/HIGH/MEDIUM/LOW  
**Priority:** P1/P2/P3  
**Environment:** [test/staging]

**Steps to Reproduce:**
1. [Step]
2. [Step]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Impact:**
[User/business impact]

**Screenshots:** [Attach]
**Related:** [Link to test plan]
````

**8. Evidence Collection**
````markdown
## 📸 Evidence Collection

**Required Screenshots:**
- [ ] [Screenshot 1 description]
- [ ] [Screenshot 2 description]

**Naming:** `[customer]_[issue]_[page].png`
````

## Best Practices

### For Accurate Predictions
1. Always check git history for patterns
2. Focus on high-risk selectors: `button`, `input`, `div`, `a`
3. Any `!important` flag is a red flag
4. Global selectors (no class/ID) are dangerous
5. Check CSS cascade order (customer CSS loaded last?)

### For QA-Friendly Output
1. Use checkboxes `[ ]` for manual steps
2. Include time estimates for planning
3. Provide exact pages/URLs to test
4. Include severity/priority for triage
5. Use emojis for quick visual scanning
6. Include stop conditions (when to halt)
7. Provide ready-to-use bug templates

### For Risk Assessment
**Confidence Levels:**
- 100%: Same selector with !important
- 90-95%: Global selector, high specificity
- 80-90%: Similar selectors, likely conflict
- 70-80%: Potential conflict, needs testing
- <70%: Low risk, spot check only

**Severity Guidelines:**
- CRITICAL: Application unusable, deployment blocker
- HIGH: Major features broken, urgent fix needed
- MEDIUM: Visual issues, workarounds available
- LOW: Minor cosmetic, can document and fix later

## Output Location
Save report to: `qa_test_plan_[customer].md`

## Examples

### Good Usage
````
User: "Analyze CSS for customerA deployment"
Claude: [Reads this skill] → [Analyzes] → [Generates QA-focused report]
````

### Bad Usage (Don't Do)
- Generating developer-focused technical reports
- Focusing on how to fix (that's for devs, not QA)
- Omitting manual test steps (QA needs step-by-step)
- No time estimates (QA needs to plan)

## Integration with Other Workflows
- Combine with visual regression testing skill (if exists)
- Reference git history patterns
- Link to automated test results (if available)
- Coordinate with deployment procedures

## Success Criteria
QA engineer should be able to:
1. Understand risk without technical knowledge
2. Know exactly what to test
3. Have step-by-step checklist ready
4. Estimate testing time accurately
5. Write bug reports quickly (templates provided)
6. Make deploy/no-deploy decision confidently

## Maintenance Notes
- Update when new common CSS patterns emerge
- Add historical patterns from past incidents
- Refine severity criteria based on feedback
- Keep test checklists current with application structure