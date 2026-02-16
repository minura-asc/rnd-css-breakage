# QA Test Report - CustomerC CSS Deployment

## 🚨 Executive Summary

**RECOMMENDATION: ⛔ DO NOT DEPLOY**

CustomerC's CSS contains **highly aggressive global selectors** with `!important` flags that will cause **catastrophic layout breakage** across the entire application. This is similar to previous CustomerA CSS incidents that required emergency reverts.

**Risk Level:** 🔴 **CRITICAL - DEPLOYMENT BLOCKER**  
**Estimated Testing Time:** 3-4 hours (if deployment were to proceed)  
**Predicted Breakages:** 7 critical issues affecting 15+ pages

---

## 📊 Risk Assessment

| Issue | Severity | Priority | Confidence | Impact |
|-------|----------|----------|------------|--------|
| Status Cards Complete Layout Collapse | 🔴 CRITICAL | P1 | 100% | Dashboard unusable - progress bars vertical, buttons full-width |
| Grid System Disabled Site-Wide | 🔴 CRITICAL | P1 | 100% | All pages collapse to single column, responsive design broken |
| All Card Buttons Full-Width | 🔴 CRITICAL | P1 | 100% | Forms, dialogs, modals - all button layouts destroyed |
| Alert Badges Become Banners | 🔴 CRITICAL | P1 | 95% | Status indicators become full-width blocks, overlapping content |
| Icons Invisible (10px gray) | 🟡 HIGH | P1 | 100% | All card icons nearly invisible, visual hierarchy broken |
| Card Headers/Footers Vertical Stack | 🟡 HIGH | P2 | 100% | All cards lose horizontal layout, take 2x vertical space |
| Value Displays Downsized | 🟢 MEDIUM | P2 | 90% | Metrics harder to read, inconsistent with design system |

---

## 🔍 Predicted Breakages

### Issue #1: Status Cards Component - Complete Layout Collapse

**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**

The Real-Time Status dashboard card component will be completely destroyed. This is the primary dashboard widget showing system metrics.

**Expected Behavior:**
- Horizontal progress bars showing percentage completion
- Multi-button footer with "Details" and settings buttons side-by-side
- Grid layout showing 3 cards per row (responsive)
- Normal-sized icons and trend indicators

**After Deployment:**
- Progress bars will flip to **vertical orientation** with 60px minimum height
- Buttons will become **full-width stacked blocks** with 15px padding each
- All cards will stack in **single column** regardless of screen size
- Icons will shrink to **10px and turn gray** (nearly invisible)
- Alert badges will expand to **full-width centered banners**
- Card headers will become **vertical stacks** with large gaps

**Root Cause:**

```css
/* CustomerC CSS - TOO AGGRESSIVE */
.progress-bar {
  height: 100% !important;          /* Forces vertical */
  flex-direction: column !important;
}

nb-card button {
  display: block !important;        /* Forces full-width */
  width: 100% !important;
}

[class*="grid"] {
  display: block !important;        /* Kills grid layout */
}

nb-card nb-icon {
  font-size: 10px !important;       /* Invisible icons */
  color: #999 !important;
}
```

**Impact:**
- **User Impact:** Dashboard becomes unusable, metrics unreadable, cannot interact with cards properly
- **Business Impact:** Customers cannot monitor system status, support calls will spike immediately
- **Data Loss Risk:** Progress indicators will be misaligned/invisible, users cannot see completion status

**Where to Test:**
- [Dashboard page](src/app/pages/dashboard/dashboard.component.html) - Status Cards section
- [Status Cards component](src/app/pages/dashboard/status-cards/status-cards.component.html)
- All dashboard cards with progress indicators

**Test Steps:**
1. Navigate to main Dashboard page (`/pages/dashboard`)
2. Locate "Real-Time Status" section at top
3. Check each status card layout:
   - **Expected:** 3 cards per row, horizontal progress bar (6px height), two buttons side-by-side
   - **Broken:** Single column, vertical progress bar (60px+ height), buttons stacked full-width
4. Check icons in card headers:
   - **Expected:** ~20px colored icons
   - **Broken:** 10px gray icons (nearly invisible)
5. Check alert badges (if any cards have alerts):
   - **Expected:** Small rounded badge in corner
   - **Broken:** Full-width centered banner blocking header content

---

