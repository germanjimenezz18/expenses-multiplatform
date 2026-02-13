# Expenses Multiplatform - AI Context Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Critical File Locations](#2-critical-file-locations)
3. [Development Patterns](#3-development-patterns)
4. [Database Schema](#4-database-schema)
5. [API Architecture](#5-api-architecture)
6. [Code Conventions](#6-code-conventions)
7. [Common Workflows](#7-common-workflows)
8. [Constraints & Gotchas](#8-constraints--gotchas)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment](#10-deployment)
11. [AI Assistant Decision Trees](#11-ai-assistant-decision-trees)
12. [Quick Commands Reference](#12-quick-commands-reference)
13. [Additional Context](#13-additional-context)

---

## 1. Project Overview

### 1.1 Purpose & Description

**Expenses Multiplatform** is a full-stack expense tracking and financial management application that enables users to:
- Track personal financial transactions across multiple accounts
- Manage expense categories for better organization
- Import transactions via CSV for bulk data entry
- Connect bank accounts through Plaid API for automated transaction sync
- View financial analytics with category breakdowns and trend analysis
- Authenticate securely with Clerk

**Target Users**: Individuals managing personal finances across multiple bank accounts and payment methods.

### 1.2 Architecture Pattern

- **Type**: Full-stack monolith with Next.js App Router
- **API Strategy**: Hono API routes with RPC-style client using `hono/client` for type-safe API calls
- **Data Flow**:
  - Server Components → React Query hooks → Hono API → Drizzle ORM → Neon PostgreSQL
  - Client state managed via Zustand for UI interactions (modals, sheets)
- **Authentication**: Clerk middleware protecting all dashboard routes and API endpoints
- **Runtime**: Edge runtime for API routes (optimized for serverless deployment)

### 1.3 Technology Stack Summary

**Frontend Layer**
- Next.js 14 with App Router (React 18)
- TypeScript (strict mode enabled)
- Tailwind CSS for styling
- shadcn/ui component library
- React Hook Form + Zod for form validation
- Framer Motion for animations
- Recharts for data visualization
- React Plaid Link for bank integration

**State Management**
- React Query (TanStack Query) for server state management
- Zustand for client UI state (modal/sheet open/close states)

**Backend Layer**
- Hono framework (lightweight, edge-optimized)
- Drizzle ORM with Zod integration
- Neon serverless PostgreSQL database
- Clerk authentication with middleware
- Plaid API for bank integration
- CUID2 for unique ID generation

**Testing & DevOps**
- Cypress for E2E testing
- GitHub Actions pipeline (lint, build, tests)
- Bun package manager

---

## 2. Critical File Locations

### 2.1 Quick Reference Map

```
/app/api/[[...route]]/
  ├── route.ts              # Main API router (exports GET/POST/PATCH/DELETE)
  ├── accounts.ts           # Account CRUD endpoints
  ├── categories.ts         # Category CRUD endpoints
  ├── transactions.ts       # Transaction CRUD + bulk operations
  └── summary.ts            # Dashboard analytics endpoint

/features/
  ├── accounts/
  │   ├── api/              # React Query hooks (use-create-account.ts, etc.)
  │   ├── components/       # UI (new-account-sheet.tsx, account-form.tsx)
  │   └── hooks/            # Zustand state (use-new-account.ts, use-open-account.ts)
  ├── categories/           # Same structure as accounts
  ├── transactions/         # Same structure as accounts + CSV import
  ├── plaid/                # Plaid integration API hooks
  └── summary/              # Dashboard summary API hooks

/db/
  ├── schema.ts             # Drizzle schema definitions (tables, relations, validators)
  └── drizzle.ts            # Database connection setup

/lib/
  ├── hono.ts               # Typed Hono client initialization
  ├── utils.ts              # Helper functions (amount conversion, currency formatting)
  └── custom-types.ts       # TypeScript type definitions

/components/              # Shared UI components (data-table, filters, charts)
/app/dashboard/          # Dashboard pages (page.tsx, layout.tsx)
/middleware.ts           # Clerk auth middleware
```

### 2.2 Entry Points for Common Tasks

#### Adding a new feature (e.g., "budgets")
1. `/db/schema.ts` - Define table schema
2. Run `bun run db:generate` - Generate migration
3. Run `bun run db:migrate` - Apply migration
4. `/app/api/[[...route]]/budgets.ts` - Create API endpoints
5. `/app/api/[[...route]]/route.ts` - Register route
6. `/features/budgets/api/` - Create React Query hooks
7. `/features/budgets/hooks/` - Create Zustand state hooks
8. `/features/budgets/components/` - Create UI components
9. `/providers/sheet-provider.tsx` - Register modal sheets

#### Modifying database schema
1. `/db/schema.ts` - Update schema
2. `bun run db:generate` - Generate migration
3. `bun run db:migrate` - Apply migration
4. Update affected API endpoints in `/app/api/[[...route]]/`
5. Update React Query hooks in `/features/*/api/`

#### Adding a new API endpoint
1. `/app/api/[[...route]]/{resource}.ts` - Add endpoint with auth middleware
2. `/features/{resource}/api/use-{action}-{resource}.ts` - Create React Query hook
3. Component - Call hook and handle UI

#### Creating a new UI component
1. Check `/components/ui/` for existing shadcn components
2. Create in `/features/{feature}/components/` if feature-specific
3. Create in `/components/` if shared across features
4. Follow existing patterns from `account-form.tsx` or `transaction-form.tsx`

---

## 3. Development Patterns

### 3.1 Feature Organization (Feature-Based Architecture)

Every feature follows this consistent structure:

```
/features/{feature-name}/
  ├── api/                  # React Query hooks for server communication
  │   ├── use-get-{feature}s.ts      # Fetch list
  │   ├── use-get-{feature}.ts       # Fetch single
  │   ├── use-create-{feature}.ts    # Create
  │   ├── use-edit-{feature}.ts      # Update
  │   ├── use-delete-{feature}.ts    # Delete
  │   └── use-bulk-delete-{feature}s.ts  # Bulk delete
  ├── hooks/                # Zustand state for UI control
  │   ├── use-new-{feature}.ts       # Modal open/close state
  │   └── use-open-{feature}.ts      # Edit modal state with ID
  └── components/           # UI components
      ├── {feature}-form.tsx         # Reusable form
      ├── new-{feature}-sheet.tsx    # Create modal
      └── edit-{feature}-sheet.tsx   # Edit modal
```

### 3.2 State Management Conventions

#### Server State (React Query)

**Location**: `/features/*/api/use-*.ts`

**Pattern**: Use `useMutation` for writes, `useQuery` for reads

**Example from** `/features/accounts/api/use-create-account.ts`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Type inference from Hono endpoint
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Account created");
      // CRITICAL: Always invalidate queries after mutations
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error creating account");
    },
  });
};
```

**Key Points**:
- Use `InferResponseType` and `InferRequestType` from Hono for full type safety
- Always invalidate React Query cache on success
- Show toast notifications via `sonner` for user feedback
- Error handling with toast messages

#### Client State (Zustand)

**Location**: `/features/*/hooks/use-*.ts`

**Purpose**: Modal/sheet open/close state, selected item IDs

**Example from** `/features/accounts/hooks/use-new-account.ts`:

```typescript
import { create } from "zustand";

type NewAccountState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAccount = create<NewAccountState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
```

**Usage Pattern**:
```typescript
// In a component
const { isOpen, onOpen, onClose } = useNewAccount();
```

### 3.3 Form Handling Patterns

**Standard Form Flow**:
1. Define Zod schema from Drizzle schema using `createInsertSchema`
2. Use React Hook Form with `zodResolver`
3. Handle submission with type-safe conversion
4. Connect to React Query mutation hook

**Example from** `/features/accounts/components/account-form.tsx`:

```typescript
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertAccountSchema } from "@/db/schema";

// Pick only the fields needed for the form
const formSchema = insertAccountSchema.pick({ name: true });
type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function AccountForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        {/* Form fields */}
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create account"}
        </Button>
        {/* Show delete button only when editing (id exists) */}
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            variant="outline"
          >
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
}
```

### 3.4 Amount Handling Pattern

**CRITICAL**: The application stores monetary amounts as integers to avoid floating-point precision issues.

**From** `/lib/utils.ts`:

```typescript
// User enters: 10.50
// Stored in DB: 10500 (multiplied by 1000)
export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

// DB value: 10500
// Display to user: 10.50
export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}
```

**Usage Flow**:
- **User Input**: Decimal string (e.g., "10.50")
- **Form State**: String representation
- **API Payload**: Integer (e.g., 10500) - multiply by 1000 before sending
- **Database Storage**: Integer
- **Display**: Convert back using `convertAmountFromMiliUnits`

**Example**:
```typescript
// Before sending to API
const formData = {
  amount: convertAmountToMiliUnits(parseFloat(formValues.amount)), // 10.50 → 10500
  // ... other fields
};

// When displaying
const displayAmount = convertAmountFromMiliUnits(transaction.amount); // 10500 → 10.50
```

### 3.5 Component Composition Patterns

#### Sheet/Modal Pattern
- All create/edit operations use shadcn Sheet components
- Registered globally in `/providers/sheet-provider.tsx`
- Controlled by Zustand hooks for open/close state
- Contain reusable form components

#### Form Reusability
- Separate form components (e.g., `account-form.tsx`)
- Accept props: `onSubmit`, `onDelete`, `disabled`, `defaultValues`, `id`
- Used in both create and edit sheets
- Delete button only shown when `id` prop exists (edit mode)

---

## 4. Database Schema

### 4.1 Tables & Relationships

**From** `/db/schema.ts`:

#### Accounts Table

```typescript
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),              // CUID2 generated
  plaidId: text("plaid_id"),                // Plaid account ID (nullable)
  name: text("name").notNull(),             // Account name (required)
  userId: text("user_id").notNull(),        // Clerk user ID (required)
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));
```

**Relationships**: One account has many transactions

#### Categories Table

```typescript
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),              // CUID2 generated
  plaidId: text("plaid_id"),                // Plaid category ID (nullable)
  name: text("name").notNull(),             // Category name (required)
  userId: text("user_id").notNull(),        // Clerk user ID (required)
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));
```

**Relationships**: One category has many transactions

#### Transactions Table

```typescript
/* transactions
  Amount : Integers multiplied by 1000 to avoid float/double problems  $10.50 = 10500
*/
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),      // CRITICAL: Amount in miliunits (× 1000)
  payee: text("payee").notNull(),           // Recipient/payer name
  notes: text("notes"),                     // Optional notes (nullable)
  date: timestamp("date", { mode: "date" }).notNull(),

  // CASCADE delete: if account deleted, delete all transactions
  accountId: text("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),

  // SET NULL delete: if category deleted, preserve transaction but remove category link
  categoryId: text("category_id")
    .references(() => categories.id, { onDelete: "set null" }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
```

**Relationships**:
- Many-to-one with accounts (required)
- Many-to-one with categories (optional)

### 4.2 Critical Schema Patterns

#### Amount Storage Pattern

**CRITICAL**: Stored as integers multiplied by 1000 to avoid floating-point precision issues.

```typescript
// Example: $10.50 stored as 10500
amount: integer("amount").notNull()
```

**Conversion Functions** (from `/lib/utils.ts`):
```typescript
convertAmountToMiliUnits(10.50)      // → 10500 (for DB storage)
convertAmountFromMiliUnits(10500)    // → 10.50 (for display)
```

#### ID Generation

Uses `@paralleldrive/cuid2` library for collision-resistant IDs:

```typescript
import { createId } from "@paralleldrive/cuid2";

const [data] = await db
  .insert(accounts)
  .values({
    id: createId(),  // Generates unique CUID2
    userId: auth.userId,
    ...values,
  })
  .returning();
```

#### Delete Behaviors

- **Account deletion**: CASCADE - deletes all related transactions
- **Category deletion**: SET NULL - preserves transactions, removes category link

```typescript
// Account deletion cascade
accountId: text("account_id")
  .references(() => accounts.id, { onDelete: "cascade" })
  .notNull(),

// Category deletion set null
categoryId: text("category_id")
  .references(() => categories.id, { onDelete: "set null" }),
```

### 4.3 Schema Validation

All schemas exported with Zod validators via `createInsertSchema`:

```typescript
export const insertAccountSchema = createInsertSchema(accounts);
export const insertCategorySchema = createInsertSchema(categories);
export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),  // Coerce date strings to Date objects
});
```

**Usage**:
- API validation (Hono with `zValidator`)
- Form validation (React Hook Form with `zodResolver`)

---

## 5. API Architecture

### 5.1 Hono Setup & Structure

**Main Router** (`/app/api/[[...route]]/route.ts`):

```typescript
import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from "./summary";

