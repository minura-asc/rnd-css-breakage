# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modified version of akveo/ngx-admin for Playwright UI automation practice. Angular 14 admin dashboard using Nebular 10.0.0 UI framework. All data is mocked (no real backend). The project is specifically used to study **CSS breakage** caused by customer-specific CSS overrides.

## Development Commands

```bash
npm start          # Start dev server (ng serve)
```

No test or lint commands are configured in package.json.

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
- Dashboard, forms, modal-overlays, extra-components, charts, tables, custom-components

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

## Customer CSS Overrides

This is the core focus of the project. Customer-specific CSS files live in `src/customers/{customerName}/custom.css`.

### Available customers
- `none/` - Empty baseline (no overrides)
- `customerA/` - CSS overrides for Customer A
- `customerB/` - CSS overrides for Customer B (known to break navbar features)
- `customerC/` - CSS overrides for Customer C (known to break dashboard status cards)

### Switching customers
In `src/index.html`, uncomment exactly ONE customer CSS `<link>` and comment out the rest. Only one customer CSS should be active at a time.

### Common breakage patterns
Overly broad selectors (like `button { ... }`) and `!important` declarations in customer CSS can break core Nebular UI components.

## Project-Specific Directories

- `risk reports/` - QA test reports and CSS conflict analysis per customer deployment
- `scenarios live/` - Testing scenario documentation

## Claude Code Skills

- `/qa-css-analysis` - Generate focused QA test plans (max 300 lines) for customer CSS deployments. Output goes to `risk reports/qa_test_report_[customer].md`
- `/css-bug` - Create CSS bug issues from analysis findings

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
