# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modified version of akveo/ngx-admin for Playwright UI automation practice. Angular 14 admin dashboard using Nebular 10.0.0 UI framework. All data is mocked (no real backend).

## Development Commands

```bash
npm start          # Start dev server (ng serve)
```

No test commands are configured in package.json.

## Architecture

Three-layer architecture with strict module isolation:

### @core/ (Business Logic)
- **Import ONCE** in AppModule via `CoreModule.forRoot()` - never import elsewhere
- Abstract interfaces in `@core/data/` (e.g., `SolarData`)
- Mock implementations in `@core/mock/` (e.g., `SolarService extends SolarData`)
- Services wired via `DATA_SERVICES` array in `core.module.ts`

### @theme/ (UI Layer)
- **Import ONCE** in AppModule via `ThemeModule.forRoot()` - never import elsewhere
- Layout components, Nebular wrappers, pipes
- 4 themes: default, cosmic, corporate, dark (defined in `@theme/styles/themes.scss`)

### pages/ (Feature Modules)
- Lazy-loaded routes defined in `pages-routing.module.ts`
- Dashboard, forms, modal-overlays, extra-components, charts, tables

## Key Patterns

### Data Service Abstraction
```typescript
// Components inject abstract interface, not concrete service
constructor(private solarService: SolarData) {}
```
Enables swapping mock services for real APIs without changing components.

### Subscription Management
Use `takeWhile` with `alive` flag pattern everywhere:
```typescript
private alive = true;
this.service.getData()
  .pipe(takeWhile(() => this.alive))
  .subscribe(data => { ... });
ngOnDestroy() { this.alive = false; }
```

### Theme-Aware Components
Use `NbThemeService.getJsTheme()` to configure components per-theme.

### Module Import Guards
CoreModule and ThemeModule use `throwIfAlreadyLoaded()` in their constructors to enforce single-import. Never import these modules in feature modules.

### Adding New Pages
Create module → add lazy route in `pages-routing.module.ts` → add menu item in `pages-menu.ts`.

## Customer CSS Overrides

Customer-specific CSS files live in `src/customers/{customerName}/custom.css`. To switch customers, toggle which `<link>` is uncommented in `src/index.html`:
- `customers/none/custom.css` — baseline (no overrides)
- `customers/customerA/custom.css`
- `customers/customerB/custom.css` — known to break navbar features
- `customers/customerC/custom.css` — known to break dashboard status cards

Be cautious: overly broad selectors (like `button { ... }`) can break core UI components.

## Schematics Defaults

New components use `ngx` prefix and SCSS (configured in angular.json):
```bash
ng generate component my-component  # Creates ngx-my-component with .scss
```

## Key Dependencies

- **Nebular 10.0.0**: Primary UI framework (`nb-*` components)
- **ng2-smart-table**: CRUD table operations
- **ECharts + ngx-echarts**: Primary charting library
- **RxJS 6.6.2**: Uses `rxjs-compat` for backward compatibility