export const runtime = "edge";  // Edge runtime for serverless

const app = new Hono().basePath("/api");

// Register all routes
const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary);

// Export HTTP methods for Next.js
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// CRITICAL: Export type for client-side type inference
export type AppType = typeof routes;
```

### 5.2 Authentication Middleware Pattern

**CRITICAL**: Every endpoint must use this pattern to ensure user data isolation.

**Example from** `/app/api/[[...route]]/accounts.ts`:

```typescript
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    // CRITICAL: Always check auth
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // CRITICAL: Always filter by userId
    const data = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  });
```

**Security Checklist**:
1. ✅ Import `clerkMiddleware` and `getAuth`
2. ✅ Add `clerkMiddleware()` to endpoint
3. ✅ Get auth with `getAuth(c)`
4. ✅ Validate `auth?.userId` exists
5. ✅ Filter all queries by `userId`

### 5.3 Standard CRUD Endpoint Patterns

#### GET / - List all (with userId filter)

```typescript
.get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const data = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, auth.userId));

  return c.json({ data });
})
```

#### GET /:id - Get single item

```typescript
.get(
  "/:id",
  zValidator("param", z.object({ id: z.string().optional() })),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "Missing Id" }, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // CRITICAL: Filter by both userId AND id
    const [data] = await db
      .select()
      .from(accounts)
      .where(and(
        eq(accounts.userId, auth.userId),
        eq(accounts.id, id)
      ));

    if (!data) {
      return c.json({ error: "Not Found" }, 404);
    }

    return c.json({ data });
  }
)
```

#### POST / - Create new

```typescript
.post(
  "/",
  clerkMiddleware(),
  zValidator("json", insertAccountSchema.pick({ name: true })),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .insert(accounts)
      .values({
        id: createId(),              // Generate CUID2
        userId: auth.userId,         // Auto-inject userId
        ...values,
      })
      .returning();

    return c.json({ data });
  }
)
```

#### PATCH /:id - Update

```typescript
.patch(
  "/:id",
  clerkMiddleware(),
  zValidator("param", z.object({ id: z.string().optional() })),
  zValidator("json", insertAccountSchema.pick({ name: true })),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    const values = c.req.valid("json");

    if (!id) {
      return c.json({ error: "Missing Id" }, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // CRITICAL: Verify ownership before update
    const [data] = await db
      .update(accounts)
      .set(values)
      .where(and(
        eq(accounts.userId, auth.userId),
        eq(accounts.id, id)
      ))
      .returning();

    if (!data) {
      return c.json({ error: "Not Found" }, 404);
    }

    return c.json({ data });
  }
)
```

#### DELETE /:id - Delete single

```typescript
.delete(
  "/:id",
  clerkMiddleware(),
  zValidator("param", z.object({ id: z.string().optional() })),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!id) {
      return c.json({ error: "Missing Id" }, 400);
    }

    // CRITICAL: Verify ownership before delete
    const [data] = await db
      .delete(accounts)
      .where(and(
        eq(accounts.userId, auth.userId),
        eq(accounts.id, id)
      ))
      .returning({ id: accounts.id });

    if (!data) {
      return c.json({ error: "Not Found" }, 404);
    }

    return c.json({ data });
  }
)
```

#### POST /bulk-delete - Delete multiple

```typescript
.post(
  "/bulk-delete",
  clerkMiddleware(),
  zValidator("json", z.object({ ids: z.array(z.string()) })),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // CRITICAL: Filter by userId to ensure ownership
    const data = await db
      .delete(accounts)
      .where(and(
        eq(accounts.userId, auth.userId),
        inArray(accounts.id, values.ids)
      ))
      .returning({ id: accounts.id });

    return c.json({ data });
  }
)
```

### 5.4 Client-Side Type Safety

**Hono RPC Client** (`/lib/hono.ts`):

```typescript
import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
```

**Usage in React Query Hooks**:
```typescript
import { InferResponseType, InferRequestType } from "hono";
import { client } from "@/lib/hono";

