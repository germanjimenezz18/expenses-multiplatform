import { format } from "date-fns";

import {
  Tooltip,
  XAxis,
  Bar,
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CustomTooltip from "./custom-tooltip";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export function BarVariant({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray={"3 3"} opacity={0.6}/>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(date) => format(date, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
      <Tooltip content={<CustomTooltip />} />

      <Bar dataKey='income' fill="#5ec269" className="drop-shadow-sm"/>
      <Bar dataKey='expenses' fill="#f43f5e" className="drop-shadow-sm"/>

      
      </BarChart>



    </ResponsiveContainer>
  );
}
