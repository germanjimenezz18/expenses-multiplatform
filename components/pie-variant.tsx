import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatPercentage } from "@/lib/utils";
import CategoryTooltip from "./category-tooltip";

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#ff5b00"];

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export function PieVariant({ data = [] }: Props) {
  return (
    <ResponsiveContainer height={300} width="100%">
      <PieChart>
        <Legend
          align="right"
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload.map((entry: any, index: number) => (
                  <li
                    className="flex items-center space-x-2"
                    key={`item-${index}`}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="space-x-1">
                      <span className="text-muted-foreground text-sm">
                        {entry.value}
                      </span>
                      <span className="text-sm">
                        {formatPercentage(entry.payload.percent * 100)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
          iconType="circle"
          layout="horizontal"
          verticalAlign="bottom"
        />
        <Tooltip content={<CategoryTooltip />} />
        <Pie
          cx="50%"
          cy="50%"
          data={data}
          dataKey="value"
          fill="#8884d8"
          innerRadius={60}
          labelLine={false}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_entry, index) => {
            console.log({ data });
            return (
              <Cell
                fill={COLORS[index % COLORS.length]}
                key={`cell-${index}`}
              />
            );
          })}
        </Pie>
        <Tooltip
          formatter={(value: number | undefined) =>
            value !== undefined ? formatPercentage(value) : ""
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
