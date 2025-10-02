# Component Refactoring Documentation

## Overview

This document describes the refactoring improvements made to the shared and feature components to enhance reusability, maintainability, and scalability.

## What Was Changed

### 1. Shared Configuration Interfaces

Created `src/app/shared/models/component-config.interface.ts` with reusable interfaces:

- **NavLink**: Configuration for navigation links
- **UserInfo**: User information for display
- **ActionIcon**: Action icon buttons with badges
- **TabConfig**: Tab configuration for navigation
- **ActionButton**: Generic action button configuration
- **TableFooterConfig**: Footer configuration
- **EntityHeaderConfig**: Entity header configuration
- **TableControlsConfig**: Table controls configuration

### 2. Refactored Shared Components

#### TableControlsComponent
- **Before**: Hardcoded tabs ("Divisiones", "Colaboradores") and view mode labels
- **After**: Accepts `@Input() tabs` and `@Input() viewModeLabels`
- **Usage**:
```typescript
<app-table-controls
  [viewMode]="viewMode"
  [tabs]="tabs"
  [viewModeLabels]="viewModeLabels"
  (viewModeChange)="onViewModeChange($event)">
</app-table-controls>
```

#### TableFooterComponent
- **Before**: Hardcoded "Total colaboradores:", "/ página", and page size options
- **After**: Accepts `@Input() totalLabel`, `@Input() pageSizeLabel`, `@Input() pageSizeOptions`
- **Usage**:
```typescript
<app-table-footer
  [total]="total"
  [pageSize]="pageSize"
  [pageIndex]="pageIndex"
  [totalLabel]="'Total items:'"
  [pageSizeLabel]="'per page'"
  [pageSizeOptions]="[10, 20, 50, 100]"
  (pageSizeChange)="onPageSizeChange($event)"
  (pageIndexChange)="onPageChange($event)">
</app-table-footer>
```

#### DivisionsHeaderComponent
- **Before**: Hardcoded breadcrumb, search placeholder, button labels
- **After**: Accepts all text as `@Input()` properties
- **Usage**:
```typescript
<app-divisions-header
  [searchValue]="searchValue"
  [tableColumns]="tableColumns"
  [selectedColumns]="selectedColumns"
  [breadcrumbText]="'Organization'"
  [searchPlaceholder]="'Search by name...'"
  [columnDropdownLabel]="'Columns'"
  [importButtonAriaLabel]="'Import data'"
  [exportButtonAriaLabel]="'Export data'"
  [createButtonAriaLabel]="'Create new item'"
  (searchChange)="onSearch($event)"
  (columnToggle)="toggleColumn($event)"
  (importClick)="importItems()"
  (exportClick)="exportItems()"
  (createClick)="createItem()">
</app-divisions-header>
```

#### NavbarComponent
- **Before**: Hardcoded navigation links, user info, and action icons
- **After**: Fully configurable via `@Input()` properties
- **Usage**:
```typescript
<app-navbar
  [navLinks]="navLinks"
  [actionIcons]="actionIcons"
  [userInfo]="userInfo">
</app-navbar>
```

Where:
```typescript
navLinks: NavLink[] = [
  { label: 'Dashboard', href: '#', active: true },
  { label: 'Settings', href: '#', hasDropdown: true }
];

actionIcons: ActionIcon[] = [
  { icon: 'bell', ariaLabel: 'Notifications', badge: 3 }
];

userInfo: UserInfo = {
  name: 'John Doe',
  avatarUrl: 'path/to/avatar.png'
};
```

### 3. Refactored Feature Components

#### DivisionsTableComponent
- **Before**: Hardcoded column labels, filter labels, level options
- **After**: Accepts configuration via `@Input()` properties
- **Usage**:
```typescript
<app-divisions-table
  [divisions]="divisions"
  [loading]="loading"
  [selectedColumns]="selectedColumns"
  [columnLabels]="tableColumns"
  [filterLabels]="filterLabels"
  [levelOptions]="levelOptions"
  [defaultParentName]="'General Direction'"
  [emptyValuePlaceholder]="'-'"
  (sortChange)="onSortChange($event)"
  (filterChange)="onFilterChange($event)">
</app-divisions-table>
```

### 4. Accessibility Improvements

All components now include:
- **aria-label** attributes on interactive elements
- **aria-hidden** on decorative icons
- Proper semantic HTML structure
- Keyboard navigation support

### 5. Unit Tests

Created comprehensive unit tests for all refactored components:
- `table-controls.component.spec.ts`
- `table-footer.component.spec.ts`
- `divisions-header.component.spec.ts`
- `navbar.component.spec.ts`
- `divisions-table.component.spec.ts`

Tests cover:
- Component creation
- Input/Output behavior
- Template rendering with custom values
- Event emission

## Benefits

### 1. **Reusability**
Components can now be used across different features and contexts without code duplication.

### 2. **i18n Ready**
All text is now configurable, making it easy to implement internationalization by passing translated strings.

### 3. **Type Safety**
Strong typing with TypeScript interfaces ensures configuration correctness at compile time.

### 4. **Maintainability**
Clear separation of concerns with configuration in parent components and presentation in child components.

### 5. **Accessibility**
Improved accessibility with proper ARIA labels and semantic HTML.

### 6. **Testability**
Well-tested components with unit tests covering core functionality.

## Migration Guide

To use these refactored components in a new feature:

1. **Import the necessary interfaces**:
```typescript
import { NavLink, UserInfo, ActionIcon, TabConfig } from '@shared/models/component-config.interface';
```

2. **Define your configuration**:
```typescript
export class MyFeatureComponent {
  tabs: TabConfig[] = [
    { label: 'Tab 1', value: 'tab1', active: true },
    { label: 'Tab 2', value: 'tab2' }
  ];
  
  viewModeLabels = {
    list: 'List View',
    tree: 'Tree View'
  };
}
```

3. **Pass configuration to components**:
```html
<app-table-controls
  [tabs]="tabs"
  [viewModeLabels]="viewModeLabels">
</app-table-controls>
```

## Best Practices

1. **Centralize Configuration**: Keep all text and configuration in the parent/container component
2. **Use Interfaces**: Always use the provided interfaces for type safety
3. **Provide Defaults**: Components have sensible defaults, but always provide values for production
4. **Accessibility**: Always provide meaningful aria-labels for better accessibility
5. **Test Coverage**: Ensure new components follow the same testing patterns

## Future Enhancements

Potential improvements for future iterations:

1. **Translation Service**: Integrate Angular i18n or a translation service
2. **Theme Configuration**: Add theme/style configuration inputs
3. **Event Analytics**: Add analytics tracking for user interactions
4. **Dynamic Forms**: Create configurable form components
5. **Advanced Filtering**: Enhance table filtering capabilities

## Questions or Issues?

For questions about the refactored components, refer to the unit tests for usage examples or contact the development team.
