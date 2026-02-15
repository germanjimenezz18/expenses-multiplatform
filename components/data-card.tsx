import { cva, type VariantProps } from "class-variance-authority";
import CountUp from "react-countup";
import type { IconType } from "react-icons";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Skeleton } from "./ui/skeleton";

const boxVariant = cva(
  "shrink-0 rounded-md border p-2 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-blue-500/20 bg-blue-500/20 hover:bg-blue-500/30",
        success:
          "border-emerald-500/20 bg-emerald-500/20 hover:bg-emerald-500/30",
        danger: "border-rose-500/20 bg-rose-500/20 hover:bg-rose-500/30",
        warning: "border-yellow-500/20 bg-yellow-500/20 hover:bg-yellow-500/30",
      },
      defaultVariants: {
        variant: "default",
      },
    },
  }
);
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
    <Card className={` ${className} `}>
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="">
          <CardTitle className="line-clamp-1 text-xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        {/* <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div> */}
      </CardHeader>

      <CardContent>
        <h1 className="mt-2 mb-2 line-clamp-1 break-all font-bold text-2xl">
          <CountUp
            decimalPlaces={2}
            decimals={2}
            end={value}
            formattingFn={formatCurrency}
            preserveValue
            start={0}
          />
        </h1>
        <p
          className={cn(
            "line-clamp-1 text-muted-foreground text-sm",
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
    <Card className="h-[192px] drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mt-2 mb-2 h-10 w-24 shrink-0" />
        <Skeleton className="h-4 w-40 shrink-0" />
      </CardContent>
    </Card>
  );
};
