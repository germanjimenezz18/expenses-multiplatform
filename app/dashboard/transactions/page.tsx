import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionsPageContent from "./transactions-page-content";

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <div className="w-full max-w-screen-1xl">
            <Card className="drop-shadow-sm">
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="flex h-[500px] w-full items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-slate-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <TransactionsPageContent />
    </Suspense>
  );
}