// Full type inference from API endpoint
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];
```

---

## 6. Code Conventions

### 6.1 TypeScript Strictness

- **Strict mode enabled** in `tsconfig.json`
- No implicit `any`
- Strict null checks
- All schemas use Zod for runtime validation

### 6.2 Naming Conventions

#### Files
- React components: PascalCase (`AccountForm.tsx`, `NewAccountSheet.tsx`)
- Hooks: kebab-case with `use-` prefix (`use-create-account.ts`, `use-new-account.ts`)
- API routes: kebab-case (`accounts.ts`, `transactions.ts`)
- Utilities: kebab-case (`utils.ts`, `custom-types.ts`)

#### Functions/Variables
- React Query hooks: `use{Action}{Resource}` (e.g., `useCreateAccount`, `useGetAccounts`)
- Zustand hooks: `use{Action}{Resource}` (e.g., `useNewAccount`, `useOpenAccount`)
- Components: PascalCase (e.g., `AccountForm`, `DataTable`)
- Utilities: camelCase (e.g., `convertAmountToMiliUnits`, `formatCurrency`)

#### Database
- Tables: plural lowercase (`accounts`, `categories`, `transactions`)
- Columns: camelCase in schema, snake_case in database
- Foreign keys: `{resource}Id` (e.g., `accountId`, `categoryId`)

### 6.3 Validation Pattern

```
Database Schema (Drizzle)
    ↓ createInsertSchema