### Issue #2: Grid System Disabled - Site-Wide Layout Collapse

**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**

Bootstrap grid system (`row`, `col-*` classes) will be completely disabled across the entire application. Every page using grid layouts will collapse to single-column mobile view.

**Expected Behavior:**
- Multi-column layouts: Forms side-by-side, dashboard widgets in grid
- Responsive breakpoints working: Desktop shows 3-4 columns, mobile shows 1
- Content organized in readable horizontal sections

**After Deployment:**
- **ALL pages collapse to single column** regardless of screen size
- Desktop users see mobile layout (wasted screen space)
- Forms that were side-by-side now stack vertically (excessive scrolling)
- Dashboard widgets lose grid arrangement (endless vertical scroll)

**Root Cause:**

```css
/* CustomerC CSS - NUCLEAR OPTION */
[class*="grid"] {
  display: block !important;    /* Disables ALL grid/flex layouts */
}

[class*="grid"] > * {
  width: 100% !important;       /* Forces all children full-width */
  margin-bottom: 20px !important;
}
```

**Impact:**
- **User Impact:** Desktop experience becomes mobile-only, excessive scrolling, poor usability
- **Business Impact:** Power users cannot work efficiently, productivity drops significantly
- **Accessibility:** Users with large monitors cannot utilize screen space

**Where to Test:**
- [Dashboard](src/app/pages/dashboard/dashboard.component.html) - Temperature, Electricity, Rooms sections
- [Forms - Form Layouts](src/app/pages/forms/form-layouts/form-layouts.component.html) - "Using the Grid" form
- [Modal Overlays - All pages](src/app/pages/modal-overlays/) - Dialogs, Popovers, Tooltips
- Any page with `<div class="row">` and `<div class="col-*">` markup

**Test Steps:**
1. Navigate to Dashboard (`/pages/dashboard`)
2. Resize browser to full desktop width (1920px+)
3. Check widget layout:
   - **Expected:** Temperature + Electricity side-by-side, Rooms + Contacts in 2 columns
   - **Broken:** All widgets stacked vertically in single column
4. Navigate to Forms > Form Layouts (`/pages/forms/layouts`)
5. Check "Using the Grid" form:
   - **Expected:** Two-column form layout
   - **Broken:** Single column, all form rows stacked
6. Navigate to Modal Overlays > Dialog (`/pages/modal-overlays/dialog`)
7. Check card layout:
   - **Expected:** 4 cards in row on desktop
   - **Broken:** All cards stacked vertically

---

### Issue #3: All Card Buttons Forced Full-Width

**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**

Every button inside `nb-card` components (used in 90% of the application) will become full-width stacked blocks. Multi-button layouts will be destroyed.

**Expected Behavior:**
- Dialog footers: Multiple action buttons side-by-side (Cancel, Submit)
- Form cards: Submit buttons right-aligned or inline
- Card footers: Action buttons distributed horizontally
- Compact button groups with appropriate sizing

**After Deployment:**
- **All buttons become full-width blocks** with 15px padding
- **Buttons stack vertically** with 8px gaps
- **Dialog actions lose visual hierarchy** (Primary vs Secondary unclear)
- **Forms take 2-3x more vertical space**

**Root Cause:**

```css
/* CustomerC CSS - AFFECTS ALL CARDS */
nb-card button,
.card-footer button {
  display: block !important;
  width: 100% !important;
  margin: 8px 0 !important;
  padding: 15px !important;
}
```

**Impact:**
- **User Impact:** Confusing UI, harder to find Cancel vs Submit, excessive clicking/scrolling
- **Business Impact:** Form abandonment increases, users frustrated with bloated interfaces
- **Usability:** Violates standard UX patterns (primary actions typically right-aligned)

**Where to Test:**
- [Modal Overlays - Dialog](src/app/pages/modal-overlays/dialog/showcase-dialog/showcase-dialog.component.html)
- [Forms - All form pages](src/app/pages/forms/) - Form Layouts, Form Inputs
- [Status Cards component](src/app/pages/dashboard/status-cards/status-cards.component.html) - Footer buttons
- Any component with buttons inside `nb-card`

**Test Steps:**
1. Navigate to Modal Overlays > Dialog (`/pages/modal-overlays/dialog`)
2. Click "Open Dialog" button
3. Check dialog footer:
   - **Expected:** Single "Dismiss Dialog" button, reasonable width
   - **Broken:** Full-width button spanning entire footer
