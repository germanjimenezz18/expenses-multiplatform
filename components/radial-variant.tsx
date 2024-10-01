import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatCurrency, formatPercentage } from "@/lib/utils";
import CategoryTooltip from "./category-tooltip";

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#ff5b00"];

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export function RadialVariant({ data = [] }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        cx="50%"
        cy="30%"
        barSize={10}
        innerRadius={"90%"}
        outerRadius={"40%"}
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))}
      >
        <RadialBar
          background
          dataKey={"value"}
          label={{ fill: "#fff", position: "insideStart", fontSize: "12px" }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload.map((entry: any, index: number) => (
                  <li
                    key={`item-${index}`}
                    className="flex items-center space-x-2 "
                  >
                    <span
                      className=" size-2  rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.value}
                      </span>
                      <span className="text-sm">
                        {formatCurrency(entry.payload.value )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