Zod Schema
    ↓ zodResolver               ↓ zValidator
React Hook Form            Hono API Validation
```

### 6.4 Import Aliases

- `@/` maps to project root
- Examples: `@/lib/utils`, `@/components/ui/button`, `@/db/schema`

### 6.5 Component Patterns

- Use shadcn/ui components from `/components/ui/`
- Shared components in `/components/`
- Feature-specific components in `/features/{feature}/components/`
- Always use `"use client"` directive for client components
- Server components by default in App Router

---

## 7. Common Workflows

### 7.1 Adding a New Feature (Complete Example)

**Scenario**: Add "Budgets" feature with monthly budget tracking per category

#### Step 1: Database Schema

Edit `/db/schema.ts`:

```typescript
export const budgets = pgTable("budgets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),  // In miliunits
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "cascade"
  }),
  userId: text("user_id").notNull(),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
});

export const budgetsRelations = relations(budgets, ({ one }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

export const insertBudgetSchema = createInsertSchema(budgets);
```

#### Step 2: Generate & Run Migration

```bash
bun run db:generate
bun run db:migrate
```

#### Step 3: Create API Endpoints

Create `/app/api/[[...route]]/budgets.ts`:

```typescript
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { budgets, insertBudgetSchema } from "@/db/schema";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const data = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, auth.userId));

    return c.json({ data });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertBudgetSchema.omit({ id: true, userId: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const [data] = await db
        .insert(budgets)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  );
  // Add PATCH, DELETE, bulk-delete endpoints...

export default app;
```

#### Step 4: Register Route

Edit `/app/api/[[...route]]/route.ts`:

```typescript
import budgets from "./budgets";

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary)
  .route("/budgets", budgets);  // Add this line
