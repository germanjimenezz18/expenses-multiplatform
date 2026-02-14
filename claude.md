# Expenses Multiplatform - AI Context (Quick Reference)

## 1. Project Overview

**Expenses Multiplatform** is a full-stack expense tracking application for managing personal finances across multiple accounts. Built with Next.js 14 (App Router), Hono API, Drizzle ORM, and Neon PostgreSQL. Features include transaction tracking, category management, CSV import, and financial analytics.

**Architecture**: Full-stack monolith with type-safe API using Hono RPC client. Feature-based folder structure with clear separation: React Query for server state, Zustand for UI state, Clerk for auth.

**Tech Stack**: Next.js 14 (React 19) • TypeScript • Tailwind + shadcn/ui • Hono (edge runtime) • Drizzle ORM • Neon PostgreSQL • Clerk Auth • React Query • Zustand • Bun (package manager)

---

## 2. Critical File Map

```
/features/{feature}/              # accounts, categories, transactions, summary
  ├── api/                        # React Query hooks (use-create-*, use-get-*, use-delete-*)
  ├── hooks/                      # Zustand state (use-new-*, use-open-*)
  └── components/                 # UI (forms, sheets)

/app/api/[[...route]]/
  ├── route.ts                    # Main router + AppType export
  ├── accounts.ts                 # Account CRUD endpoints
  ├── categories.ts               # Category CRUD endpoints
  ├── transactions.ts             # Transaction CRUD + bulk operations
  └── summary.ts                  # Analytics endpoint

/db/
  ├── schema.ts                   # Drizzle tables (accounts, categories, transactions)
  └── drizzle.ts                  # Database connection

/lib/
  ├── hono.ts                     # Typed Hono client (AppType import)
  └── utils.ts                    # Amount conversion, currency formatting

/components/                      # Shared UI (data-table, filters, charts)
/providers/sheet-provider.tsx     # Global modal registration
/middleware.ts                    # Clerk auth (protects /dashboard)
```

### Quick File Reference

| Task | Files to Modify |
|------|----------------|
| Add new feature | `db/schema.ts` → `app/api/[[...route]]/{feature}.ts` → `route.ts` (register) → `features/{feature}/api/*` → `providers/sheet-provider.tsx` |
| Modify API endpoint | `app/api/[[...route]]/{resource}.ts` → `features/{resource}/api/use-{action}-{resource}.ts` |
| Add UI component | Check `components/ui/` first → Create in `features/{feature}/components/` or `components/` |
| Database change | `db/schema.ts` → `bun run db:generate` → `bun run db:migrate` → Update API/hooks |

---

## 3. Critical Patterns

### 3.1 Amount Handling (CRITICAL - Known Bug Area)

**Storage Pattern**: Amounts stored as **integers × 1000** to avoid floating-point precision issues.

```typescript
// User enters: 10.50 → Stored as: 10500
convertAmountToMiliUnits(10.50)      // → 10500 (before API submission)
convertAmountFromMiliUnits(10500)    // → 10.50 (for display)
```

**Schema**: `amount: integer("amount").notNull()`

**Flow**:
- Form input → String "10.50"
- Before API: `convertAmountToMiliUnits(parseFloat(value))` → 10500
- Database: 10500 (integer)
- Display: `convertAmountFromMiliUnits(amount)` → 10.50

**Known Issue**: Transaction amount update bug (see Section 7)

### 3.2 Security Pattern (Required for ALL Endpoints)

**Checklist**:
1. ✅ Import `clerkMiddleware`, `getAuth` from `@hono/clerk-auth`
2. ✅ Add `clerkMiddleware()` to endpoint
3. ✅ Get auth: `const auth = getAuth(c)`
4. ✅ Validate: `if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401)`
5. ✅ Filter ALL queries by `userId`: `where(eq(table.userId, auth.userId))`
6. ✅ Verify ownership before UPDATE/DELETE: `and(eq(table.userId, auth.userId), eq(table.id, id))`

**Pattern** (see `app/api/[[...route]]/accounts.ts` for reference):
```typescript
.get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

  const data = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, auth.userId)); // CRITICAL: Always filter by userId

  return c.json({ data });
})
```

### 3.3 Feature-Based Architecture

**Structure** (all features follow this pattern):
```
/features/{feature}/
  ├── api/use-get-{feature}s.ts       # useQuery - list all
  ├── api/use-get-{feature}.ts        # useQuery - single item
  ├── api/use-create-{feature}.ts     # useMutation - create
  ├── api/use-edit-{feature}.ts       # useMutation - update
  ├── api/use-delete-{feature}.ts     # useMutation - delete
  ├── api/use-bulk-delete-{feature}s.ts  # useMutation - bulk delete
  ├── hooks/use-new-{feature}.ts      # Zustand - create modal state
  ├── hooks/use-open-{feature}.ts     # Zustand - edit modal state
  ├── components/{feature}-form.tsx   # Reusable form component
  ├── components/new-{feature}-sheet.tsx   # Create modal
  └── components/edit-{feature}-sheet.tsx  # Edit modal
```

