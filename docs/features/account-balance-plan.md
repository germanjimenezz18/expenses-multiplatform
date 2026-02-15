# Plan: Sistema de Chequeo de Balance para Cuentas

## Resumen
Implementar un sistema de "chequeo de balance" que permite registrar balances reales de cuentas, compararlos con el balance teórico (calculado desde transacciones), y mantener un historial de verificaciones.

## Concepto
- **Balance actual**: Último registro de la tabla `account_balances`
- **Balance esperado**: Balance anterior + suma de transacciones desde ese chequeo
- **Chequeo**: Acción manual del usuario para confirmar/ajustar el balance real

---

## Fase 1: Base de Datos

### 1.1 Nueva tabla `account_balances` en `/db/schema.ts`

```typescript
export const accountBalances = pgTable("account_balances", {
  id: text("id").primaryKey(),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  balance: integer("balance").notNull(), // miliUnits (x1000)
  note: text("note"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  userId: text("user_id").notNull(),
});
```

### 1.2 Relaciones
- Agregar `accountBalancesRelations` (one → account)
- Actualizar `accountsRelations` para incluir `balances: many(accountBalances)`

### 1.3 Ejecutar migraciones
```bash
bun run db:generate
bun run db:migrate
```

---

## Fase 2: API Backend

### 2.1 Nuevo endpoint `/app/api/[[...route]]/account-balances.ts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET `/` | Query: `accountId`, `limit` | Lista historial de balances |
| GET `/latest/:accountId` | | Último balance registrado |
| GET `/expected/:accountId` | | Balance teórico calculado |
| POST `/` | Body: `date, accountId, balance, note` | Crear chequeo |
| PATCH `/:id` | | Editar chequeo |
| DELETE `/:id` | | Eliminar chequeo |

**Endpoint `/expected/:accountId` (crítico)**:
1. Obtener último balance registrado (lastBalance, lastDate)
2. Sumar transacciones desde lastDate: `SUM(amount) WHERE date > lastDate`
3. Retornar: `lastBalance + sumTransactions`

### 2.2 Registrar en `/app/api/[[...route]]/route.ts`
```typescript
.route("/account-balances", accountBalances)
```

### 2.3 Modificar `/app/api/[[...route]]/accounts.ts`
Actualizar GET `/` para incluir:
- `lastCheckedBalance`: Último balance registrado
- `lastCheckedDate`: Fecha del último chequeo
- `expectedBalance`: Balance teórico actual

---

## Fase 3: React Query Hooks

### 3.1 Crear `/features/account-balances/api/`

| Archivo | Propósito |
|---------|-----------|
| `use-get-account-balances.ts` | Lista historial por cuenta |
| `use-get-latest-balance.ts` | Último balance |
| `use-get-expected-balance.ts` | Balance teórico |
| `use-create-account-balance.ts` | Crear chequeo |
| `use-edit-account-balance.ts` | Editar chequeo |
| `use-delete-account-balance.ts` | Eliminar chequeo |

### 3.2 Invalidación de cache
Al mutar: invalidar `["account-balances"]`, `["accounts"]`

---

## Fase 4: Estado UI (Zustand)

### 4.1 Crear `/features/account-balances/hooks/`

| Archivo | Estado |
|---------|--------|
| `use-new-account-balance.ts` | `{ isOpen, accountId, onOpen, onClose }` |
| `use-open-account-balance.ts` | `{ id, isOpen, onOpen, onClose }` |

---

## Fase 5: Componentes UI

### 5.1 Crear `/features/account-balances/components/`

| Componente | Descripción |
|------------|-------------|
| `account-balance-form.tsx` | Formulario: fecha, cuenta, balance, nota |
| `new-account-balance-sheet.tsx` | Modal para nuevo chequeo |
| `edit-account-balance-sheet.tsx` | Modal para editar chequeo |
| `balance-history-table.tsx` | Tabla de historial (para fila expandible) |
| `balance-comparison-card.tsx` | Card: actual vs esperado con diferencia |

### 5.2 Registrar sheets en `/providers/sheet-provider.tsx`

---

## Fase 6: Refactor UI de Cuentas

### 6.1 Modificar `/app/dashboard/accounts/columns.tsx`

Nuevas columnas:
- **Balance Actual**: `formatCurrency(convertAmountFromMiliUnits(lastCheckedBalance))`
- **Último Chequeo**: Fecha formateada o "Nunca"
- **Balance Esperado**: Con indicador de diferencia (verde/rojo)
- **Botón expandir**: Para ver historial

### 6.2 Modificar DataTable o crear componente dedicado
Soporte para filas expandibles usando `getExpandedRowModel` de TanStack Table.

### 6.3 Contenido de fila expandida
- `BalanceHistoryTable`: Últimos N chequeos
- `BalanceComparisonCard`: Comparación actual vs esperado
- Botón "Nuevo Chequeo"

---

## Archivos Críticos a Modificar

| Archivo | Cambios |
|---------|---------|
| `/db/schema.ts` | + tabla `accountBalances`, + relaciones |
| `/app/api/[[...route]]/account-balances.ts` | Nuevo archivo (CRUD + expected) |
| `/app/api/[[...route]]/route.ts` | + registro de ruta |
| `/app/api/[[...route]]/accounts.ts` | Modificar GET para incluir balance data |
| `/app/dashboard/accounts/columns.tsx` | + columnas de balance |
| `/app/dashboard/accounts/page.tsx` | Soporte para filas expandibles |
| `/providers/sheet-provider.tsx` | + nuevos sheets |

---

## Verificación

### Tests manuales
1. Crear cuenta nueva → verificar balance = 0
2. Crear primer chequeo con balance 1000€
3. Crear transacción de +100€
4. Verificar balance esperado = 1100€
5. Crear segundo chequeo con balance 1150€ (con nota "intereses")
6. Verificar historial muestra ambos chequeos
7. Editar/eliminar chequeo → verificar actualización

### Comandos de verificación
```bash
bun run dev          # Probar en localhost:3000
bun run build        # Verificar build sin errores
bun run lint         # Verificar linting
bun run db:studio    # Verificar datos en DB
```

---

## Consideraciones

- **Seguridad**: Filtrar SIEMPRE por `userId` en queries
- **Amounts**: Usar `convertAmountToMiliUnits` antes de API, `convertAmountFromMiliUnits` para display
- **Primera cuenta**: Si no hay chequeos, balance = 0 y expected = suma de todas las transacciones