```

#### Step 5: Create React Query Hooks

Create `/features/budgets/api/use-create-budget.ts`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.budgets.$post>;
type RequestType = InferRequestType<typeof client.api.budgets.$post>["json"];

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.budgets.$post({ json });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Budget created");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: () => toast.error("Error creating budget"),
  });
};
```

Create similar hooks for: `use-get-budgets.ts`, `use-edit-budget.ts`, `use-delete-budget.ts`

#### Step 6: Create Zustand State

Create `/features/budgets/hooks/use-new-budget.ts`:

```typescript
import { create } from "zustand";

type NewBudgetState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewBudget = create<NewBudgetState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
```

#### Step 7: Create Components

Create `/features/budgets/components/budget-form.tsx` (follow `account-form.tsx` pattern)
Create `/features/budgets/components/new-budget-sheet.tsx` (follow `new-account-sheet.tsx` pattern)

#### Step 8: Register Sheet

Edit `/providers/sheet-provider.tsx`:

```typescript
import NewBudgetSheet from "@/features/budgets/components/new-budget-sheet";

export const SheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <NewBudgetSheet />  {/* Add this */}
      {/* other sheets */}
    </>
  );
};
```

### 7.2 Modifying Existing Endpoints

**Scenario**: Add date range filtering to transactions endpoint

