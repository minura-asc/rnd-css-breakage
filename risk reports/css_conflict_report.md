# CSS Conflict Analysis Report

**Project:** ngx-admin Angular 14 Application  
**Date:** February 11, 2026  
**Analyzed Paths:**
- Theme Styles: `src/app/@theme/`
- Customer CSS: `src/customers/`

---

## Executive Summary

Critical CSS conflicts detected between customer override files and the application's Nebular-based theme system. **CustomerA** poses **HIGH RISK** due to aggressive global selectors with `!important` flags. **CustomerB** has **MEDIUM RISK** with theme-specific button overrides.

---

## 1. Customer CSS Analysis

### CustomerA (`src/customers/customerA/custom.css`)

```css
/* CustomerA overrides */
.btn {
  font-size: 10px !important;
}

button {
  background: red !important;
}
```

**Severity: HIGH** 🔴

**Issues:**
- Global `button` selector with `!important` - affects ALL buttons application-wide
- Generic `.btn` class with `!important` - conflicts with Bootstrap grid system
- No scoping or specificity targeting

### CustomerB (`src/customers/customerB/custom.css`)

```css
/* CustomerB overrides */
.nb-theme-default button {
  border: 2px solid black;
}
```

**Severity: MEDIUM** 🟡

**Issues:**
- Theme-specific selector but still affects all buttons under default theme
- Lacks component-level scoping
- Will add unexpected borders to icon buttons, search buttons, and action buttons

---

## 2. Theme Architecture Overview

The application uses **Nebular UI Framework** with component-scoped SCSS:

### Scoping Pattern
All theme components use `@include nb-install-component()` mixin for style encapsulation:

```scss
@include nb-install-component() {
  nb-select.size-medium button {
    padding: 0.4375rem 2.2rem 0.4375rem 1.125rem !important;
  }
}
```

### Theme Variants
- `default` (light)
- `cosmic` (purple-based)
- `corporate` (professional)
- `dark`

