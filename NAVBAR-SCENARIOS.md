# Navbar CSS Testing Scenarios

## Quick Start
```bash
npm start
```
Then open http://localhost:4200

---

## Test Scenarios

### Scenario 1: Original Navbar (Before New Features)
To see the navbar before notification badge, role indicator, and online status were added:

**Swap to original navbar:**
```powershell
Copy-Item src\app\@theme\components\header\header.component.original.html src\app\@theme\components\header\header.component.html
```

**Swap back to new navbar:**
```powershell
Copy-Item src\app\@theme\components\header\header.component.new.html src\app\@theme\components\header\header.component.html
```

---

### Scenario 2: New Navbar (Core - No Customer CSS)
This is the default state. Verify `src/index.html` has:
```html
<!-- OPTION 1: No customer CSS (core application baseline) -->
<link rel="stylesheet" href="customers/none/custom.css">
```

**What to verify:**
- Red notification badge (circle with "3") on bell icon
- Blue "ADMIN" badge next to username
- Green online status dot on avatar

---

### Scenario 3: New Navbar + CustomerA CSS
Edit `src/index.html`:
```html
<!-- Comment out none -->
<!-- <link rel="stylesheet" href="customers/none/custom.css"> -->

<!-- Uncomment CustomerA -->
<link rel="stylesheet" href="customers/customerA/custom.css">
```

**Expected:** Minor style changes (CustomerA has minimal overrides)

---

### Scenario 4: New Navbar + CustomerB CSS (BROKEN)
Edit `src/index.html`:
```html
<!-- Comment out none -->
<!-- <link rel="stylesheet" href="customers/none/custom.css"> -->

<!-- Uncomment CustomerB -->
<link rel="stylesheet" href="customers/customerB/custom.css">
```

**Expected breakages:**
| Element | Expected | Broken |
|---------|----------|--------|
| Notification badge | Red circle, top-right of bell | Gray block, mispositioned |
| Role badge | Small blue "ADMIN" | Gray block with padding |
| Online status | Small green dot | Mispositioned, wrong size |
| User section | Horizontal layout | Stacked vertically |
| Bell icon | Normal size | Oversized (28px) |

---

## File Locations

| File | Purpose |
|------|---------|
| `src/index.html` | Switch customer CSS here |
| `src/customers/none/custom.css` | Empty - core baseline |
| `src/customers/customerA/custom.css` | CustomerA overrides |
| `src/customers/customerB/custom.css` | CustomerB overrides (causes conflicts) |
| `src/app/@theme/components/header/header.component.html` | Current navbar |
| `src/app/@theme/components/header/header.component.original.html` | Original navbar (backup) |