1. Update validation schema
2. Add query parameter handling
3. Update Drizzle query with new filters
4. Update React Query hook to pass new params
5. Update UI to collect filter values

### 7.3 Creating UI Components

**Use existing shadcn components**:
```bash
npx shadcn-ui@latest add [component-name]
```

**Component composition**:
- Import from `/components/ui/`
- Wrap in custom components in `/components/` or `/features/*/components/`
- Use Tailwind for styling
- Follow existing patterns from data-table, filters, etc.

---

## 8. Constraints & Gotchas

### 8.1 Known Issues (from TODO.md)

#### 1. Amount Update Bug
- **Issue**: "Arreglar amount al actualizar una transaccion"
- **Context**: When updating a transaction, amount field has issues
- **Likely Cause**: Miliunits conversion not handled correctly in update flow
- **Check**: Transaction form and update API endpoint

#### 2. Sheet Input Placeholder Update
- **Issue**: "Sheet > input > actualizar placeholder cuando cambias el name y vuelves a abrir el sheet"
- **Context**: Placeholder doesn't update when reopening sheet after name change
- **Affects**: All sheet forms (accounts, categories, transactions)

#### 3. Planned Changes
- Replace Clerk with Better Auth (future)
- Add Vercel AI SDK integration (future)

### 8.2 Important Patterns to Follow

#### DO:
✅ Always filter database queries by `auth.userId`
✅ Use `convertAmountToMiliUnits` before sending amounts to API
✅ Use `convertAmountFromMiliUnits` when displaying amounts
✅ Invalidate React Query cache after all mutations
✅ Use CUID2 for ID generation (`createId()`)
✅ Use Zod schemas derived from Drizzle schemas
✅ Test amount calculations carefully (known issue area)
✅ Add `clerkMiddleware()` to all API endpoints
✅ Verify ownership before UPDATE/DELETE operations

#### DON'T:
❌ Don't use float/double for amounts (use integers × 1000)
❌ Don't skip user ID validation in API endpoints
❌ Don't bypass Zod validation
❌ Don't hardcode URLs (use env vars)
❌ Don't forget to register new sheets in SheetProvider
❌ Don't expose data from other users (always filter by userId)

### 8.3 Environment Variables

**From** `.env.example`:

