# Edit and Delete Features Implementation

This document describes the new edit and delete functionality added to the divisions table.

## Features Implemented

### 1. Edit Button
- **Location**: Actions column in each row of the divisions table
- **Icon**: Edit icon (pencil)
- **Behavior**: 
  - Opens the division form modal in edit mode
  - Pre-populates the form with the selected division's data
  - Updates the division when the form is submitted
  - Refreshes the table after successful update

### 2. Delete Button
- **Location**: Actions column in each row of the divisions table
- **Icon**: Delete icon (trash)
- **Color**: Red (danger state)
- **Behavior**:
  - Opens a confirmation modal before deletion
  - Shows the division name in the confirmation message
  - Deletes the division when confirmed
  - Refreshes the table after successful deletion

### 3. Subdivisions Modal
- **Trigger**: Clicking on the subdivisions count in the table
- **Behavior**:
  - If count > 0: Shows clickable blue underlined number
  - If count = 0: Shows disabled gray number (not clickable)
  - Opens a modal displaying all subdivisions in a table format
  - Shows: Division name, Level, Collaborators, and Ambassador

### 4. Actions Column
- **New Column**: "Acciones" added to the table
- **Width**: Responsive (100px on desktop, 80px on mobile)
- **Contents**: Edit and Delete buttons side by side
- **Styling**: 
  - Edit button: Blue color with hover effect
  - Delete button: Red/danger color with hover effect
  - Both buttons have appropriate touch targets for mobile

## Components Modified

### 1. `divisions-table.component.ts`
- Added new `@Output` events:
  - `editDivision`: Emitted when edit button is clicked
  - `deleteDivision`: Emitted when delete button is clicked
  - `viewSubdivisions`: Emitted when subdivisions count is clicked
- Added handler methods:
  - `onEditDivision()`: Handles edit button click
  - `onDeleteDivision()`: Handles delete button click
  - `onViewSubdivisions()`: Handles subdivisions count click

### 2. `divisions-table.component.html`
- Added Actions column header
- Added Actions cell in each row with edit and delete buttons
- Made subdivisions count clickable with conditional styling
- Added click handlers and proper event propagation

### 3. `divisions-table.component.scss`
- Added styles for `.actions-col` and `.actions-cell`
- Added styles for clickable and disabled subdivisions count
- Responsive styles for mobile devices
- Hover effects for action buttons

### 4. `division-form-modal.component.ts`
- Added `@Input() editMode`: Flag to determine create vs edit mode
- Added `@Input() divisionToEdit`: Division data for editing
- Updated `ngOnChanges()` to populate form when editing
- Updated modal title based on mode
- Updated submit button text based on mode

### 5. `division-form-modal.component.html`
- Dynamic title: "Crear nueva división" vs "Editar división"
- Dynamic button text: "Crear división" vs "Guardar cambios"

### 6. `divisions.component.ts`
- Imported `NzModalService` for confirmation dialogs
- Added state variables:
  - `isEditMode`: Tracks if modal is in edit mode
  - `divisionToEdit`: Stores division being edited
  - `isSubdivisionsModalVisible`: Controls subdivisions modal
  - `selectedDivisionForSubdivisions`: Division whose subdivisions to show
- Added `SubdivisionsModalComponent` to imports
- Implemented handlers:
  - `onEditDivision()`: Opens modal in edit mode
  - `onDeleteDivision()`: Shows confirmation and deletes
  - `onViewSubdivisions()`: Opens subdivisions modal
  - `onSubmitDivisionForm()`: Handles both create and update

### 7. New Component: `subdivisions-modal.component.ts`
- Standalone component to display subdivisions
- Fetches subdivisions from the backend using `divisionService.getSubdivisions()`
- Displays subdivisions in a table format
- Shows empty state when no subdivisions exist

## API Integration

The implementation uses the existing backend APIs:

### Edit (Update)
```typescript
PUT /api/divisions/{id}
Body: UpdateDivisionDto {
  name?: string;
  parentId?: number;
  collaborators?: number;
  level?: number;
  ambassadorName?: string;
}
```

### Delete
```typescript
DELETE /api/divisions/{id}
Returns: void (204 No Content on success)
```

### Get Subdivisions
```typescript
GET /api/divisions/{id}/subdivisions
Returns: DivisionResponseDto[]
```

## User Experience Flow

### Edit Flow
1. User clicks edit icon (pencil) in Actions column
2. Modal opens with form pre-populated with division data
3. User modifies fields
4. User clicks "Guardar cambios"
5. API call updates the division
6. Modal closes and table refreshes with updated data

### Delete Flow
1. User clicks delete icon (trash) in Actions column
2. Confirmation modal appears with message: "¿Está seguro de eliminar esta división? Se eliminará la división '{name}'. Esta acción no se puede deshacer."
3. User can cancel or confirm
4. If confirmed, API call deletes the division
5. Table refreshes without the deleted division

### View Subdivisions Flow
1. User sees subdivisions count in the table
2. If count > 0: Number is blue and underlined (clickable)
3. User clicks the number
4. Modal opens showing all subdivisions in a table
5. User can view details: name, level, collaborators, ambassador
6. User closes modal

## Responsive Design

All new features are fully responsive:

### Desktop (> 992px)
- Action buttons: Full size with padding
- Actions column: 100px width
- Subdivisions count: Standard clickable link styling

### Tablet (768px - 992px)
- Action buttons: Slightly reduced padding
- Actions column: 80px width
- Touch targets maintained at minimum 32px

### Mobile (< 768px)
- Action buttons: Compact with reduced padding but still tappable
- Actions column: 80px width
- Touch targets increased to 32px for better usability
- Subdivisions count remains easily tappable

## Code Quality

- TypeScript strict mode compliance
- Proper type definitions using existing interfaces
- RxJS best practices (takeUntil for subscription management)
- Angular best practices (standalone components, input/output decorators)
- Accessibility considerations (aria-labels, semantic HTML)
- Responsive design with mobile-first approach
