"use client";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import { Separator } from "./ui/separator";

export default function AccountTracker() {
  const accountsQuery = useGetAccounts();
  const transactionsQuery = useGetTransactions();

  const accounts = accountsQuery.data || [];
  const transactions = transactionsQuery.data || [];

  const accountsWithBalance = accounts.map((account) => {
    const balance = transactions
      .filter((transaction) => transaction.accountId === account.id)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { ...account, balance };
  });

  const totalAccountsBalance = accountsWithBalance.reduce(
    (acc, curr) => acc + curr.balance,
    0
  );

  return (
    <div className="">
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Account Tracker
              <Button
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                size="icon"
                variant="outline"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Account Resume</span>
              </Button>
            </CardTitle>
            <CardDescription>
              {" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button className="h-8 gap-1" size="sm" variant="outline">
              <Settings2 className="h-3.5 w-3.5" />
              <Link href="dashboard/accounts">
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Manage Accounts
                </span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8" size="icon" variant="outline">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Accounts Details</div>
            <ul className="grid gap-3">
              {accountsWithBalance ? (
                <ul className="grid gap-3">
                  {accountsWithBalance.map((account, index) => (
                    <li
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <span className="text-muted-foreground">
                        {account.name}
                      </span>
                      <span>{account.balance.toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center">
                  <Button
                    onClick={() => (window.location.href = "/create-account")}
                    variant="destructive"
                  >
                    Create Account
                  </Button>
                </div>
              )}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>$299.00</span>
              </li> */}
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$5.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$25.00</span>
              </li> */}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>{totalAccountsBalance.toFixed(2)} €</span>
              </li>
            </ul>
          </div>
          {/* <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Shipping Information</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>Liam Johnson</span>
                <span>1234 Main St.</span>
                <span>Anytown, CA 12345</span>
              </address>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Billing Information</div>
              <div className="text-muted-foreground">
                Same as shipping address
              </div>
            </div>
          </div> */}
          {/* <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Accounts Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>Liam Johnson</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">liam@acme.com</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">+1 234 567 890</a>
                </dd>
              </div>
            </dl>
          </div> */}
          {/* <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Payment Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Visa
                </dt>
                <dd>**** **** **** 4532</dd>
              </div>
            </dl>
          </div> */}
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-muted-foreground text-xs">
            Updated <time dateTime="2023-11-23"> Now</time>
          </div>
          <Pagination className="mr-0 ml-auto w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button className="h-6 w-6" size="icon" variant="outline">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous </span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button className="h-6 w-6" size="icon" variant="outline">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next </span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