```env
# Required Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DB_CONNECTION_URL=
PLAID_CLIENT_ID=
PLAID_SECRET=

# Clerk Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

---

## 9. Testing Strategy

### 9.1 Cypress E2E Setup

**Configuration**: `cypress.config.ts`
- Support file disabled
- Basic E2E configuration
- Tests in `/cypress/e2e/`

**Running Tests**:
```bash
bun run cypress:open    # Interactive mode
bun run test:e2e        # Headless mode
```

### 9.2 What Should Be Tested

**Critical Paths**:
1. User authentication flow (sign in/sign up)
2. Account CRUD operations
3. Category CRUD operations
4. Transaction creation with amount conversion
5. Bulk delete operations
6. Date filtering in transactions
7. CSV import functionality
8. Plaid integration flow

**Test Patterns**:
- Test amount calculations (known bug area)
- Test user data isolation (security critical)
- Test sheet open/close states
- Test form validation (Zod schemas)

---

## 10. Deployment

### 10.1 GitHub Actions Pipeline

**File**: `/.github/workflows/pipeline.yml`

**Triggered on**: Push to main branch

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm install`)
4. Lint (`npm run lint`)
5. Build (`npm run build`)
6. E2E tests (currently commented out)

### 10.2 Vercel Deployment

**Platform**: Vercel
**Runtime**: Edge
**Database**: Neon serverless PostgreSQL

**Configuration**:
- Set all environment variables from `.env.example` in Vercel dashboard
- Build Command: `npm run build`
- Output Directory: `.next`

### 10.3 Database Migrations

**Development**:
```bash
bun run db:generate    # Generate migration from schema changes
bun run db:migrate     # Apply migrations locally
bun run db:studio      # Open Drizzle Studio
```

**Production**:
- Run migrations manually or via CI/CD
- Use Drizzle Kit migrate command with production DB URL
- Always test migrations in staging first

---

## 11. AI Assistant Decision Trees

### 11.1 "How do I add a new field to transactions?"

**Decision Flow**:

1. **Is it a simple column addition?**
   - YES → Update `/db/schema.ts`
   - Run `bun run db:generate` and `bun run db:migrate`
   - Update `insertTransactionSchema` if validation needed
   - Update `/features/transactions/components/transaction-form.tsx`
   - Update API endpoint if needed

2. **Does it require a new table?**
   - YES → Follow "Adding a New Feature" workflow (Section 7.1)

### 11.2 "How do I fix a bug in amount handling?"

**Troubleshooting Steps**:

1. Check conversion functions in `/lib/utils.ts` (lines 9-15):
   ```typescript
   convertAmountToMiliUnits(amount)     // Multiply by 1000
   convertAmountFromMiliUnits(amount)   // Divide by 1000
   ```

2. Verify form submission in transaction-form.tsx:
   - Ensure amount is converted before API call
   - Check that display uses `convertAmountFromMiliUnits`

3. Check API endpoint doesn't double-convert:
   - Amount should already be in miliunits from form
   - Don't convert again in API

4. Verify database stores as integer:
   - Check schema: `amount: integer("amount").notNull()`

5. Check display uses correct conversion:
   - All displays should use `convertAmountFromMiliUnits`
   - Format with `formatCurrency` for consistent display

### 11.3 "How do I add authentication to a new endpoint?"

**Step-by-Step**:

1. **Import dependencies**:
   ```typescript
   import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
   ```

2. **Add middleware to endpoint**:
   ```typescript
   .get("/", clerkMiddleware(), async (c) => {
   ```

3. **Get auth context**:
   ```typescript
   const auth = getAuth(c);
   ```

4. **Validate userId**:
   ```typescript
   if (!auth?.userId) {
     return c.json({ error: "Unauthorized" }, 401);
   }
   ```

5. **Filter query by userId**:
   ```typescript
   const data = await db
     .select()
     .from(table)
     .where(eq(table.userId, auth.userId));
   ```

---

## 12. Quick Commands Reference

```bash
# Development
bun dev              # Start dev server (http://localhost:3000)
bun run build        # Production build
bun run lint         # Run ESLint

# Database
bun run db:generate  # Generate migration from schema changes
bun run db:migrate   # Run pending migrations
bun run db:studio    # Open Drizzle Studio (database GUI)

# Testing
bun run cypress:open # Open Cypress interactive UI
bun run test:e2e     # Run E2E tests in headless mode
```

