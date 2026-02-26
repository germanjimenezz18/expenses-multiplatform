# Testing de hooks API: enfoque recomendado (React Query + Vitest)

## Objetivo
Definir un patrón de tests **más realista, estable y mantenible** para hooks de API en frontend.

## ¿Qué enfoque adoptamos?
1. Ejecutar mutaciones con `mutateAsync` en lugar de `mutate`.
2. Encapsular mutaciones dentro de `await act(async () => { ... })`.
3. En casos de error esperados, usar aserciones explícitas:
   - `await expect(result.current.mutateAsync(...)).rejects.toThrow()`
4. Mantener aserciones de comportamiento de producto:
   - invalidación de cache (`invalidateQueries`)
   - toasts (`toast.success` / `toast.error`)
   - estado de hook (`isSuccess` / `isError`)

## ¿Por qué es mejor práctica?

### 1) Refleja mejor la realidad del cliente
En runtime real, la mutación es asíncrona y puede fallar/rechazar. `mutateAsync` modela ese contrato directamente y evita “falsos positivos” por no esperar correctamente la promesa.

### 2) Menos flaky tests
Al esperar explícitamente la promesa de mutación y usar `act` async, React puede drenar actualizaciones de estado en orden correcto. Esto reduce carreras entre render, mutación y assertions.

### 3) Errores más explícitos y útiles
`rejects.toThrow()` deja claro que el rechazo es **esperado** en ese escenario. Es mejor que capturar con `catch(() => {})`, porque ese patrón puede ocultar errores no deseados.

### 4) Señal fuerte de intención
- Caso feliz: la mutación **debe resolver**.
- Caso de error: la mutación **debe rechazar**.
Ese contrato queda documentado en el propio test.

### 5) Menor ruido de entorno React
Con `IS_REACT_ACT_ENVIRONMENT = true` en setup, se elimina el warning de entorno de `act(...)` y los resultados son más consistentes.

## Patrón recomendado

### Caso éxito
```ts
await act(async () => {
  await result.current.mutateAsync(payload);
});

await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

### Caso error
```ts
await act(async () => {
  await expect(result.current.mutateAsync(payloadInvalido)).rejects.toThrow();
});

await waitFor(() => expect(result.current.isError).toBe(true));
```

## Anti-patrones a evitar
- `await result.current.mutateAsync(...).catch(() => {})` en tests de error (silencia errores reales).
- Disparar `mutate` sin esperar ciclo async y luego afirmar inmediatamente.
- Confiar solo en `isError` sin validar que la promesa realmente rechazó.

## Checklist para nuevos tests de mutación
- [ ] Usar `mutateAsync` (no `mutate`) en tests.
- [ ] Encapsular en `await act(async () => ...)`.
- [ ] En error-path, usar `rejects.toThrow()`.
- [ ] Verificar toast correcto.
- [ ] Verificar invalidaciones correctas de query keys.
- [ ] Verificar estado final (`isSuccess` o `isError`).

## Nota
Este documento aplica especialmente a hooks en `features/*/api` con React Query y Vitest.
