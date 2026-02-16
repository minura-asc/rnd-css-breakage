# CSS Breakage Testing Scenarios

## Quick Start
```bash
npm start
```
Then open http://localhost:4200

---

## Scenario A: Navbar Features (CustomerB)

### Requirement:
"Add notification system with badge count, user role indicator, and online status to navbar"

### New Features:
- Red notification badge ("3") on bell icon
- Blue "ADMIN" role badge next to username
- Green online status dot on avatar

### Test Scenarios:

#### A1: Original Navbar (Before New Features)
```powershell
Copy-Item src\app\@theme\components\header\header.component.original.html src\app\@theme\components\header\header.component.html
```

#### A2: New Navbar (Core - No Customer CSS)
```powershell
Copy-Item src\app\@theme\components\header\header.component.new.html src\app\@theme\components\header\header.component.html
```
Edit `src/index.html` → use `customers/none/custom.css`

#### A3: New Navbar + CustomerB (BROKEN)
Use new navbar HTML, then edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/customerB/custom.css">
```

**Expected breakages:**
| Element | Expected | Broken |
|---------|----------|--------|
| Notification badge | Red circle, top-right | Gray block, mispositioned |
| Role badge | Small blue "ADMIN" | Gray box with padding |
| Online status | Small green dot | Wrong size, loses position |
| User section | Horizontal layout | Stacks vertically |
| Bell icon | Normal size | Oversized (28px) |

**Root Cause:** CustomerB's navbar customizations from 6 months ago use selectors like `nb-action span`, `[class*="wrapper"]` that match new elements.

---

## Scenario B: Dashboard Status Cards (CustomerC)

### Requirement:
"Add real-time status cards with progress indicators, alert badges, and quick action buttons to dashboard"

### New Features:
- 6 status cards in 3-column grid
- Progress bars with percentage
- Alert badges (info/warning/critical)
- Trend indicators (up/down/stable)
- Action buttons in card footer

### Test Scenarios:

#### B1: Original Dashboard (Before New Features)
```powershell
Copy-Item src\app\pages\dashboard\dashboard.component.original.html src\app\pages\dashboard\dashboard.component.html
```

#### B2: New Dashboard (Core - No Customer CSS)
```powershell
Copy-Item src\app\pages\dashboard\dashboard.component.new.html src\app\pages\dashboard\dashboard.component.html
```
Edit `src/index.html` → use `customers/none/custom.css`

#### B3: New Dashboard + CustomerC (BROKEN)
Use new dashboard HTML, then edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/customerC/custom.css">
```

**Expected breakages:**
| Element | Expected | Broken |
|---------|----------|--------|
| Progress bars | 6px horizontal bar | 60px+ tall, overflows card |
| Alert badges | Small colored pills | Full-width banners, huge text |
| Action buttons | Inline, compact | Block, full-width, stacked |
| Card headers | Compact, horizontal | 50px padding, vertical stack |
| Cards grid | 3 columns | Single column |
| Card icons | 20px, colored | 10px, gray |
| Progress text | Visible percentage | Hidden off-screen |
| Card values | Large, bold | Small, normal weight |

**Root Cause:** CustomerC (LogiTrack Shipping) built their shipment tracking dashboard 8 months ago with styles for timeline progress bars, delivery alerts, and mobile-first layouts that now affect the new status cards.

---

## File Locations

| File | Purpose |
|------|---------|
| `src/index.html` | Switch customer CSS (options 1-4) |
| `src/customers/none/custom.css` | Empty - core baseline |
| `src/customers/customerA/custom.css` | CustomerA overrides |
| `src/customers/customerB/custom.css` | Breaks navbar features |
| `src/customers/customerC/custom.css` | Breaks dashboard status cards |

### Navbar Files:
| File | Purpose |
|------|---------|
| `header.component.html` | Current active |
| `header.component.original.html` | Before new features |
| `header.component.new.html` | With new features |

### Dashboard Files:
| File | Purpose |
|------|---------|
| `dashboard.component.html` | Current active |
| `dashboard.component.original.html` | Before status cards |
| `dashboard.component.new.html` | With status cards |
