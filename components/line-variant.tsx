import { format } from "date-fns";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import CustomTooltip from "./custom-tooltip";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export function LineVariant({ data }: Props) {
  return (
    <ResponsiveContainer height={350} width="100%">
      <LineChart data={data}>
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

        <Line
          className="drop-shadow-sm"
          dataKey="income"
          dot={false}
          stroke="#5ec269"
          strokeWidth={2}
        />
        <Line
          className="drop-shadow-sm"
          dataKey="expenses"
          dot={false}
          stroke="#f43f5e"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
