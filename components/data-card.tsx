import { IconType } from "react-icons";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Skeleton } from "./ui/skeleton";

const boxVariant = cva("shrink-0 border rounded-md p-2 transition-colors duration-200", {
  variants: {
    variant: {
      default: "bg-blue-500/20 border-blue-500/20 hover:bg-blue-500/30",
      success: "bg-emerald-500/20 border-emerald-500/20 hover:bg-emerald-500/30",
      danger: "bg-rose-500/20 border-rose-500/20 hover:bg-rose-500/30",
      warning: "bg-yellow-500/20 border-yellow-500/20 hover:bg-yellow-500/30",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});
const iconVariant = cva("size-5", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-emerald-500",
      danger: "fill-rose-500",
      warning: "fill-yellow-500",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
  className?: string;
}
export default function DataCard({
  icon: Icon,
  title,
  value = 0,
  variant,
  dateRange,
  percentageChange = 0,
  className,
}: DataCardProps) {
  return (
    <Card className={` drop-shadow-lg ${className} `}>
      <CardHeader className="flex flex-row items-center justify-between gap-x-4  rounded-lg rounded-b-none bg-muted/50">
        <div className="">
          <CardTitle className="text-2xl line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>

      <CardContent>
        <h1 className="font-bold text-2xl mt-2 mb-2  line-clamp-1 break-all">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          /> 
        </h1>
        <p
          className={cn(
            "text-muted-foreground text-sm line-clamp-1",
            percentageChange > 0 && "text-emerald-500",
            percentageChange < 0 && "text-rose-500"
          )}
        >
          {formatPercentage(percentageChange, { addPrefix: true })} from last
          period
        </p>
      </CardContent>
    </Card>
  );
}

export const DataCardLoading = () => {
  return (
    <Card className=" drop-shadow-sm h-[192px]">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mt-2 mb-2" />
        <Skeleton className="shrink-0 h-4 w-40 " />
      </CardContent>
    </Card>
  );
};
