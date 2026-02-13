import { format } from "date-fns";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import CustomTooltip from "./custom-tooltip";

interface Props {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

export function BarVariant({ data }: Props) {
  return (
    <ResponsiveContainer height={350} width="100%">
      <BarChart data={data}>
        <CartesianGrid opacity={0.6} strokeDasharray={"3 3"} />
        <XAxis
          axisLine={false}
          dataKey="date"
          style={{ fontSize: "12px" }}
          tickFormatter={(date) => format(date, "dd MMM")}
          tickLine={false}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />

        <Bar className="drop-shadow-sm" dataKey="income" fill="#5ec269" />
        <Bar className="drop-shadow-sm" dataKey="expenses" fill="#f43f5e" />
      </BarChart>
    </ResponsiveContainer>
  );
}