**Reference**: See `features/accounts/` for canonical implementation

---

## 4. Database Schema

### Tables

```typescript
// accounts
{
  id: text("id").primaryKey(),           // CUID2
  plaidId: text("plaid_id"),             // Nullable
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
}

// categories
{
  id: text("id").primaryKey(),           // CUID2
  plaidId: text("plaid_id"),             // Nullable
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
}

// transactions (CRITICAL: amount is integer × 1000)
{
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),   // $10.50 = 10500
  payee: text("payee").notNull(),
  notes: text("notes"),                  // Nullable
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")          // CASCADE delete
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("category_id")        // SET NULL delete
    .references(() => categories.id, { onDelete: "set null" }),
}
```

### Relationships

- **accounts** → **transactions**: One-to-many (CASCADE delete)
- **categories** → **transactions**: One-to-many (SET NULL delete)

### Delete Behaviors

- **Account deleted**: All related transactions deleted (CASCADE)
- **Category deleted**: Transactions preserved, categoryId set to NULL

### Schema Validation

```typescript
// db/schema.ts
export const insertAccountSchema = createInsertSchema(accounts);
export const insertCategorySchema = createInsertSchema(categories);
export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),  // Coerce strings to Date
});
```

### ID Generation

```typescript
import { createId } from "@paralleldrive/cuid2";

const [data] = await db.insert(accounts).values({
  id: createId(),  // Generate unique CUID2
  userId: auth.userId,
  ...values,
}).returning();
```

---

## 5. API Patterns

### 5.1 Standard Endpoint Template

**Location**: `/app/api/[[...route]]/{resource}.ts`

**Pattern** (reference: `accounts.ts`):
```typescript
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";

const app = new Hono()
  // GET / - List all (filter by userId)
  .get("/", clerkMiddleware(), async (c) => { ... })

  // GET /:id - Get single (validate ownership)
  .get("/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => { ... }
  )

  // POST / - Create
  .post("/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (c) => {
      const [data] = await db.insert(accounts).values({
        id: createId(),
        userId: auth.userId,  // Auto-inject
        ...values,
      }).returning();
    }
  )

  // PATCH /:id - Update (verify ownership)
  .patch("/:id", clerkMiddleware(), zValidator(...), async (c) => {
    await db.update(accounts)
      .set(values)
      .where(and(
        eq(accounts.userId, auth.userId),  // Ownership check
        eq(accounts.id, id)
      ));
  })

  // DELETE /:id - Delete (verify ownership)
  .delete("/:id", clerkMiddleware(), zValidator(...), async (c) => { ... })

  // POST /bulk-delete - Bulk delete
  .post("/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      await db.delete(accounts)
        .where(and(
          eq(accounts.userId, auth.userId),
          inArray(accounts.id, values.ids)
        ));
    }
  );

export default app;
```

### 5.2 Route Registration

**File**: `/app/api/[[...route]]/route.ts`

```typescript
import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from "./summary";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// CRITICAL: Export for client type inference
export type AppType = typeof routes;
```

### 5.3 Error Response Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| `400` | Bad Request | Missing required params, invalid input |
| `401` | Unauthorized | Missing or invalid `auth.userId` |
| `404` | Not Found | Resource doesn't exist or ownership mismatch |
| `500` | Server Error | Unexpected errors (caught exceptions) |

### 5.4 Query Parameters (Transactions)

**Pattern** (from `transactions.ts`):
```typescript
// GET /api/transactions?from=2024-01-01&to=2024-12-31&accountId=abc123
.get("/",
  zValidator("query", z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    accountId: z.string().optional(),
  })),
  clerkMiddleware(),
  async (c) => {
    const { from, to, accountId } = c.req.valid("query");

    const data = await db.select().from(transactions)
      .where(and(
        eq(transactions.userId, auth.userId),
        accountId ? eq(transactions.accountId, accountId) : undefined,
        from ? gte(transactions.date, new Date(from)) : undefined,
        to ? lte(transactions.date, new Date(to)) : undefined,
      ));
  }
)
```

---

## 6. State Management

### 6.1 React Query (Server State)

**Location**: `/features/{feature}/api/use-{action}-{feature}.ts`

