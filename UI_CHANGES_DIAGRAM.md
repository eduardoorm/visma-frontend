# UI Changes Summary

## Table with Actions Column

```
+----------+------------------+-------------------+---------------+-------+---------------+-------------+-----------+
| Checkbox | División         | División superior | Colaboradores | Nivel | Subdivisiones | Embajadores | Acciones  |
+----------+------------------+-------------------+---------------+-------+---------------+-------------+-----------+
| [ ]      | Marketing        | -                 | 25            | 1     | 3 (clickable) | Juan Pérez  | ✏️  🗑️   |
| [ ]      | Desarrollo       | -                 | 50            | 1     | 2 (clickable) | Ana García  | ✏️  🗑️   |
| [ ]      | Ventas Regional  | Ventas            | 10            | 2     | 0 (disabled)  | -           | ✏️  🗑️   |
+----------+------------------+-------------------+---------------+-------+---------------+-------------+-----------+
```

### Legend:
- ✏️ = Edit button (blue icon)
- 🗑️ = Delete button (red icon)
- Clickable subdivisions count = Blue, underlined
- Disabled subdivisions count = Gray, not clickable

## Modal States

### 1. Edit Division Modal
```
┌─────────────────────────────────────────┐
│  Editar división                    ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Nombre de la división *                │
│  ┌───────────────────────────────────┐  │
│  │ Marketing                         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  División superior (opcional)           │
│  ┌───────────────────────────────────┐  │
│  │ Seleccionar...            ▼      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Nivel *                                │
│  ┌───────────────────────────────────┐  │
│  │ Nivel 1                   ▼      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Número de colaboradores *              │
│  ┌───────────────────────────────────┐  │
│  │ 25                                │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Nombre del embajador (opcional)        │
│  ┌───────────────────────────────────┐  │
│  │ Juan Pérez                        │  │
│  └───────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│              [Cancelar] [Guardar cambios]│
└─────────────────────────────────────────┘
```

### 2. Delete Confirmation Modal
```
┌─────────────────────────────────────────┐
│  ¿Está seguro de eliminar esta          │
│  división?                          ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Se eliminará la división "Marketing".  │
│  Esta acción no se puede deshacer.      │
│                                         │
├─────────────────────────────────────────┤
│                  [Cancelar] [🗑️ Eliminar]│
└─────────────────────────────────────────┘
```

### 3. Subdivisions Modal
```
┌─────────────────────────────────────────────────────────────┐
│  Subdivisiones de Marketing                             ✕   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────┬───────┬───────────────┬─────────────────┐   │
│  │ División  │ Nivel │ Colaboradores │ Embajador       │   │
│  ├───────────┼───────┼───────────────┼─────────────────┤   │
│  │ Digital   │ 2     │ 10            │ Pedro López     │   │
│  │ Contenido │ 2     │ 8             │ María Santos    │   │
│  │ Social    │ 2     │ 7             │ Carlos Ruiz     │   │
│  └───────────┴───────┴───────────────┴─────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Interactive Behavior

### Edit Button Click Flow
```
1. User hovers over edit button
   → Button background changes to light blue
   
2. User clicks edit button
   → Modal opens in edit mode
   → Form fields populated with division data
   
3. User modifies fields and clicks "Guardar cambios"
   → API PUT request to /api/divisions/{id}
   → Success: Modal closes, table refreshes
   → Error: Error message shown, modal stays open
```

### Delete Button Click Flow
```
1. User hovers over delete button
   → Button background changes to light red
   
2. User clicks delete button
   → Confirmation modal appears
   → Shows division name in message
   
3. User clicks "Eliminar"
   → API DELETE request to /api/divisions/{id}
   → Success: Modal closes, table refreshes
   → Error: Error message shown
   
4. Or user clicks "Cancelar"
   → Modal closes, no action taken
```

### Subdivisions Count Click Flow
```
1. Subdivisions count > 0
   → Number displayed in blue with underline
   → Cursor changes to pointer on hover
   
2. User clicks the count
   → Subdivisions modal opens
   → API GET request to /api/divisions/{id}/subdivisions
   → Table populated with subdivisions data
   
3. Subdivisions count = 0
   → Number displayed in gray
   → No underline, cursor remains default
   → Click does nothing (disabled)
```

## Responsive Behavior

### Desktop (> 992px)
- All buttons fully visible with icons and adequate spacing
- Actions column: 100px width
- Hover effects work smoothly
- Modals appear centered on screen

### Tablet (768px - 992px)
- Buttons slightly smaller but still easily clickable
- Actions column: 80px width
- Touch targets: 32px minimum
- Modals responsive width

### Mobile (< 768px)
- Buttons optimized for touch
- Actions column: 80px width
- Touch targets: 32px minimum (larger than buttons for easier tapping)
- Modals take more screen space
- Subdivisions modal table scrollable horizontally if needed
```