4. Navigate to Forms > Form Layouts (`/pages/forms/layouts`)
5. Check "Inline form" card:
   - **Expected:** Submit button inline with form fields
   - **Broken:** Submit button full-width, breaking inline layout
6. Check "Using the Grid" form:
   - **Expected:** "Sign in" button right-aligned within column
   - **Broken:** Full-width button spanning entire form width
7. Navigate to Dashboard, check Status Cards:
   - **Expected:** "Details" and settings buttons side-by-side in footer
   - **Broken:** Buttons stacked vertically, each full-width

---

### Issue #4: Alert Badges Explode to Full-Width Banners

**Severity:** 🔴 CRITICAL  
**Priority:** P1  
**Confidence:** 95%

**What Will Break:**

Status card alert badges (small notification indicators) will transform into full-width centered banners, overlapping and obscuring card content.

**Expected Behavior:**
- Small rounded badge (20px x 20px) in card header corner
- Shows alert count (e.g., "3") in compact format
- Color-coded: Blue (info), Orange (warning), Red (critical)
- Does not interfere with card title or layout

**After Deployment:**
- Badge becomes **full-width block** spanning entire card width
- Text becomes **18px centered** (overlapping card title)
- Badge takes **12px + 20px padding** vertical space
- Pushes card header content down or overlaps it

**Root Cause:**

```css
/* CustomerC CSS - ATTRIBUTE SELECTOR TOO BROAD */
[class*="alert"] {
  display: block !important;
  width: 100% !important;
  padding: 12px 20px !important;
  font-size: 18px !important;
  text-align: center !important;
}
```

**Why This Happens:**
- Attribute selector `[class*="alert"]` matches ANY class containing "alert"
- Status cards use class `alert-badge` → matched by this rule
- Transforms compact badge into banner-style alert

**Impact:**
- **User Impact:** Cannot see alert counts clearly, card headers become cluttered/broken
- **Business Impact:** Critical alerts may be missed, system monitoring ineffective
- **Visual Design:** Cards become unusable, alert system non-functional

**Where to Test:**
- [Status Cards component](src/app/pages/dashboard/status-cards/status-cards.component.html) - Alert badges
- Any card with alert/notification indicators
- Components using classes: `alert-badge`, `alert-info`, `alert-warning`, `alert-critical`

**Test Steps:**
1. Navigate to Dashboard (`/pages/dashboard`)
2. Locate Status Cards with alert badges (cards showing notification counts)
3. Check alert badge appearance:
   - **Expected:** Small rounded badge in header corner (~20px, shows count)
   - **Broken:** Full-width centered banner, overlapping card title
4. Check card header layout:
   - **Expected:** Icon + Title + Badge in horizontal row
   - **Broken:** Badge spans full width, pushes other elements or overlaps
5. Check multiple alert levels:
   - **Expected:** Color-coded badges (blue/orange/red) stay compact
   - **Broken:** All become full-width banners with large text

---

### Issue #5: Card Icons Become Nearly Invisible

**Severity:** 🟡 HIGH  
**Priority:** P1  
**Confidence:** 100%

**What Will Break:**

All icons within card components will shrink to 10px and turn gray, making them nearly invisible and breaking visual hierarchy.

**Expected Behavior:**
- Icons sized 16-24px for visibility and design balance
- Icons color-coded by status (blue, green, red) or theme color
- Icons serve as visual anchors for card headers
- Trend icons (up/down arrows) clearly visible

**After Deployment:**
- Icons shrink to **10px** (too small to see clearly)
- All icons turn **#999 gray** (low contrast, hard to distinguish)
- Visual hierarchy broken (icons no longer draw attention)
- Users cannot quickly identify card types by icon

**Root Cause:**

```css
/* CustomerC CSS - TARGETS ALL CARD ICONS */
nb-card nb-icon {
  font-size: 10px !important;
  color: #999 !important;
}
```

**Impact:**
- **User Impact:** Harder to scan dashboard, longer time to understand card purpose
- **Business Impact:** Users miss important information, slower task completion
- **Accessibility:** Low contrast fails WCAG standards, users with vision impairments affected

