# 🧪 QA Test Plan: CustomerB CSS Deployment

**Customer:** CustomerB  
**Date:** February 16, 2026  
**Scope:** Navbar CSS customizations vs. new notification & role badge features  
**Tester:** [QA Engineer Name]  

---

## 🎯 Executive Summary

**Recommendation:** 🔴 **DO NOT DEPLOY**

**Quick Facts:**
- Conflicts found: **5 critical**, **2 moderate**
- Pages affected: **ALL pages** (navbar is global)
- Test time needed: **45 minutes** (critical path only)
- Risk level: **CRITICAL**

**One-Line Summary:** CustomerB's 6-month-old navbar CSS is incompatible with new notification badge, role badge, and online status features added to navbar. All navbar spans are styled as gray blocks, completely breaking visual hierarchy.

---

## 📊 Risk Assessment

| Issue | Severity | Priority | Confidence | Impact |
|-------|----------|----------|------------|--------|
| Notification badge appears as gray block | 🔴 CRITICAL | P1 | 100% | Users cannot see notification count; looks broken |
| Role badge appears as gray block | 🔴 CRITICAL | P1 | 100% | Role information invisible; gray box instead of badge |
| User section stacked vertically | 🔴 CRITICAL | P1 | 100% | Navbar height doubles; broken layout |
| Icons oversized (28px) | 🟡 HIGH | P1 | 100% | Icons too large; visual inconsistency |
| Online status mispositioned | 🟡 HIGH | P2 | 95% | Green dot not aligned with avatar |
| Navbar actions wrap | 🟢 MEDIUM | P2 | 80% | May cause layout shifts on smaller screens |
| Position conflicts | 🟢 MEDIUM | P3 | 70% | Unknown cascade effects |

---

## 🔍 Predicted Breakages

### Issue #1: Notification Badge Becomes Gray Block
**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**
- Notification badge (red circle with "3" on bell icon)
- Expected: Small red circular badge in top-right of bell icon
- After deployment: Gray rectangular block with padding, mispositioned

**Root Cause:**
```css
/* CustomerB CSS - Written 6 months ago for their custom dropdown labels */
nb-action span {
  display: block !important;
  background: #f0f0f0 !important;  /* ❌ Gray background */
  padding: 8px 12px !important;    /* ❌ Large padding */
  font-size: 13px !important;
  color: #333 !important;          /* ❌ Dark text (should be white) */
  border-radius: 4px !important;   /* ❌ Rectangle (should be circle) */
  min-width: 80px !important;      /* ❌ Way too wide */
  text-align: center !important;
}
```

**New navbar HTML that breaks:**
```html
<nb-action class="notification-action">
  <div class="notification-wrapper">
    <nb-icon icon="bell-outline"></nb-icon>
    <span class="notification-badge">3</span>  <!-- ❌ Targeted by customerB CSS -->
  </div>
</nb-action>
```

**Impact:**
- **User impact:** Notification feature appears completely broken; users think app is buggy
- **Business impact:** Customers lose trust; support tickets increase; damages CustomerB's professional image

