import Image from "next/image";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import AttendanceChart from "./attendanceCharts";

const AttendanceChartContainer = async () => {
  const {userId} = auth();
  const currentUserId = userId!;
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const resData = await prisma.appointment.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
      userId: currentUserId,
    },
    select: {
      date: true,
      type: true,
    },
  });

  // console.log(data)

  const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  const attendanceMap: { [key: string]: { Consultório: number; Domicílio: number } } =
    {
      Seg: { Consultório: 0, Domicílio: 0 },
      Ter: { Consultório: 0, Domicílio: 0 },
      Qua: { Consultório: 0, Domicílio: 0 },
      Qui: { Consultório: 0, Domicílio: 0 },
      Sex: { Consultório: 0, Domicílio: 0 },
      Sáb: { Consultório: 0, Domicílio: 0 },
      Dom: { Consultório: 0, Domicílio: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayOfWeek = itemDate.getDay();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 7) {
      const dayName = daysOfWeek[dayOfWeek - 1];

      if (item.type === "CONSULTORIO") {
        attendanceMap[dayName].Consultório += 1;
      } else {
        attendanceMap[dayName].Domicílio += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    Consultório: attendanceMap[day].Consultório,
    Domicílio: attendanceMap[day].Domicílio,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Consultas</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data}/>
    </div>
  );
};

export default AttendanceChartContainer;