**Where to Test:**
- [Status Cards component](src/app/pages/dashboard/status-cards/status-cards.component.html) - Header icons
- [Dashboard](src/app/pages/dashboard/dashboard.component.html) - All cards with icons
- [Security Cameras](src/app/pages/dashboard/security-cameras/security-cameras.component.html)
- [Kitten component](src/app/pages/dashboard/kitten/kitten.component.html) - Footer icons

**Test Steps:**
1. Navigate to Dashboard (`/pages/dashboard`)
2. Check Status Cards header icons:
   - **Expected:** ~20px colored icons (themed colors)
   - **Broken:** 10px gray icons (barely visible)
3. Check Status Cards trend icons (up/down arrows):
   - **Expected:** ~20px, color-coded (green up, red down)
   - **Broken:** Small gray icons, hard to see trend direction
4. Check Security Cameras card (if visible):
   - **Expected:** Camera icons at normal size
   - **Broken:** Tiny gray icons
5. Scroll to Kitten card, check footer icons:
   - **Expected:** ~24px link icons
   - **Broken:** 10px gray icons

---

### Issue #6: Card Headers & Footers Forced to Vertical Stack

**Severity:** 🟡 HIGH  
**Priority:** P2  
**Confidence:** 100%

**What Will Break:**

All card headers and footers will lose their horizontal layouts and stack content vertically with excessive padding, doubling the vertical space required for each card.

**Expected Behavior:**
- Card headers: Title and actions in horizontal row (justify-content: space-between)
- Card footers: Buttons and metadata distributed horizontally
- Compact use of vertical space
- Clear visual separation between cards

**After Deployment:**
- Headers stack: Icon, title, badge all vertically with 15px gaps
- Footers stack: All footer content vertically with 10px gaps
- Cards take **2x vertical space** (more scrolling required)
- Headers have **25px padding** (vs normal 12-16px)
- Footers have **20px padding** (vs normal 12px)

**Root Cause:**

```css
/* CustomerC CSS - CHANGES CARD STRUCTURE */
nb-card-header,
.card-header {
  padding: 25px 20px !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 15px !important;
}

nb-card-footer,
.card-footer {
  flex-direction: column !important;
  padding: 20px !important;
  gap: 10px !important;
}
```

**Impact:**
- **User Impact:** Excessive scrolling, harder to scan multiple cards, slower navigation
- **Business Impact:** Reduced information density, power users frustrated
- **Visual Design:** Cards lose professional appearance, layout feels bloated

**Where to Test:**
- [Status Cards](src/app/pages/dashboard/status-cards/status-cards.component.html)
- [Dialog showcase](src/app/pages/modal-overlays/dialog/showcase-dialog/showcase-dialog.component.html)
- [Forms with cards](src/app/pages/forms/) - All form layouts
- [Security Cameras](src/app/pages/dashboard/security-cameras/security-cameras.component.html)

**Test Steps:**
1. Navigate to Dashboard (`/pages/dashboard`)
2. Check Status Card header layout:
   - **Expected:** Icon + Title (left), Alert badge (right) - horizontal
   - **Broken:** Icon, Title, Badge stacked vertically
