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

#### A0: Original Navbar (Core - No Customer CSS)
See the original navbar **before** new features, without any customer CSS.

```powershell
Copy-Item src\app\@theme\components\header\header.component.original.html src\app\@theme\components\header\header.component.html
```

Edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/none/custom.css">
```
---

#### A1: CustomerB's Working Navbar (Before Deployment)
See how CustomerB's navbar looks **before** the new features are deployed.

```powershell
Copy-Item src\app\@theme\components\header\header.component.original.html src\app\@theme\components\header\header.component.html
```

Edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/customerB/custom.css">
```

---

#### A2: Deploy New Navbar Features to CustomerB (BREAKS)
Deploy the new navbar features to CustomerB.

```powershell
Copy-Item src\app\@theme\components\header\header.component.new.html src\app\@theme\components\header\header.component.html
```
---

#### A3: New Navbar (Core - No Customer CSS)
See the new navbar features working correctly without any customer CSS.

```powershell
Copy-Item src\app\@theme\components\header\header.component.new.html src\app\@theme\components\header\header.component.html
```

Edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/none/custom.css">
```

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

#### B0: Original Dashboard (Core - No Customer CSS)
See the original dashboard **before** new features, without any customer CSS.

```powershell
Copy-Item src\app\pages\dashboard\dashboard.component.original.html src\app\pages\dashboard\dashboard.component.html
```

Edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/none/custom.css">
```

---

#### B1: CustomerC's Working Dashboard (Before Deployment)
See how CustomerC's (LogiTrack Shipping) dashboard looks **before** the new features are deployed.

```powershell
Copy-Item src\app\pages\dashboard\dashboard.component.original.html src\app\pages\dashboard\dashboard.component.html
```

Edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/customerC/custom.css">
```

---

#### B2: Deploy New Status Cards to CustomerC (BREAKS)
Deploy the new status cards feature to CustomerC.

```powershell
Copy-Item src\app\pages\dashboard\dashboard.component.new.html src\app\pages\dashboard\dashboard.component.html
```
---

#### B3: New Dashboard (Core - No Customer CSS)
See the new status cards working correctly without any customer CSS.

```powershell
Copy-Item src\app\pages\dashboard\dashboard.component.new.html src\app\pages\dashboard\dashboard.component.html
```

Edit `src/index.html`:
```html
<link rel="stylesheet" href="customers/none/custom.css">
```

## File Locations

### Customer CSS:
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