---

## 13. Additional Context

### 13.1 Utility Functions

**From** `/lib/utils.ts`:

#### Class Name Merger
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Amount Conversion
```typescript
export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}
```

#### Currency Formatting
```typescript
export function formatCurrency(value: number) {
  let currencySymbol = "€";
  let formatted = new Intl.NumberFormat("en-IN", {
    notation: "standard",
    minimumFractionDigits: 2,
  }).format(value);
  return `${currencySymbol} ${formatted}`;
}
```

#### Percentage Calculation
```typescript
export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
}
```

#### Date Range Formatting
```typescript
export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return format(period.from, "LLL dd, y");
}
```

#### Percentage Formatting
```typescript
export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false }
) {
  const results = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${results}`;
  }

  return results;
}
```

#### Fill Missing Days (for charts)
```typescript
export default function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));
    if (found) {
      return found;
    } else {
      return { date: day, income: 0, expenses: 0 };
    }
  });

  return transactionsByDay;
}
```

### 13.2 Middleware Behavior

**From** `/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',  // All dashboard routes require auth
]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth().protect();  // Redirect to sign-in if not authenticated
  }

  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  return NextResponse.next({ headers });
});
```

**Protected Routes**: `/dashboard` and all sub-routes
**Behavior**: Automatically redirects unauthenticated users to sign-in page

### 13.3 Providers Structure

**Query Provider** - React Query configuration with default options
**Sheet Provider** - Registers all modal sheets globally (accounts, categories, transactions, etc.)
**Theme Provider** - Dark/light mode theming with system preference detection

All providers wrapped in root layout (`/app/layout.tsx`)

### 13.4 Troubleshooting Guide

#### "Unauthorized" 401 errors
- Check Clerk environment variables are set correctly
- Verify middleware is protecting the route (`/dashboard(.*)` pattern)
- Check `auth().userId` is available in API endpoint
- Ensure `clerkMiddleware()` is added to endpoint

#### Type errors in React Query hooks
- Verify `AppType` is exported from `/app/api/[[...route]]/route.ts`
- Check Hono client is typed correctly in `/lib/hono.ts`
- Ensure `InferResponseType` and `InferRequestType` match endpoint signature
- Check that route is registered in main router

#### Amount display issues
- Verify using `convertAmountFromMiliUnits` when displaying
- Check database stores integer, not float
- Ensure form uses `convertAmountToMiliUnits` on submit
- Don't convert multiple times (common mistake)

#### Migration errors
- Check schema syntax in `/db/schema.ts`
- Verify `DB_CONNECTION_URL` environment variable is correct
- Run `bun run db:generate` before `bun run db:migrate`
- Check for conflicting migrations in `/drizzle` folder

#### Sheet/Modal not appearing
- Check if sheet is registered in `/providers/sheet-provider.tsx`
- Verify Zustand hook is being called correctly
- Ensure `isOpen` state is being set to `true`
- Check for z-index conflicts in CSS

#### Data not updating after mutation
- Verify `queryClient.invalidateQueries` is called on success
- Check the correct `queryKey` is used
- Ensure mutation is not silently failing (check error handling)
- Look for toast notifications indicating success/failure

---

## Summary

This documentation provides a comprehensive guide for AI assistants to understand and work effectively with the Expenses Multiplatform codebase. Key takeaways:

1. **Feature-based architecture** with consistent patterns across all features
2. **Type-safe API** using Hono with full type inference via RPC client
3. **Amount handling** uses integers × 1000 to avoid floating-point issues (CRITICAL)
4. **Security-first** approach with userId filtering on all endpoints
5. **State management** split between React Query (server) and Zustand (client UI)
6. **Validation** flows from Drizzle schema → Zod → React Hook Form/Hono

When in doubt, reference existing implementations in the `/features/accounts` directory as the canonical example of all patterns.
