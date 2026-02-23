"use client";

import { format } from "date-fns";
import { Loader2, Plus, Save, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { AmountInput } from "@/components/amount-input";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import {
  convertAmountFromMiliUnits,
  convertAmountToMiliUnits,
  formatCurrency,
} from "@/lib/utils";
import { useBulkCreateBalances } from "../api/use-bulk-create-balances";
import { useOpenBalanceTracker } from "../hooks/use-open-balance-tracker";

interface AccountWithBalances {
  id: string;
  name: string;
  type: string;
  balance: number;
  lastCheckedBalance: number | null;
  lastCheckedDate: string | null;
  expectedBalance: number;
}

interface BalanceEntry {
  accountId: string;
  accountName: string;
  balance: string;
  note: string;
  date: Date;
}

export default function BalanceTrackerSheet() {
  const { isOpen, onClose } = useOpenBalanceTracker();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [balances, setBalances] = useState<BalanceEntry[]>([]);

  const bulkMutation = useBulkCreateBalances();

  const accountsQuery = useGetAccounts();
  const accounts = (accountsQuery.data ?? []) as AccountWithBalances[];
  const isLoading = accountsQuery.isLoading;

  // Sync balances when accounts load and sheet is open
  useEffect(() => {
    if (isOpen && accounts.length > 0 && balances.length === 0) {
      setBalances(
        accounts.map((acc) => ({
          accountId: acc.id,
          accountName: acc.name,
          balance: acc.lastCheckedBalance
            ? convertAmountFromMiliUnits(acc.lastCheckedBalance).toString()
            : "0",
          note: "",
          date: new Date(),
        }))
      );
    }
  }, [isOpen, accounts, balances.length]);

  const handleOpen = (open: boolean) => {
    if (!open) {
      setCurrentStep(0);
      setShowSummary(false);
      setBalances([]);
    }
  };

  const updateBalance = (field: keyof BalanceEntry, value: string | Date) => {
    setBalances((prev) =>
      prev.map((b, i) => (i === currentStep ? { ...b, [field]: value } : b))
    );
  };

  const handleNext = () => {
    if (currentStep < accounts.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveAll = () => {
    const balancesToSave = balances
      .filter((b) => b.balance && b.balance !== "0")
      .map((b) => ({
        accountId: b.accountId,
        balance: convertAmountToMiliUnits(Number.parseFloat(b.balance) || 0),
        date: b.date.toISOString(),
        note: b.note || null,
      }));

    if (balancesToSave.length > 0) {
      bulkMutation.mutate(
        { balances: balancesToSave },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const currentAccount = accounts[currentStep];
  const currentBalance = balances[currentStep];
  const hasBalancesToSave = balances.some(
    (b) => b.balance && b.balance !== "0"
  );

  const isLastStep = currentStep === accounts.length - 1;
  const canGoBack = currentStep > 0 || showSummary;

  return (
    <Sheet onOpenChange={handleOpen} open={isOpen}>
      <SheetContent
        className="flex h-[85vh] flex-col sm:max-w-xl"
        side="bottom"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Wallet className="size-5" />
            Balance Tracker
          </SheetTitle>
          <SheetDescription>
            Update the balance for all your accounts
          </SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && accounts.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            No accounts found. Create an account first.
          </div>
        )}

        {!isLoading && accounts.length > 0 && showSummary && (
          <SummaryView
            balances={balances}
            hasBalancesToSave={hasBalancesToSave}
            isPending={bulkMutation.isPending}
            onBack={handlePrevious}
            onSave={handleSaveAll}
          />
        )}

        {!isLoading &&
          accounts.length > 0 &&
          !showSummary &&
          currentAccount &&
          currentBalance && (
            <StepView
              account={currentAccount}
              balance={currentBalance}
              canGoBack={canGoBack}
              currentStep={currentStep}
              isLastStep={isLastStep}
              onBack={handlePrevious}
              onNext={handleNext}
              totalSteps={accounts.length}
              updateBalance={updateBalance}
            />
          )}
      </SheetContent>
    </Sheet>
  );
}

function StepView({
  currentStep,
  totalSteps,
  account,
  balance,
  onBack,
  onNext,
  isLastStep,
  canGoBack,
  updateBalance,
}: {
  currentStep: number;
  totalSteps: number;
  account: AccountWithBalances;
  balance: BalanceEntry;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  canGoBack: boolean;
  updateBalance: (field: keyof BalanceEntry, value: string | Date) => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden pt-4">
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-muted-foreground">{account.name}</span>
        </div>
        <Progress value={((currentStep + 1) / totalSteps) * 100} />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Last checked</p>
              <p className="font-medium">
                {account.lastCheckedBalance
                  ? formatCurrency(
                      convertAmountFromMiliUnits(account.lastCheckedBalance)
                    )
                  : "No data"}
              </p>
              {account.lastCheckedDate && (
                <p className="text-muted-foreground text-xs">
                  {format(new Date(account.lastCheckedDate), "MMM dd, yyyy")}
                </p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground">Expected balance</p>
              <p className="font-medium">
                {formatCurrency(
                  convertAmountFromMiliUnits(account.expectedBalance)
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="font-medium text-sm">Date</span>
            <DatePicker
              onChange={(date) => date && updateBalance("date", date)}
              value={balance.date}
            />
          </div>

          <div className="space-y-2">
            <span className="font-medium text-sm">Balance</span>
            <AmountInput
              onChange={(value) => updateBalance("balance", value || "")}
              placeholder="0.00"
              value={balance.balance}
            />
          </div>

          <div className="space-y-2">
            <span className="font-medium text-sm">Note (optional)</span>
            <Textarea
              onChange={(e) => updateBalance("note", e.target.value)}
              placeholder="e.g. Monthly reconciliation"
              value={balance.note}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <Button disabled={!canGoBack} onClick={onBack} variant="outline">
          Previous
        </Button>
        <Button className="flex-1" onClick={onNext}>
          {isLastStep ? (
            <>Review Changes</>
          ) : (
            <>
              Continue <Plus className="ml-2 size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function SummaryView({
  balances,
  onBack,
  onSave,
  isPending,
  hasBalancesToSave,
}: {
  balances: BalanceEntry[];
  onBack: () => void;
  onSave: () => void;
  isPending: boolean;
  hasBalancesToSave: boolean;
}) {
  const entriesToSave = balances.filter((b) => b.balance && b.balance !== "0");

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto pt-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Summary</h3>
        <p className="text-muted-foreground text-sm">
          Review your balance updates before saving
        </p>
      </div>

      <div className="space-y-3 rounded-md border p-4">
        {entriesToSave.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No balances to save
          </p>
        ) : (
          entriesToSave.map((balance) => (
            <div
              className="flex items-center justify-between border-b py-2 last:border-0"
              key={balance.accountId}
            >
              <div>
                <p className="font-medium">{balance.accountName}</p>
                <p className="text-muted-foreground text-sm">
                  {format(balance.date, "MMM dd, yyyy")}
                  {balance.note && ` - ${balance.note}`}
                </p>
              </div>
              <p className="font-semibold">
                {formatCurrency(Number.parseFloat(balance.balance) || 0)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <Button className="flex-1" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={isPending || !hasBalancesToSave}
          onClick={onSave}
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          Save All
        </Button>
      </div>
    </div>
  );
}
