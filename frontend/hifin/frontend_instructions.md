# Frontend Instructions - HiFin App

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: File-based routing (SPA mode)
- **React**: 19.x

## Project Structure

```
src/
├── app/                    # App Router (file-based routing)
│   ├── (auth)/            # Auth group (no layout)
│   │   └── login/        # /login
│   │   └── register/    # /register
│   ├── (dashboard)/      # Dashboard group with persistent layout
│   │   ├── layout.tsx   # DashboardLayout (Sidebar + Header)
│   │   ├── page.tsx      # /dashboard (home)
│   │   ├── categorias/   # /dashboard/categorias
│   │   ├── transacciones/ # /dashboard/transacciones
│   │   ├── presupuestos/ # /dashboard/presupuestos
│   │   └── reportes/     # /dashboard/reportes
│   ├── layout.tsx        # Root layout (providers, fonts)
│   └── page.tsx          # Redirect to dashboard or login
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Button, Input, Card...)
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── features/         # Feature-specific components
├── lib/                   # Utilities, hooks, configurations
├── services/             # API calls
├── types/                 # TypeScript types
└── stores/               # State management (Zustand/Context)
```

## Routing Conventions

### Route Groups
- Use `(auth)` for public pages without dashboard layout
- Use `(dashboard)` for authenticated pages with sidebar/header

### Dynamic Routes
- `transacciones/[id]` - Transaction detail
- `presupuestos/[id]` - Budget detail

## Layout Structure

### Root Layout (`app/layout.tsx`)
- Global providers
- Font configuration
- Metadata

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
- Sidebar (fixed left)
- Header (fixed top)
- Main content area (scrollable)

### Component Patterns

```tsx
// UI Component
export function Button({ children, variant = 'primary', ...props }) {
  return <button className={cn(btnVariants[variant])} {...props}>{children}</button>
}
```

## Tailwind CSS v4 Configuration

Tailwind CSS v4 uses CSS-first configuration in `globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}
```

## Components to Create

### Layout Components
1. `components/layout/Sidebar.tsx` - Navigation sidebar
2. `components/layout/Header.tsx` - Top header with user menu
3. `components/layout/DashboardLayout.tsx` - Wrapper with sidebar + header

### UI Components (Created)
1. `components/ui/Button.tsx`
2. `components/ui/Input.tsx`
3. `components/ui/Card.tsx`
4. `components/ui/Table.tsx` - Generic table with TanStack Table ✓
5. `components/ui/Modal.tsx`
6. `components/ui/Label.tsx` - Status badges ✓

### DataTable Usage

The generic `DataTable` component uses TanStack Table for flexible data display:

```tsx
import { DataTable, TableColumnDef, ActionColumnConfig } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";
```

#### Basic Column Definition

```typescript
const columns: TableColumnDef<MyType>[] = [
  {
    id: "fieldName",
    header: "Display Header",
    accessorKey: "fieldName",  // maps to row.fieldName
  },
];
```

#### Custom Cell Rendering

```typescript
const columns: TableColumnDef<Categoria>[] = [
  {
    id: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <Label variant={row.original.tipo === 1 ? "success" : "danger"}>
        {row.original.tipo === 1 ? "Ingreso" : "Gasto"}
      </Label>
    ),
  },
  {
    id: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="w-6 h-6 rounded" style={{ backgroundColor: row.original.color }} />
    ),
  },
];
```

#### Action Column

```typescript
const actionConfig: ActionColumnConfig<MyType> = {
  label: "Acciones",
  onEdit: (row) => handleEdit(row),
  onDelete: (row) => handleDelete(row),
  onView: (row) => handleView(row),
  customActions: [
    {
      label: "Custom",
      onClick: (row) => doSomething(row),
      variant: "outline",
    },
  ],
};
```

#### Full Usage Example

```tsx
<DataTable
  data={items}
  columns={columns}
  actionConfig={actionConfig}
  getRowId={(row) => row.id}
  isLoading={loading}
  emptyMessage="No hay elementos"
  onRowClick={(row) => handleRowClick(row)}
/>
```

### Pages to Implement
1. `/login` - Login page
2. `/dashboard` - Dashboard home
3. `/dashboard/categorias` - Categories management
4. `/dashboard/transacciones` - Transactions list
5. `/dashboard/presupuestos` - Budget management
6. `/dashboard/reportes` - Reports

## Naming Conventions

- Components: PascalCase (`Sidebar.tsx`, `Button.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types/Interfaces: PascalCase (`User.ts`, `Transaction.ts`)
- Utils: camelCase (`formatCurrency.ts`)

## State Management

Use React Context or Zustand for global state:
- `stores/authStore.ts` - Authentication state
- `stores/appStore.ts` - App-wide state

## API Client Conventions

### Generic Response Type

All API endpoints return a consistent response structure that includes a `message` field for notifications and error handling. Use this generic type for all API calls:

```typescript
// Generic API response wrapper
interface ApiResponse<T> {
  message: string;
  [key: string]: T | string;
}
```

### Example Usage

```typescript
// Login response
interface LoginResponseDTO {
  message: string;
  usuario: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo_electronico: string;
    salario_mensual_base: number;
    estado: string;
  };
}

// Login request
interface LoginDTO {
  correo: string;
  contrasena: string;
}
```

### Service File Organization

Each entity should have its own service file in `src/services/`:

```
src/services/
├── auth.service.ts       # Authentication endpoints
├── categoria.service.ts  # Category CRUD
├── subcategoria.service.ts # Subcategory CRUD
└── [entity].service.ts   # New entities follow same pattern
```

**File naming:** Use kebab-case with `.service.ts` suffix

**Service structure:**

```typescript
// src/services/categoria.service.ts
import { Categoria, CreateCategoriaDto, CategoriaListResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
}

export const categoriaService = {
  async getAll(id_usuario: number): Promise<CategoriaListResponse> {
    return fetchApi<CategoriaListResponse>(`/categorias?id_usuario=${id_usuario}`);
  },
  
  async create(id_usuario: number, categoria: CreateCategoriaDto): Promise<{ message: string; id_categoria: number }> {
    return fetchApi<{ message: string; id_categoria: number }>("/categorias", {
      method: "POST",
      body: JSON.stringify({ ...categoria, id_usuario }),
    });
  },
  
  // ... other methods
};
```

**Always include `hifin_user_id` when the endpoint requires user identification.**

### Types Organization

Follow this structure for type definitions:

```
src/types/
├── dto/                    # Entity-specific DTOs
│   ├── categoria.types.ts   # Categoria DTOs
│   ├── presupuesto.types.ts # Presupuesto DTOs
│   └── [entity].types.ts   # New entities follow same pattern
├── common/                 # Generic/shared types
│   └── common.types.ts     # ApiResponse, generic interfaces
└── api.ts                  # Barrel file exporting all types
```

**DTO files** - Entity-specific types (requests/responses for each entity):
```typescript
// src/types/dto/categoria.types.ts
export interface Categoria {
  id: number;
  nombre: string;
  // ...
}

export interface CreateCategoriaDto {
  nombre: string;
  // ...
}
```

**Common types** - Generic types shared across entities:
```typescript
// src/types/common/common.types.ts
export interface ApiResponse<T = unknown> {
  message: string;
  [key: string]: T | string;
}
```

**Always export types from `api.ts` for easy importing:**
```typescript
export * from "./dto/categoria.types";
export * from "./dto/presupuesto.types";
export * from "./common/common.types";
```

### Environment Configuration

Create `.env.local` in the project root with the API base URL:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The API client should automatically prepend this URL to all endpoints.