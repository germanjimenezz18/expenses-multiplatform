import { FileSearch } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AreaVariant from "./area-variant";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export default function Chart({ data = [] }: Props) {
  return (
    <Card className="drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-2 lg:flex-row lg:items-center justify-between ">
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>
        {/* Todo add select */}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data for this period
            </p>
          </div>
        ) : (
          <AreaVariant data={data} />
        )}
      </CardContent>
    </Card>
  );
}
