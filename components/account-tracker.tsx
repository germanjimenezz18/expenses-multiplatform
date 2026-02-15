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
import { convertAmountFromMiliUnits, formatCurrency } from "@/lib/utils";
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

  const accounts = accountsQuery.data || [];

  const totalAccountsBalance = accounts.reduce(
    (total, account) => total + (account.lastCheckedBalance || 0),
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
              {accounts ? (
                <ul className="grid gap-3">
                  {accounts.map((account) => (
                    <li
                      className="flex items-center justify-between"
                      key={account.id}
                    >
                      <span className="text-muted-foreground">
                        {account.name}
                      </span>
                      <span>
                        {formatCurrency(
                          convertAmountFromMiliUnits(
                            account?.lastCheckedBalance || 0
                          )
                        )}
                      </span>
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
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>
                  {formatCurrency(
                    convertAmountFromMiliUnits(totalAccountsBalance)
                  )}
                </span>
              </li>
            </ul>
          </div>
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
