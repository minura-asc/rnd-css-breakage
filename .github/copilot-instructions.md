# Copilot Instructions for ngx-admin Angular 14 Project

## Architecture Overview
This is a Nebular-based Angular 14 admin dashboard with a strict three-layer architecture:

- **@core/**: Business logic layer - MUST be imported only once in AppModule using `.forRoot()`
- **@theme/**: UI layer - Layout components, Nebular wrappers, pipes, and 4 theme configurations
- **pages/**: Feature modules - Lazy-loaded routes with dashboard, forms, tables, charts, etc.

## Critical Patterns

### Data Service Pattern (Interface Abstraction)
All data flows through abstract interfaces → concrete mock services:

```typescript
// 1. Define abstract interface in @core/data/
export abstract class SolarData {
  abstract getSolarData(): Observable<number>;
}

// 2. Implement in @core/mock/
@Injectable()
export class SolarService extends SolarData {
  getSolarData(): Observable<number> { return observableOf(42); }
}

// 3. Provide in CoreModule
{ provide: SolarData, useClass: SolarService }

// 4. Inject abstract interface in components
constructor(private solarService: SolarData) {}
```

**Why**: Enables swapping mock services for real APIs without changing component code. See `@core/core.module.ts` DATA_SERVICES array.

### Module Singleton Pattern
CoreModule and ThemeModule use module import guards to prevent multiple imports:

```typescript
// Always in CoreModule/ThemeModule constructor
constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
  throwIfAlreadyLoaded(parentModule, 'CoreModule');
}
```

**Rule**: Import `CoreModule.forRoot()` and `ThemeModule.forRoot()` ONLY in `AppModule`. Never import them elsewhere.

### Lazy Loading Pattern
Feature modules are lazy-loaded via dynamic imports:

```typescript
// In pages-routing.module.ts
{
  path: 'forms',
  loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
}
```

Add new pages: create module → add lazy route → add menu item in `pages-menu.ts`.

### Component Lifecycle with Subscriptions
Use `takeWhile` with component-level `alive` flag for subscription management:

```typescript
private alive = true;

this.service.getData()
  .pipe(takeWhile(() => this.alive))
  .subscribe(data => { /* ... */ });

ngOnDestroy() {
  this.alive = false; // Unsubscribes all
}
```

**Pattern used everywhere** - see `dashboard.component.ts`.

### Theme-Aware Components
Components configure differently per theme using `NbThemeService`:

```typescript
constructor(private themeService: NbThemeService) {
  this.themeService.getJsTheme()
    .pipe(takeWhile(() => this.alive))
    .subscribe(theme => {
      this.config = this.configByTheme[theme.name]; // 'default' | 'cosmic' | 'corporate' | 'dark'
    });
}
```

## Development Commands
```bash
npm start          # Starts dev server (ng serve)
# No test commands configured
```

## File Naming & Organization
- Components: `feature-name.component.ts`
- Services: `service-name.service.ts`
- SCSS only (not CSS): `component.scss`
- Interfaces in `@core/data/`, implementations in `@core/mock/`

## Key Dependencies
- **Nebular 10.0.0**: Primary UI framework (nb-* components)
- **ng2-smart-table**: Advanced table with CRUD operations
- **ECharts + ngx-echarts**: Primary charting library
- **RxJS 6.6.2**: Use `rxjs-compat` for backward compatibility

## Project Context
Modified lightweight version of akveo/ngx-admin for Playwright UI automation practice. All data is mocked (no real backend).