**Pattern**:
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";

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
      // CRITICAL: Always invalidate cache
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => toast.error("Error creating account"),
  });
};
```

**Key Points**:
- Use `InferResponseType`/`InferRequestType` for type safety
- Always invalidate cache on success: `queryClient.invalidateQueries()`
- Show toast notifications (sonner)
- Reference: `features/accounts/api/use-create-account.ts`

### 6.2 Zustand (Client UI State)

**Location**: `/features/{feature}/hooks/use-{action}-{feature}.ts`

**Pattern** (Modal open/close):
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

**Pattern** (Edit modal with ID):
```typescript
type OpenAccountState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenAccount = create<OpenAccountState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
```

### 6.3 Type-Safe Client

**File**: `/lib/hono.ts`

```typescript
import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
```

---

## 7. Known Issues & Gotchas

### Active Bugs (from TODO.md)

| Issue | File/Location | Symptoms | Status |
|-------|---------------|----------|--------|
| Amount update bug | `features/transactions/components/transaction-form.tsx` + `app/api/[[...route]]/transactions.ts` (PATCH endpoint) | Incorrect amount when updating transaction | 🔴 Open |
| Sheet placeholder not updating | All `features/*/components/*-sheet.tsx` | Placeholder doesn't refresh when reopening sheet after name change | 🔴 Open |

### Common Gotchas

**DO**:
- ✅ Always use `convertAmountToMiliUnits` before API submission
- ✅ Always use `convertAmountFromMiliUnits` for display
- ✅ Filter ALL queries by `auth.userId`
- ✅ Invalidate React Query cache after mutations
- ✅ Register new sheets in `/providers/sheet-provider.tsx`
- ✅ Use CUID2 (`createId()`) for ID generation
- ✅ Verify ownership before UPDATE/DELETE

**DON'T**:
- ❌ Don't use float/double for amounts (integers only)
- ❌ Don't skip userId validation in API endpoints
- ❌ Don't convert amounts multiple times (common bug)
- ❌ Don't forget to export `AppType` from route.ts
- ❌ Don't bypass Zod validation
- ❌ Don't expose data from other users

### Form Handling Pattern

**Flow**:
1. Define Zod schema from Drizzle: `createInsertSchema(table)`
2. React Hook Form with `zodResolver`
3. Convert amounts before submission
4. Connect to React Query mutation

**Pattern**:
```typescript
const formSchema = insertAccountSchema.pick({ name: true });
type FormValues = z.input<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues,
});

// Form submission
const handleSubmit = (values: FormValues) => {
  onSubmit(values);  // Passed from parent component
};
```

**Reference**: `features/accounts/components/account-form.tsx`

### Sheet Registration Checklist

When adding a new modal/sheet:
1. Create `new-{feature}-sheet.tsx` component
2. Import in `/providers/sheet-provider.tsx`
3. Add to JSX: `<NewFeatureSheet />`
4. Ensure Zustand hook exists: `use-new-{feature}.ts`

---

## 8. Quick Commands

```bash
# Development
bun dev                  # Start dev server (localhost:3000)
bun run build            # Production build
bun run lint             # Run Biome linter

# Database
bun run db:generate      # Generate migration from schema
bun run db:migrate       # Apply pending migrations
bun run db:studio        # Open Drizzle Studio (DB GUI)

# Testing
bun run cypress:open     # Interactive E2E tests
bun run test:e2e         # Headless E2E tests
```

### Package Management (Use Bun, NOT npm)

```bash
bun install              # Install dependencies
bun add <package>        # Add package
bun add -d <package>     # Add dev dependency
bun remove <package>     # Remove package
bun outdated             # Check for updates
```

**Critical**: Always use `bun`, never `npm` or `yarn`. Lock file is `bun.lock`.

---

## 9. Environment Variables

**Required** (from `.env.example`):
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DB_CONNECTION_URL=
PLAID_CLIENT_ID=
PLAID_SECRET=
```

---

## 10. Naming Conventions

### Files
- Components: PascalCase (`AccountForm.tsx`)
- Hooks: kebab-case with prefix (`use-create-account.ts`)
- API routes: kebab-case (`accounts.ts`)

### Functions
- React Query: `use{Action}{Resource}` (`useCreateAccount`)
- Zustand: `use{Action}{Resource}` (`useNewAccount`)
- Components: PascalCase (`AccountForm`)
- Utilities: camelCase (`convertAmountToMiliUnits`)

### Database
- Tables: plural lowercase (`accounts`, `categories`)
- Columns: camelCase in schema, snake_case in DB
- Foreign keys: `{resource}Id` (`accountId`, `categoryId`)

---

## 11. Key Utilities (lib/utils.ts)

```typescript
// Amount conversion (CRITICAL)
convertAmountToMiliUnits(10.50)      // → 10500
convertAmountFromMiliUnits(10500)    // → 10.50

// Currency formatting
formatCurrency(10.50)                 // → "€ 10.50"

// Percentage calculation
calculatePercentageChange(120, 100)  // → 20

// Date formatting
formatDateRange({ from: date1, to: date2 })  // → "Jan 01 - Jan 31, 2024"
```

---

## Summary

**Critical for AI Assistants**:
1. **Amount handling**: Always × 1000 for storage, convert for display (known bug area)
2. **Security**: Filter ALL queries by `userId`, verify ownership before UPDATE/DELETE
3. **Feature structure**: `api/` (React Query) + `hooks/` (Zustand) + `components/`
4. **Type safety**: Use Hono RPC client with `InferResponseType`/`InferRequestType`
5. **Validation**: Drizzle schema → Zod → React Hook Form / Hono `zValidator`
6. **Cache**: Always invalidate React Query cache on mutations

**Reference implementations**: See `features/accounts/` and `app/api/[[...route]]/accounts.ts` for canonical patterns.
