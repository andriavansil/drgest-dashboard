"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ Homens, Mulheres }: { Homens: number; Mulheres: number }) => {

const data = [
  {
    name: "Total",
    count: Homens + Mulheres,
    fill: "white",
  },
  {
    name: "Mulheres",
    count: Mulheres,
    fill: "#27bac1",
  },
  {
    name: "Homens",
    count: Homens,
    fill: "#035e68",
  },
];

  return (
    <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/gender.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
    </div>
  );
};

export default CountChart;