### Existing !important Usage (Theme)
The theme has **3 instances** of `!important`:
1. [_overrides.scss:5](src/app/@theme/styles/_overrides.scss#L5) - `nb-select.size-medium button` padding
2. [_overrides.scss:8](src/app/@theme/styles/_overrides.scss#L8) - `nb-icon` right positioning
3. [header.component.scss:27](src/app/@theme/components/header/header.component.scss#L27) - `nb-search button` padding

---

## 3. Detailed Conflict Analysis

### 3.1 Button Element Conflicts

**Affected Component Scopes:**

| Component Path | Selectors Used | Conflict Risk |
|---------------|----------------|---------------|
| `@theme/styles/_overrides.scss` | `nb-select.size-medium button` | ⚠️ CustomerA will override |
| `@theme/components/header/header.component.scss` | `::ng-deep nb-search button` | ⚠️ CustomerA will override |
| `pages/modal-overlays/window/window.component.scss` | `button`, `button + button` | ⚠️ Both customers will conflict |
| `pages/modal-overlays/dialog/dialog.component.scss` | `button` (within nb-card-body) | ⚠️ Both customers will conflict |
| `pages/modal-overlays/tooltip/tooltip.component.scss` | `button` | ⚠️ Both customers will conflict |
| `pages/tables/tree-grid/tree-grid.component.scss` | `.nb-tree-grid-header-cell button` | ⚠️ Both customers will conflict |
| `pages/dashboard/rooms/player/player.component.scss` | `button`, `.control-button`, `.skip-forward-button` | ⚠️ Both customers will conflict |
| `pages/dashboard/security-cameras/security-cameras.component.scss` | `.single-view-button`, `.grid-view-button` | ⚠️ Both customers will conflict |

**Total Button Selectors Found:** 17+ across pages directory

### 3.2 Class Name Conflicts

**`.btn` Class:**
- Used indirectly through Bootstrap grid mixins imported in [styles.scss](src/app/@theme/styles/styles.scss)
- CustomerA's `!important` override will break any Bootstrap button styling

### 3.3 Element Selector Conflicts

**Global Element Selectors in Theme:**
- `input` - 4 instances (search, datepicker, dialog)
- `a` - 2 instances (footer links)
- `span` - 2 instances (player component)

CustomerA's global `button` selector will cascade to all these contexts.

---

## 4. Impact Assessment by Customer

### 🔴 CustomerA - CRITICAL ISSUES

**Affected Features:**

1. **All Buttons Will Have Red Background**
   - Navigation buttons
   - Form submission buttons
   - Modal action buttons (OK, Cancel, Submit)
   - Icon-only buttons (will show red behind icons)
   - Dropdown toggle buttons
   - Search button
   - Date picker navigation
   - Table action buttons
   - Dashboard controls (temperature, player, security cameras)

2. **Bootstrap Components Broken**
   - Grid system buttons rendered at 10px font size
   - Pagination controls unusable
   - Button groups misaligned

3. **Nebular Component Breakage**
   - `nb-select` dropdowns - red background on toggle button
   - `nb-search` - red background on search icon button
   - `nb-action` buttons - red backgrounds throughout header
   - `nb-card-footer` buttons - red backgrounds in modals
   - Icon buttons lose visual coherence

**Specificity Issues:**
- CustomerA's `!important` flags will **WIN** against theme's 3 `!important` instances due to CSS cascade order (customer CSS loaded last)

**Visual Example:**
```
Expected: [Blue Button]
CustomerA Result: [RED TINY BUTTON] (red background + 10px text)
```

---

### 🟡 CustomerB - MODERATE ISSUES

**Affected Features (when `nb-theme-default` active):**

1. **Unexpected Borders Added**
   - All buttons gain 2px black borders
   - Icon buttons look boxed/framed incorrectly
   - Action buttons in header bordered
   - Modal buttons bordered (may clash with Nebular's button variants)

2. **Theme Inconsistency**
   - Only affects `default` theme
   - Other themes (cosmic, corporate, dark) unaffected
   - Users switching themes will see inconsistent button styles

3. **Specificity Less Aggressive**
   - No `!important` used
   - Can be overridden by more specific selectors
   - But still adds visual pollution to clean theme

**Visual Example:**
```
Expected: [  Blue Button  ]
CustomerB Result: [┌─Blue Button─┐] (black border added)
```

---

## 5. Conflict Summary Table

| Selector | Source | Specificity | !important | Scope | Affected Components |
|----------|--------|-------------|------------|-------|---------------------|
| `button` | CustomerA | 0,0,0,1 | ✅ | Global | **ALL** (100+ buttons) |
| `.btn` | CustomerA | 0,0,1,0 | ✅ | Global | Bootstrap buttons, form controls |
| `.nb-theme-default button` | CustomerB | 0,0,1,1 | ❌ | Theme-scoped | All buttons in default theme |
| `nb-select.size-medium button` | Theme | 0,0,1,2 | ✅ | Component | Select dropdowns |
| `::ng-deep nb-search button` | Theme | 0,0,0,2 | ✅ | Component | Header search |

**Cascade Result:**
```
CustomerA button selector WINS over theme (due to !important + load order)
CustomerB selector LOSES to more specific component selectors
```

---

## 6. Recommended Solutions

### For CustomerA (HIGH PRIORITY)

**Option 1: Increase Specificity & Remove Global Selectors**
```css
/* BEFORE (DANGEROUS) */
button {
  background: red !important;
}

/* AFTER (SAFE) */
.customerA-custom-button {
  background: red;
  font-size: 10px;
}
```

**Option 2: Scope to Specific Components**
```css
/* Target only custom components */
[data-customer="customerA"] button.custom-action,
.customerA-dashboard .submit-button {
  background: red;
  font-size: 10px;
}
```

**Option 3: Use CSS Variables (Recommended)**
```css
/* Override theme variables instead of components */
.nb-theme-default {
  --customer-primary-button-bg: red;
  --customer-button-font-size: 10px;
}

/* Then use in specific components */
.customerA-button {
  background: var(--customer-primary-button-bg);
  font-size: var(--customer-button-font-size);
}
```

### For CustomerB (MEDIUM PRIORITY)

**Option 1: Add Component-Specific Class**
```css
/* BEFORE (BROAD) */
.nb-theme-default button {
  border: 2px solid black;
}

/* AFTER (TARGETED) */
.nb-theme-default .customerB-bordered-button {
  border: 2px solid black;
}
```

**Option 2: Target Specific Button Types**
```css
/* Only affect primary action buttons */
.nb-theme-default button[status="primary"],
.nb-theme-default button.action-button {
  border: 2px solid black;
}
```

### Global Architecture Improvement

**1. Implement Customer CSS Loading Strategy**
```typescript
// In app.component.ts or theme.service.ts
loadCustomerCSS(customerId: string) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `./customers/${customerId}/custom.css`;
  link.setAttribute('data-customer-styles', customerId);
  document.head.appendChild(link);
}
```

**2. Add Data Attributes for Targeting**
```html
<!-- In index.html or root component -->
<body data-customer="customerA" class="customer-a-theme">
```

**3. Use CSS Layers (Modern Browsers)**
```css
/* In customer CSS files */
@layer customer-overrides {
  [data-customer="customerA"] button.custom {
    background: red;
  }
}
```

---

## 7. Testing Checklist

Before deploying fixed customer CSS:

- [ ] Test all 4 themes (default, cosmic, corporate, dark)
- [ ] Verify modal dialogs (open/close buttons)
- [ ] Test form submissions
- [ ] Check header navigation buttons
- [ ] Verify dropdown select components
- [ ] Test date picker controls
- [ ] Check dashboard interactive elements
- [ ] Verify table action buttons
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## 8. Cross-Reference Index

### Files Requiring Attention

**Customer Files:**
- [src/customers/customerA/custom.css](src/customers/customerA/custom.css) - 🔴 HIGH PRIORITY
- [src/customers/customerB/custom.css](src/customers/customerB/custom.css) - 🟡 MEDIUM PRIORITY

**Theme Files Affected:**
- [src/app/@theme/styles/_overrides.scss](src/app/@theme/styles/_overrides.scss) - Contains theme !important rules
- [src/app/@theme/components/header/header.component.scss](src/app/@theme/components/header/header.component.scss) - Header button styles
- [src/app/@theme/styles/themes.scss](src/app/@theme/styles/themes.scss) - Theme configuration

**High-Risk Page Components:**
- [src/app/pages/modal-overlays/window/window.component.scss](src/app/pages/modal-overlays/window/window.component.scss)
- [src/app/pages/modal-overlays/dialog/dialog.component.scss](src/app/pages/modal-overlays/dialog/dialog.component.scss)
- [src/app/pages/dashboard/rooms/player/player.component.scss](src/app/pages/dashboard/rooms/player/player.component.scss)
- [src/app/pages/tables/tree-grid/tree-grid.component.scss](src/app/pages/tables/tree-grid/tree-grid.component.scss)

---

## Conclusion

**Immediate Action Required:**
1. **CustomerA CSS must be refactored** before production deployment - current implementation will break the entire application UI
2. **CustomerB CSS should be scoped** to prevent unintended theme inconsistencies
3. Implement a customer CSS architecture with proper namespacing and scoping strategies

**Risk Level:**
- CustomerA: 🔴 **CRITICAL** - Application unusable with current CSS
- CustomerB: 🟡 **MODERATE** - Visual inconsistencies, theme-dependent issues

**Estimated Fix Time:**
- CustomerA: 4-6 hours (full refactor required)
- CustomerB: 1-2 hours (scoping adjustments)
- Testing: 2-3 hours (comprehensive cross-browser and theme testing)

---

*Report generated by CSS Conflict Analyzer*  
*Framework: Nebular 10.0.0 + Angular 14*
