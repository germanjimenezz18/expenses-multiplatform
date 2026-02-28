# Expenses Multiplatform

Personal finance management app: bank accounts, transactions, categories, and balance tracking.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Backend:** Hono 4.5 on API routes (`app/api/[[...route]]/`)
- **DB:** PostgreSQL + Drizzle ORM (schema in `db/schema.ts`)
- **State:** TanStack React Query 5 (server) + Zustand 5 (client/UI)
- **Forms:** React Hook Form + Zod 4
- **Auth:** Clerk
- **UI:** Radix UI + Shadcn + Tailwind CSS 3
- **Runtime/Package Manager:** Bun
- **Linting:** Biome + Ultracite
- **Testing:** Cypress (E2E)

## Commands

```bash
bun dev              # Development
bun run build        # Production build
bun run check        # Lint check (ultracite)
bun run fix          # Lint autofix
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run migrations
bun run db:studio    # Database UI
```

## Architecture

### Directory structure

```
app/                    # Next.js App Router (pages + API routes)
├── api/[[...route]]/   # Hono API (accounts, transactions, categories, balances, summary)
├── (auth)/             # Authentication pages (Clerk)
├── (landing)/          # Public landing
└── dashboard/          # Protected pages (accounts, transactions, categories, analytics)

features/               # Domain modules (feature-sliced)
├── accounts/           # Bank accounts CRUD
├── transactions/       # Transactions CRUD
├── categories/         # Categories CRUD
├── account-balances/   # Per-account balance tracking
└── summary/            # Statistics and summaries

components/             # Shared components
├── ui/                 # Radix/Shadcn primitives (button, input, sheet, etc.)
├── layouts/            # Reusable layouts
├── data-table/         # Generic table with actions
└── chart-components/   # Chart variants (area, bar, pie, etc.)

lib/                    # Utilities and types
db/                     # Drizzle schema + connection
providers/              # React context (QueryProvider, SheetProvider, ThemeProvider)
hooks/                  # Shared hooks
```

### Feature pattern

Each feature in `features/` follows this structure:

```
features/<name>/
├── api/          # React Query hooks (useGet*, useCreate*, useEdit*, useDelete*)
├── components/   # Feature-specific UI components
└── hooks/        # Zustand stores (modal/sheet state)
```

**Cross-feature import rule:** only import from another feature's `api/` and `hooks/`, never internal components.

### Data flow

```
Component → React Query hook → Hono Client (typed) → API Route → Drizzle → PostgreSQL
```

The Hono client is in `lib/hono.ts` and auto-generates types from the routes.

## Critical conventions

### Amounts in milliunits

All monetary amounts are stored as **integers × 1000** to avoid floating-point errors:
- `$10.50` → `10500` in DB
- Use `convertAmountToMiliUnits()` and `convertAmountFromMiliUnits()` from `lib/utils.ts`
- Applies to: `transactions.amount`, `accountBalances.balance`

### API hook naming

- Queries: `use-get-<resource>.ts` / `use-get-<resource>s.ts`
- Mutations: `use-create-<resource>.ts`, `use-edit-<resource>.ts`, `use-delete-<resource>.ts`
- Bulk: `use-bulk-create-<resource>.ts`, `use-bulk-delete-<resource>.ts`

### Query keys (React Query)

Each hook uses its query key for invalidation:
- `["accounts"]`, `["account", { id }]`
- `["transactions"]`, `["transaction", { id }]`
- `["categories"]`, `["category", { id }]`
- `["account-balances"]`, `["summary"]`

Mutations invalidate the relevant keys on success.

### DB Schema

Defined in `db/schema.ts`. Main tables:
- `accounts` — id, name, type (enum), userId
- `categories` — id, name, userId
- `transactions` — id, amount (milliunits), payee, notes, date, accountId (cascade), categoryId (set null)
- `accountBalances` — id, date, accountId (cascade), balance (milliunits), note, userId

### Zustand stores

Each feature has stores for UI state (sheet open/close):
- `useNewAccount`, `useOpenAccount`
- `useNewTransaction`, `useOpenTransaction`
- etc.

All are registered in `providers/sheet-provider.tsx`.
