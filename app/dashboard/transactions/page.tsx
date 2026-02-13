import { Suspense } from "react";
import TransactionsPageContent from "./transactions-page-content";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <div className="max-w-screen-1xl  w-full">
            <Card className=" drop-shadow-sm">
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full flex items-center justify-center">
                  <Loader2 className="size-6 text-slate-300 animate-spin" />
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
