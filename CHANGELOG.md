# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Balance Tracker Sheet**: New multi-account balance tracking feature with stepper UI
  - Sheet opens from header (wallet icon) or accounts page
  - Step-by-step form: one account per step with auto-advance
  - Shows last checked balance and expected balance for each account
  - Summary view before saving all balances at once
  - Bulk save functionality via new `POST /api/account-balances/bulk-create` endpoint
  - Button disabled when no accounts exist

### New Files
- `features/account-balances/hooks/use-open-balance-tracker.ts` - Zustand state for balance tracker sheet
- `features/account-balances/api/use-bulk-create-balances.ts` - React Query mutation for bulk creating balances
- `features/account-balances/components/balance-tracker-sheet.tsx` - Main component with stepper UI

### Modified Files
- `app/api/[[...route]]/account-balances.ts` - Added `POST /bulk-create` endpoint
- `providers/sheet-provider.tsx` - Registered BalanceTrackerSheet component
- `components/header.tsx` - Added wallet icon button to open balance tracker
- `app/dashboard/accounts/page.tsx` - Added "Track Balances" button (disabled if no accounts)

### API Changes
- `POST /api/account-balances/bulk-create` - Create multiple balance records at once
  - Request body: `{ balances: [{ accountId, balance, date, note }] }`
  - Validates all accounts belong to user before creating