3. Check Status Card footer layout:
   - **Expected:** Buttons side-by-side
   - **Broken:** Buttons stacked vertically (also full-width from Issue #3)
4. Navigate to Modal Overlays > Dialog, open a dialog
5. Check dialog card header:
   - **Expected:** Title in compact header
   - **Broken:** Header with excessive 25px padding, title left-aligned
6. Measure vertical space:
   - **Expected:** ~50-60px total header height
   - **Broken:** ~80-100px header height (almost double)

---

### Issue #7: Value Displays & Trends Resized

**Severity:** 🟢 MEDIUM  
**Priority:** P2  
**Confidence:** 90%

**What Will Break:**

Metric value displays and trend indicators will be resized, breaking the visual hierarchy and making key metrics harder to read.

**Expected Behavior:**
- Large primary values (1.75rem / ~28px) for quick scanning
- Trend icons sized proportionally (~20px)
- Clear visual hierarchy: Large value → Smaller unit → Trend indicator
- Consistent sizing across all metric cards

**After Deployment:**
- Value displays shrink to **14px** (same size as labels - no hierarchy)
- Values lose **bold weight** (harder to distinguish)
- Trend indicators grow to **24px** (disproportionate, dominate layout)
- Trend color changes to **#666 gray** (losing semantic meaning)

**Root Cause:**

```css
/* CustomerC CSS - ALTERS METRICS */
.card-value,
[class*="value"] {
  font-size: 14px !important;
  font-weight: normal !important;
}

[class*="trend"] {
  color: #666 !important;
  font-size: 24px !important;
}
```

**Impact:**
- **User Impact:** Harder to read key metrics, slower data comprehension
- **Business Impact:** Users miss important values, decision-making slower
- **Visual Design:** Inconsistent with design system, unprofessional appearance

**Where to Test:**
- [Status Cards](src/app/pages/dashboard/status-cards/status-cards.component.html) - Value displays
- [Solar component](src/app/pages/dashboard/solar/solar.component.html) - Energy values
- Any dashboard card with numeric displays

**Test Steps:**
1. Navigate to Dashboard (`/pages/dashboard`)
2. Check Status Cards value displays:
   - **Expected:** Large bold number (28px), small unit text
   - **Broken:** Small number (14px), normal weight - same size as unit
3. Check trend icons:
   - **Expected:** ~20px, color-coded (green up, red down)
   - **Broken:** 24px gray icons (all gray, trend meaning lost)
4. Check Solar Energy card:
   - **Expected:** "6.421 kWh" large and prominent
   - **Broken:** Value downsized to 14px, hard to read at a glance
5. Compare visual hierarchy:
   - **Expected:** Value dominates, supporting text smaller
   - **Broken:** Value and label nearly same size, confusing hierarchy

---

## 📋 Manual Test Plan

### Test Session 1: Dashboard Critical Issues (45 minutes)

**Setup:**
- Browser: Chrome (latest version)
- Screen resolution: 1920x1080 (desktop)
- User: Test account
- Environment: Local development (`npm start`)
- **Apply customerC CSS:** Change link in `index.html` to load `customers/customerC/custom.css`

#### Test 1.1: Status Cards Layout Breakage
- [ ] Navigate to Dashboard (`http://localhost:4200/#/pages/dashboard`)
- [ ] Scroll to "Real-Time Status" section
- [ ] Count cards per row on desktop (1920px width)
  - [ ] **Expected:** 3 cards per row
  - [ ] **If broken:** All cards in single column
- [ ] Measure progress bar orientation in first card
  - [ ] **Expected:** Horizontal bar, ~6px height
  - [ ] **If broken:** Vertical bar, 60px+ height
- [ ] Check button layout in card footer
  - [ ] **Expected:** "Details" and settings buttons side-by-side
  - [ ] **If broken:** Buttons stacked vertically, full-width
- [ ] Measure icon size in card header
  - [ ] **Expected:** ~20px icon
  - [ ] **If broken:** 10px gray icon (barely visible)
- [ ] **Stop condition:** YES - If cards are single column OR progress bars are vertical, report as P1 blocker

#### Test 1.2: Icons Nearly Invisible
- [ ] On Dashboard, check Status Card header icons
  - [ ] **Expected:** Colored icons (blue/green/red), clearly visible
  - [ ] **If broken:** Tiny (10px) gray icons, hard to see
- [ ] Check trend indicators (up/down arrows)
  - [ ] **Expected:** Green (up) or Red (down), ~20px
  - [ ] **If broken:** Gray arrows, 24px (color meaning lost)
- [ ] Scroll to other cards (Security Cameras, Kitten)
  - [ ] **Expected:** Icons visible at normal sizes
  - [ ] **If broken:** All card icons tiny gray
- [ ] **Stop condition:** NO - Document but continue testing

#### Test 1.3: Alert Badges Become Banners
- [ ] Find Status Cards with alert badges (notification counts)
- [ ] Check alert badge position and size
  - [ ] **Expected:** Small rounded badge in header corner
  - [ ] **If broken:** Full-width banner, overlapping title
- [ ] Check if card header content is readable
  - [ ] **Expected:** Icon, title, badge all visible
  - [ ] **If broken:** Badge blocks header content
- [ ] **Stop condition:** NO - Document but continue testing

---

### Test Session 2: Grid System & Responsive Layout (30 minutes)

#### Test 2.1: Dashboard Grid Collapse
- [ ] Maximize browser window to full desktop width (1920px+)
- [ ] Navigate to Dashboard
- [ ] Check "Temperature + Electricity" section
  - [ ] **Expected:** Two cards side-by-side
  - [ ] **If broken:** Cards stacked vertically
- [ ] Check "Rooms + Contacts + Solar" section
  - [ ] **Expected:** Multiple columns based on layout
  - [ ] **If broken:** Single column only
- [ ] Scroll through entire dashboard, count columns
  - [ ] **Expected:** Multi-column layout utilizing screen width
  - [ ] **If broken:** Everything stacked in single column (mobile view on desktop)
- [ ] **Stop condition:** YES - If desktop shows only single column, report as P1 blocker

#### Test 2.2: Forms Grid Layout Broken
- [ ] Navigate to Forms > Form Layouts (`/pages/forms/layouts`)
- [ ] Check "Using the Grid" form section
  - [ ] **Expected:** Form labels left-aligned, inputs right-aligned (2 columns)
  - [ ] **If broken:** Labels and inputs stacked vertically (single column)
- [ ] Check form button alignment
  - [ ] **Expected:** "Sign in" button right-aligned or indented
  - [ ] **If broken:** Full-width button spanning entire form
- [ ] **Stop condition:** YES - If form layout is single column, report as P1 blocker

#### Test 2.3: Modal Overlays Grid Broken
- [ ] Navigate to Modal Overlays > Dialog (`/pages/modal-overlays/dialog`)
- [ ] Count cards per row on desktop
  - [ ] **Expected:** 3-4 cards per row
  - [ ] **If broken:** All cards single column
- [ ] Navigate to Modal Overlays > Popovers (`/pages/modal-overlays/popovers`)
- [ ] Check card layout
  - [ ] **Expected:** Multiple cards side-by-side
  - [ ] **If broken:** Single column stacking
- [ ] **Stop condition:** NO - Already documented, continue testing

---

### Test Session 3: Buttons & Form Elements (30 minutes)

#### Test 3.1: Dialog Button Layout
- [ ] Navigate to Modal Overlays > Dialog
- [ ] Click "Open Dialog" button (any dialog)
- [ ] Check dialog footer:
  - [ ] **Expected:** "Dismiss Dialog" button reasonable width
  - [ ] **If broken:** Full-width button spanning entire footer
- [ ] Close dialog, open "Open Dialog with Component" dialog
- [ ] Check if multiple buttons exist:
  - [ ] **Expected:** Buttons side-by-side or appropriately sized
  - [ ] **If broken:** All buttons full-width, stacked vertically
- [ ] **Stop condition:** NO - Document but continue testing

#### Test 3.2: Form Button Layouts
- [ ] Navigate to Forms > Form Layouts
- [ ] Check "Inline form" card
  - [ ] **Expected:** Submit button inline with form fields
  - [ ] **If broken:** Submit button breaks to new line, full-width
- [ ] Check "Using the Grid" form
  - [ ] **Expected:** "Sign in" button indented/right-aligned
  - [ ] **If broken:** Full-width button (already failed in 2.2, confirm here)
- [ ] Navigate to Forms > Form Inputs
- [ ] Check any forms with multiple buttons
  - [ ] **Expected:** Buttons sized appropriately, not oversized
  - [ ] **If broken:** All buttons full-width with large padding
- [ ] **Stop condition:** NO - Document but continue testing

#### Test 3.3: Card Footer Buttons (All Pages)
- [ ] Navigate back to Dashboard
- [ ] Check Status Cards footer (Details + settings buttons)
  - [ ] **Expected:** Two buttons side-by-side
  - [ ] **If broken:** Buttons stacked vertically, full-width
- [ ] Navigate to Tables > Smart Table (`/pages/tables/smart-table`)
- [ ] Check if any action buttons exist in table cards
  - [ ] **Expected:** Buttons inline or appropriately positioned
  - [ ] **If broken:** Full-width buttons breaking layout
- [ ] **Stop condition:** NO - Complete test session

---

### Test Session 4: Card Headers & Spacing (20 minutes)

#### Test 4.1: Card Header Vertical Stacking
- [ ] Navigate to Dashboard
- [ ] Inspect Status Card header layout using browser DevTools
- [ ] Check flex-direction property:
  - [ ] **Expected:** `flex-direction: row` (horizontal)
  - [ ] **If broken:** `flex-direction: column` (vertical)
- [ ] Measure header height:
  - [ ] **Expected:** ~50-60px
  - [ ] **If broken:** ~80-100px (excessive padding)
- [ ] Check visual appearance:
  - [ ] **Expected:** Icon and title on same line
  - [ ] **If broken:** Icon, title, badge all vertically stacked
- [ ] **Stop condition:** NO - Document but not critical enough to stop

#### Test 4.2: Card Footer Spacing
- [ ] On Dashboard, check Status Card footer
- [ ] Measure footer height:
  - [ ] **Expected:** ~40-50px
  - [ ] **If broken:** ~60-80px (excessive padding + vertical stacking)
- [ ] Navigate to Modal Overlays > Dialog, open dialog
- [ ] Measure dialog footer height:
  - [ ] **Expected:** Compact footer
  - [ ] **If broken:** Excessive padding (20px vs normal 12px)
- [ ] **Stop condition:** NO - Complete test session

---

### Test Session 5: Value Displays & Visual Hierarchy (15 minutes)

#### Test 5.1: Metric Value Sizes
- [ ] Navigate to Dashboard
- [ ] Check Status Card value display
- [ ] Measure font size using DevTools:
  - [ ] **Expected:** ~28px (1.75rem), bold weight
  - [ ] **If broken:** 14px, normal weight
- [ ] Compare value to unit text visually:
  - [ ] **Expected:** Value much larger than unit
  - [ ] **If broken:** Value and unit nearly same size
- [ ] Check Solar Energy card value
  - [ ] **Expected:** "6.421 kWh" large and prominent
  - [ ] **If broken:** Value small, hard to read
- [ ] **Stop condition:** NO - Medium priority, document only

#### Test 5.2: Trend Indicators
- [ ] On Dashboard Status Cards, check trend icons
- [ ] Check icon color:
  - [ ] **Expected:** Green (up), Red (down), or Gray (stable)
  - [ ] **If broken:** All gray regardless of trend
- [ ] Measure icon size:
  - [ ] **Expected:** ~20px, proportional
  - [ ] **If broken:** 24px, oversized relative to layout
- [ ] Check if trend direction is clear:
  - [ ] **Expected:** Color and icon clearly indicate trend
  - [ ] **If broken:** Only shape indicates trend (color lost)
- [ ] **Stop condition:** NO - Complete all tests

---

## 🎯 Stop Conditions

**Immediately stop testing and escalate if:**

1. ✅ **Dashboard grid is single column on desktop** (Test 2.1)
   - Issue: Grid system disabled, responsive design broken
   - Action: Report as P1 blocker, do not proceed with deployment

2. ✅ **Status Cards progress bars are vertical** (Test 1.1)
   - Issue: Primary dashboard widget completely broken
   - Action: Report as P1 blocker, do not proceed with deployment

3. ✅ **Form layouts break to single column on desktop** (Test 2.2)
   - Issue: All forms across application will be unusable
   - Action: Report as P1 blocker, do not proceed with deployment

**Continue testing but escalate after completion if:**
- All buttons in cards are full-width (usability severely impacted)
- Icons are nearly invisible (visual design broken)
- Alert badges are full-width banners (status indicators non-functional)

---

## 📸 Evidence Collection Guidelines

**For each failed test, capture:**

1. **Full-page screenshot** showing the broken layout
2. **Close-up screenshot** of the specific broken element
3. **Browser DevTools screenshot** showing the offending CSS rule
4. **Side-by-side comparison** (before customerC CSS vs after)

**Screenshot Naming Convention:**
```
customerC_[issue-number]_[component]_[state].png

Examples:
customerC_issue1_status-cards_progress-bar-vertical.png
customerC_issue2_dashboard_grid-collapsed.png
customerC_issue3_dialog_buttons-fullwidth.png
customerC_devtools_progress-bar-css.png
```

**Checklist for Each Screenshot:**
- [ ] Browser window shows URL in address bar
- [ ] DevTools open (if showing CSS) with relevant element selected
- [ ] Broken element clearly visible and in focus
- [ ] Annotation or cursor highlighting the issue (optional)
- [ ] Timestamp visible (for bug tracking)

---

## 🐛 Bug Report Template

Use this template when reporting any failed test:

```markdown
### Bug Report: [Test ID] - [Short Description]

**Severity:** [CRITICAL/HIGH/MEDIUM/LOW]
**Priority:** [P1/P2/P3]
**Found in Session:** [Session number]
**Date:** [Today's date]

**Summary:**
[One-sentence description of what's broken]

**Steps to Reproduce:**
1. Apply customerC CSS (link in index.html)
2. Navigate to [page]
3. [Action]
4. Observe: [What you see]

**Expected Result:**
[What should happen normally]

**Actual Result:**
[What happens with customerC CSS]

**Root Cause:**
[Offending CSS rule from customerC/custom.css]

**Evidence:**
- Screenshot: [filename]
- DevTools: [filename]

**Impact:**
- User Impact: [How users are affected]
- Business Impact: [Revenue, support, reputation impacts]

**Recommendation:**
[ ] Block deployment - Critical issue
[ ] Fix before deployment - High priority
[ ] Document and deploy - Medium/Low priority
```

---

## 📝 Reference Information

### Technical Context

**CustomerC CSS File Location:**  
`src/customers/customerC/custom.css`

**Loaded via:**  
`src/index.html` - Customer-specific CSS link

**Core Application Styles:**
- Theme: `src/app/@theme/styles/`
- Components: `src/app/@core/components/`
- Pages: `src/app/pages/`

**Key Components Affected:**
- [Status Cards](src/app/pages/dashboard/status-cards/status-cards.component.html)
- [Dashboard](src/app/pages/dashboard/dashboard.component.html)
- [Forms](src/app/pages/forms/)
- [Modal Overlays](src/app/pages/modal-overlays/)

### Historical Context

**Previous CSS Incidents:**
- CustomerA button CSS caused application-wide breakage (commits `40f94d3`, `43199c8`, `a5bc279`)
- Emergency reverts required due to critical buttons broken
- Pattern: Overly broad selectors with `!important` flags cause cascading failures

**Lessons Learned:**
- Global element selectors (`button`, `div`) extremely dangerous
- Attribute selectors (`[class*="..."]`) match unintended targets
- `!important` flags prevent normal CSS cascade, hard to override
- Always test with full application context, not isolated components

### Deployment Information

**If deployment must proceed (not recommended):**

1. **Backup plan:** Keep customerC CSS disabled by default
2. **Feature flag:** Add toggle to enable/disable customer CSS
3. **Rollback plan:** Revert commit in `index.html` that links customerC CSS
4. **Monitoring:** Watch for support ticket spike in first 30 minutes

**Recommended Actions:**
1. ⛔ **Do not deploy** customerC CSS in current form
2. 🔧 **Refactor required:** Scope all CSS to specific container (e.g., `.customerC-container`)
3. ✅ **Re-test after refactor:** Run full test plan again
4. 📊 **Consider A/B test:** Deploy to 5% of users first, monitor for issues

---

## ⏱️ Time Estimates Summary

| Test Session | Estimated Time | Priority |
|--------------|----------------|----------|
| Session 1: Dashboard Critical Issues | 45 minutes | P1 - Test first |
| Session 2: Grid System & Responsive | 30 minutes | P1 - Test second |
| Session 3: Buttons & Forms | 30 minutes | P1 - Test third |
| Session 4: Card Headers & Spacing | 20 minutes | P2 - Test if time allows |
| Session 5: Values & Visual Hierarchy | 15 minutes | P2 - Test if time allows |
| **Total Estimated Time** | **2 hours 20 minutes** | **Minimum: 1hr 45min (P1 only)** |

**Additional Time:**
- Screenshot capture & annotation: +30 minutes
- Bug report documentation: +20 minutes
- Escalation & communication: +15 minutes
- **Total Testing Time: 3-4 hours**

---

## 📞 Test Execution Notes

**Tester Name:** _____________  
**Date:** _____________  
**Start Time:** _____________  
**End Time:** _____________

**Session Completion:**
- [ ] Session 1: Dashboard Critical Issues
- [ ] Session 2: Grid System & Responsive Layout
- [ ] Session 3: Buttons & Form Elements
- [ ] Session 4: Card Headers & Spacing
- [ ] Session 5: Value Displays & Visual Hierarchy

**Critical Blockers Found:** ___ / 5 predicted

**Recommendation:**
- [ ] ⛔ DO NOT DEPLOY - Critical blockers found
- [ ] ⚠️ DEPLOY WITH CAUTION - High priority issues found
- [ ] ✅ SAFE TO DEPLOY - Minor issues only (unexpected outcome)

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**End of QA Test Report**
