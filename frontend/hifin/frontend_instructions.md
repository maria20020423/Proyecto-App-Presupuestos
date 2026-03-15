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

### UI Components
1. `components/ui/Button.tsx`
2. `components/ui/Input.tsx`
3. `components/ui/Card.tsx`
4. `components/ui/Table.tsx`
5. `components/ui/Modal.tsx`

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