**Where to Test:**
- Dashboard (http://localhost:4200/pages/dashboard)
- All pages (navbar is global)
- Focus on top-right navbar area

**Visual Comparison:**
```
Expected (core app):     Broken (CustomerB CSS):
Bell icon               Bell icon
  [3]  ← red circle       [    3    ]  ← gray rectangle
```

---

### Issue #2: Role Badge Becomes Gray Block
**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**
- "Admin" role badge next to username
- Expected: Small blue badge with white text "ADMIN"
- After deployment: Large gray block with dark text "Admin"

**Root Cause:**
Same CSS selector as Issue #1:
```css
nb-action span {
  /* Same gray styling applied to role-badge span */
}
```

**New navbar HTML that breaks:**
```html
<nb-action class="user-action">
  <div class="user-container">
    <!-- ... -->
    <span class="role-badge">Admin</span>  <!-- ❌ Targeted by customerB CSS -->
  </div>
</nb-action>
```

**Impact:**
- **User impact:** Role information looks wrong; identity confusion
- **Business impact:** Security concern - roles appear as UI bugs

**Where to Test:**
- Any page with navbar
- Desktop view only (badge hidden on mobile per `*ngIf="!userPictureOnly"`)
- Check user section in top-right

---

### Issue #3: User Section Stacked Vertically
**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**
- User avatar, online status, and role badge
- Expected: Horizontal layout (avatar + badge side-by-side)
- After deployment: Vertical stack (avatar on top, badge below)

**Root Cause:**
```css
/* CustomerB CSS */
.user-action > div {
  flex-direction: column !important;  /* ❌ Forces vertical stacking */
  align-items: center !important;
}
```

**Application expects:**
```scss
/* Core app CSS */
.user-action {
  .user-container {
    display: flex;
    align-items: center;
    gap: 8px;
    /* Default flex-direction: row */
  }
}
```

**Impact:**
- **User impact:** Navbar height increases significantly; layout looks broken
- **Business impact:** Unprofessional appearance; may trigger support calls

**Where to Test:**
- Any page navbar
- Desktop view (width > 1200px)
- User section in top-right

**Visual Comparison:**
```
Expected:                Broken:
[Avatar] ADMIN          [Avatar]
                         ADMIN
```

---

### Issue #4: Icons Oversized
**Severity:** 🟡 HIGH  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**
- All navbar icons (menu, search, email, bell)
- Expected: 1.5rem (24px) for most icons
- After deployment: 28px (all icons)

**Root Cause:**
```css
/* CustomerB CSS */
.header-container nb-icon {
  font-size: 28px !important;  /* ❌ Overrides core size */
  color: #2c3e50 !important;
}
```

**Application expects:**
```scss
/* Core app CSS */
.notification-action {
  nb-icon {
    font-size: 1.5rem;  /* 24px */
  }
}
```

**Impact:**
- **User impact:** Visual inconsistency; icons look too large
- **Business impact:** Branding inconsistency; unprofessional appearance

**Where to Test:**
- Any page navbar
- Check all icons: menu, search, email, bell

---

### Issue #5: Online Status Mispositioned
**Severity:** 🟡 HIGH  
**Priority:** P2  
**Confidence:** 95%

**What Will Break:**
- Green "online" status dot on avatar
- Expected: Bottom-right corner of avatar (2px from edge)
- After deployment: May be misaligned due to column layout

**Root Cause:**
Indirect effect of Issue #3 (vertical stacking). When `.user-action > div` becomes column layout, the absolute positioning of `.online-status` may no longer align correctly.

**Application expects:**
```scss
.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
}
```

**Impact:**
- **User impact:** Confusing visual; status indicator not clearly associated with avatar
- **Business impact:** Minor - doesn't break functionality

**Where to Test:**
- Dashboard
- Check green dot position relative to avatar

---

### Issue #6: Navbar Actions May Wrap
**Severity:** 🟢 MEDIUM  
**Priority:** P2  
**Confidence:** 80%

**What Will Break:**
- `<nb-actions>` container
- Expected: Actions stay on one line (horizontal)
- After deployment: Actions may wrap to new line

**Root Cause:**
```css
/* CustomerB CSS */
nb-actions {
  flex-wrap: wrap !important;  /* ❌ Allows wrapping */
  gap: 15px !important;
}
```

**Impact:**
- **User impact:** Layout may shift on smaller screens; inconsistent navbar height
- **Business impact:** Minor - may only affect edge cases

**Where to Test:**
- Resize browser window to 1024px - 1200px width
- Check if actions wrap to second line

---

### Issue #7: Position Conflicts
**Severity:** 🟢 MEDIUM  
**Priority:** P3  
**Confidence:** 70%

**What Will Break:**
- Unknown - potential cascade effects
- Expected: Normal positioning
- After deployment: May affect dropdowns or overlays

**Root Cause:**
```css
/* CustomerB CSS */
nb-action {
  position: relative !important;
}

nb-action > div {
  position: static !important;
}
```

**Impact:**
- **User impact:** Unknown - may affect context menus, dropdowns
- **Business impact:** Low - needs exploratory testing

**Where to Test:**
- Click user avatar to open context menu
- Check if menu positions correctly

---

## 📋 Manual Test Plan

### Pre-Test Setup
**Environment:** Local development (http://localhost:4200)  
**Browser:** Chrome (latest)  
**User:** Any test account  

**CustomerB CSS Activation:**
1. Open `src/index.html`
2. Find the customer CSS link section
3. Comment out: `<link rel="stylesheet" href="customers/none/custom.css">`
4. Uncomment: `<link rel="stylesheet" href="customers/customerB/custom.css">`
5. Save file
6. App should hot-reload automatically
7. Refresh browser if needed

**Comparison Setup:**
- Have two browser windows side-by-side:
  - Window 1: Core app (no customer CSS)
  - Window 2: CustomerB CSS
- Open both to dashboard: http://localhost:4200/pages/dashboard

---

### Test Session 1: Critical Issues (20 min)

**Setup:** CustomerB CSS active, desktop viewport (1440px)

#### Test 1.1: Notification Badge Breakage
- [ ] Navigate to http://localhost:4200/pages/dashboard
- [ ] Locate bell icon in top-right navbar
- [ ] Check notification badge (number "3")
- [ ] **Expected:** Small red circular badge, top-right of bell
- [ ] **If broken:** Gray rectangular block, looks like button
- [ ] **Screenshot:** `customerB_notification_badge_broken.png` (REQUIRED)
- [ ] **Stop condition:** YES - This is a deployment blocker

**Checklist:**
```
Expected:                     Broken:
Bell icon                    Bell icon
  [3] ← tiny red circle        [    3    ] ← gray rectangle

✅ Red background            ❌ Gray (#f0f0f0) background
✅ White text                ❌ Dark (#333) text
✅ ~18px badge               ❌ 80px+ wide block
✅ Circular (border-radius)  ❌ Rounded rectangle
```

---

#### Test 1.2: Role Badge Breakage
- [ ] Same page (dashboard)
- [ ] Locate user section in top-right navbar
- [ ] Find "Admin" badge next to username/avatar
- [ ] **Expected:** Small blue badge with white "ADMIN" text
- [ ] **If broken:** Large gray block with dark "Admin" text
- [ ] **Screenshot:** `customerB_role_badge_broken.png` (REQUIRED)
- [ ] **Stop condition:** YES - This is a deployment blocker

**Checklist:**
```
Expected:                     Broken:
[Avatar] [ADMIN] ← blue      [Avatar] [  Admin  ] ← gray

✅ Blue (#0095ff) background ❌ Gray (#f0f0f0) background
✅ White text                ❌ Dark (#333) text
✅ Uppercase "ADMIN"         ❌ Title case "Admin"
✅ Compact size              ❌ Large padded block
```

---

#### Test 1.3: User Section Vertical Stack
- [ ] Same page
- [ ] Check user section layout (avatar + badge)
- [ ] **Expected:** Avatar and badge horizontally aligned
- [ ] **If broken:** Avatar on top, badge below (stacked)
- [ ] **Screenshot:** `customerB_user_section_stacked.png` (REQUIRED)
- [ ] **Stop condition:** YES - This is a deployment blocker

**Visual Check:**
```
Expected:                    Broken:
[Avatar] ADMIN              [Avatar]
                             ADMIN
                             
Navbar height: ~60px        Navbar height: ~100px+
```

---

#### Test 1.4: Icon Size Check
- [ ] Same page
- [ ] Check all navbar icons: menu, search, email, bell
- [ ] Compare icon sizes to core app (side-by-side windows)
- [ ] **Expected:** Icons ~24px (1.5rem)
- [ ] **If broken:** Icons noticeably larger (~28px)
- [ ] **Screenshot:** `customerB_icons_oversized.png` (OPTIONAL)
- [ ] **Stop condition:** NO - High priority but not blocker

**Checklist:**
- [ ] Menu hamburger icon - check size
- [ ] Search icon - check size
- [ ] Email icon - check size
- [ ] Bell icon - check size

---

### Test Session 2: High Priority Issues (15 min)

#### Test 2.1: Online Status Position
- [ ] Dashboard page
- [ ] Locate user avatar (top-right)
- [ ] Find green "online" status dot
- [ ] **Expected:** Dot in bottom-right corner of avatar (2px from edges)
- [ ] **If broken:** Dot misaligned (too far, wrong side, etc.)
- [ ] **Screenshot:** `customerB_online_status.png` (if broken)
- [ ] **Stop condition:** NO

---

#### Test 2.2: Navbar Wrapping (Responsive)
- [ ] Dashboard page
- [ ] Resize browser window to 1100px width
- [ ] Check if navbar actions wrap to new line
- [ ] **Expected:** Actions stay on one line
- [ ] **If broken:** Actions wrap, navbar height increases
- [ ] **Screenshot:** `customerB_navbar_wrap.png` (if broken)
- [ ] **Stop condition:** NO

**Resize checkpoints:**
- [ ] 1440px width - check layout
- [ ] 1200px width - check layout
- [ ] 1100px width - check layout
- [ ] 1024px width - check layout

---

### Test Session 3: Moderate Priority (10 min)

#### Test 3.1: User Menu Dropdown Position
- [ ] Dashboard page
- [ ] Click on user avatar
- [ ] Check if context menu opens
- [ ] **Expected:** Menu appears below avatar, aligned right
- [ ] **If broken:** Menu mispositioned or doesn't open
- [ ] **Screenshot:** `customerB_user_menu.png` (if broken)
- [ ] **Stop condition:** NO

**Checklist:**
- [ ] Menu opens on click
- [ ] Menu positioned correctly
- [ ] Menu items visible and clickable

---

#### Test 3.2: Smoke Test Across Pages
Test navbar on different page types to ensure global impact:

- [ ] **Dashboard:** http://localhost:4200/pages/dashboard
  - Check navbar appearance
- [ ] **Forms:** http://localhost:4200/pages/forms/inputs
  - Check navbar appearance
- [ ] **Tables:** http://localhost:4200/pages/tables/smart-table
  - Check navbar appearance
- [ ] **Charts:** http://localhost:4200/pages/charts/echarts
  - Check navbar appearance

**Expected:** Same breakages on all pages (navbar is global)  
**Screenshot:** Only if issues differ across pages

---

## ⏱️ Time Estimates

| Activity | Time | Resource |
|----------|------|----------|
| Setup (activate CSS) | 5 min | QA Engineer |
| Critical tests (Session 1) | 20 min | QA Lead |
| High priority (Session 2) | 15 min | QA Engineer |
| Moderate priority (Session 3) | 10 min | QA Engineer |
| Bug reporting (if issues found) | 15 min | QA Lead |
| **Total** | **65 min** | **QA Team** |
| **Critical path only** | **45 min** | **QA Lead** |

**Note:** Critical path includes setup + Session 1 + bug reporting only. This is the minimum required to make a deploy/no-deploy decision.

---

## 🚨 Stop Conditions

**STOP testing and report immediately if:**

1. ✅ **Notification badge appears as gray block** (Test 1.1 fails)
   - This confirms 100% breakage
   - No need to test further for deploy decision
   - Continue testing only for comprehensive bug report

2. ✅ **Role badge appears as gray block** (Test 1.2 fails)
   - Confirms second critical issue
   - Pattern established (all spans break)

3. ✅ **User section stacked vertically** (Test 1.3 fails)
   - Confirms layout breakage
   - Navbar unusable in current state

**Why stop:**
- Three critical blockers = definitive **DO NOT DEPLOY** decision
- Further testing only adds detail to bug report
- Dev team needs to fix CSS before deployment possible
- No point testing moderate issues when critical issues block deployment

**After stopping:**
- Document all findings so far
- Create bug report (see template below)
- Schedule meeting with dev team
- Do NOT continue with Session 2/3 unless needed for comprehensive report

---

## 📝 Bug Report Template

If issues found (which is expected), use this template:

---

**Title:** [CustomerB CSS] Navbar notification badge, role badge, and layout completely broken

**Severity:** CRITICAL  
**Priority:** P1  
**Environment:** Local development  
**Browser:** Chrome (latest)  
**Affects:** ALL pages (navbar is global)

**Summary:**
CustomerB's navbar CSS customizations (written 6 months ago) are incompatible with new navbar features added recently. The CSS targets all `<span>` elements inside `<nb-action>`, styling them as gray blocks. This breaks notification badges, role badges, and other navbar elements.

**Steps to Reproduce:**
1. Open `src/index.html`
2. Activate CustomerB CSS: `<link rel="stylesheet" href="customers/customerB/custom.css">`
3. Start app: `npm start`
4. Navigate to http://localhost:4200/pages/dashboard
5. Check navbar (top-right)

**Expected Result:**
- Notification badge: Small red circle with "3"
- Role badge: Small blue badge with "ADMIN"
- User section: Horizontal layout (avatar + badge side-by-side)

**Actual Result:**
- Notification badge: Large gray rectangular block
- Role badge: Large gray rectangular block
- User section: Vertical stack (avatar on top, badge below)
- All icons oversized (28px)

**Impact:**
- **User impact:** Navbar appears completely broken; users will think app is buggy
- **Business impact:** Cannot deploy to CustomerB; damages professional image; potential support ticket surge

**Root Cause:**
CustomerB's CSS was written for their custom dropdown menus 6 months ago:
```css
nb-action span {
  display: block !important;
  background: #f0f0f0 !important;
  padding: 8px 12px !important;
  /* ... all spans styled as gray blocks ... */
}
```

New navbar features added spans for notification badges and role badges, which are now caught by this overly broad selector.

**Recommendation:**
1. CustomerB CSS needs to be refactored with more specific selectors
2. Scope CustomerB's span styling to their specific dropdown feature only
3. Avoid global selectors like `nb-action span` without additional qualifiers
4. Alternative: namespace CustomerB's custom features with specific classes

**Screenshots:**
- [Attach: customerB_notification_badge_broken.png]
- [Attach: customerB_role_badge_broken.png]
- [Attach: customerB_user_section_stacked.png]

**Related:**
- Test Plan: `qa_test_plan_customerB.md`
- Customer CSS: `src/customers/customerB/custom.css`
- Navbar Component: `src/app/@theme/components/header/header.component.*`
- Testing Scenarios: `TESTING-SCENARIOS.md`

**Blocked Work:**
- CustomerB deployment
- Any customer deployments using similar CSS patterns
- Navbar feature rollout

---

## 📸 Evidence Collection

### Required Screenshots

For **Session 1 (Critical)** - ALL REQUIRED:
- [ ] `customerB_notification_badge_broken.png`
  - Full navbar in view
  - Bell icon + broken badge clearly visible
  - Highlight/circle the broken badge

- [ ] `customerB_role_badge_broken.png`
  - User section in view
  - Avatar + broken role badge clearly visible
  - Highlight/circle the broken badge

- [ ] `customerB_user_section_stacked.png`
  - Full user section in view
  - Show vertical stacking clearly
  - Compare side-by-side with core app (split screen)

### Optional Screenshots

For **Session 2/3** - if issues found:
- [ ] `customerB_icons_oversized.png` (if sizes noticeably different)
- [ ] `customerB_online_status.png` (if misaligned)
- [ ] `customerB_navbar_wrap.png` (if wrapping occurs)
- [ ] `customerB_user_menu.png` (if menu broken)

### Screenshot Guidelines
- **Resolution:** 1920x1080 or actual viewport size
- **Format:** PNG (lossless)
- **Annotations:** Use arrows/circles to highlight issues
- **Comparison:** Include side-by-side with core app when helpful
- **Naming:** Follow pattern: `customerB_[issue]_[location].png`

---

## 📚 Reference Information

### Technical Context
**Why this happened:**
- CustomerB extended navbar with custom features 6 months ago
- They added custom dropdown menus using spans inside nb-action
- Their CSS used broad selectors: `nb-action span { ... }`
- Core app recently added navbar features that also use spans:
  - Notification badge (`<span class="notification-badge">`)
  - Role badge (`<span class="role-badge">`)
  - Online status (`<span class="online-status">`)
- CustomerB's CSS now targets these new spans unintentionally

**Architecture notes:**
- Navbar is global (part of @theme layout)
- Customer CSS loaded last in cascade (overrides core)
- CustomerB uses `!important` extensively (hard to override)
- No CSS namespacing or scoping in place

### Historical Context
From TESTING-SCENARIOS.md:
> CustomerB extended the core navbar 6 months ago with their own features  
> They styled all spans inside nb-action to be dropdown labels

This confirms the CSS was written before new navbar features existed, creating backward compatibility issue.

### Files Involved
- **Customer CSS:** `src/customers/customerB/custom.css`
- **Core Component:** `src/app/@theme/components/header/header.component.*`
- **Navbar Styles:** `src/app/@theme/components/header/header.component.scss`
- **CSS Activation:** `src/index.html` (line ~12)
- **Test Scenarios:** `TESTING-SCENARIOS.md`

### Related Issues
- Search git history for: "customerB", "navbar", "nb-action", "span"
- Check for previous CSS conflict reports
- Review: `risk reports/css_conflict_report.md` (may reference older version of customerB CSS)

---

## ✅ Success Criteria

This test plan is successful if:

1. ✅ **Clear deploy/no-deploy decision made** within 45 minutes
2. ✅ **All critical issues documented** with screenshots
3. ✅ **Bug report ready to submit** (no dev questions needed)
4. ✅ **Impact understood** by both QA and dev teams
5. ✅ **Root cause identified** for dev team
6. ✅ **Comparison data collected** (core vs customerB)

---

## 🔄 Next Steps After Testing

### If All Critical Tests Fail (Expected Outcome):
1. ✅ Submit bug report immediately
2. ✅ Mark deployment as **BLOCKED**
3. ✅ Schedule dev team meeting
4. ✅ Provide test plan and screenshots to devs
5. ✅ Wait for CSS refactor before retesting

### If Some Tests Pass (Unexpected):
1. Complete all test sessions
2. Document which issues occur and which don't
3. Reassess severity based on actual findings
4. May downgrade to CONDITIONAL deployment with documented workarounds

### For Dev Team (Handoff):
Provide:
- This test plan
- All screenshots from Session 1
- Bug report (filled out)
- Recommendation: Refactor customerB CSS with scoped selectors

---

## 📞 Contact & Escalation

**If you need clarification:**
- Test plan questions → QA Lead
- Technical questions → Dev Lead
- Deployment decision → Engineering Manager

**Escalation triggers:**
- Cannot reproduce issues (unexpected)
- New issues found not in this plan
- Customer requests immediate deployment (requires risk discussion)

---

## 📝 Test Execution Log

**Tester:** _______________________  
**Date/Time:** _______________________  
**Environment:** _______________________  
**Browser:** _______________________  

**Results:**
- Test 1.1 (Notification Badge): ☐ PASS ☐ FAIL
- Test 1.2 (Role Badge): ☐ PASS ☐ FAIL
- Test 1.3 (User Section): ☐ PASS ☐ FAIL
- Test 1.4 (Icon Size): ☐ PASS ☐ FAIL
- Test 2.1 (Online Status): ☐ PASS ☐ FAIL
- Test 2.2 (Navbar Wrap): ☐ PASS ☐ FAIL
- Test 3.1 (User Menu): ☐ PASS ☐ FAIL
- Test 3.2 (Smoke Test): ☐ PASS ☐ FAIL

**Final Decision:** ☐ DEPLOY ☐ DO NOT DEPLOY ☐ CONDITIONAL

**Notes:**
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

**Approved By:** _______________________  
**Date:** _______________________

---

**END OF TEST PLAN**
