import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#ff5b00"];

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export function RadialVariant({ data = [] }: Props) {
  return (
    <ResponsiveContainer height={350} width="100%">
      <RadialBarChart
        barSize={10}
        cx="50%"
        cy="30%"
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))}
        innerRadius={"90%"}
        outerRadius={"40%"}
      >
        <RadialBar
          background
          dataKey={"value"}
          label={{ fill: "#fff", position: "insideStart", fontSize: "12px" }}
        />
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
                        {formatCurrency(entry.payload.value)}
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
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
