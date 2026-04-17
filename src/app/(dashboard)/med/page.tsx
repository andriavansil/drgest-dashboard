import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import UserCard from "@/components/UserCard";
import CountChartContainer from "@/components/CounChartContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import Announcements from "@/components/Announcements";

const MedDashboardPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return <div>Não autenticado</div>;
  }

  // --- Data Fetching Centralizado ---

  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));

  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  lastMonday.setHours(0, 0, 0, 0);

  const [
    patientCount,
    appointmentsTodayCount,
    pendingActionsCount,
    patientGenderData,
    weeklyAppointments,
    recentActivities,
  ] = await Promise.all([
    // 1. Para UserCard "pacientes"
    prisma.patient.count({ where: { userId } }),

    // 2. Para UserCard "consultas hoje"
    prisma.appointment.count({
      where: {
        userId,
        date: { gte: startOfToday, lte: endOfToday },
      },
    }),

    // 3. Para UserCard "ações pendentes"
    prisma.syncLog.count({ where: { userId, syncStatus: false } }),

    // 4. Para CountChartContainer
    prisma.patient.groupBy({
      where: { userId },
      by: ["sex"],
      _count: true,
    }),

    // 5. Para AttendanceChartContainer
    prisma.appointment.findMany({
      where: {
        userId: userId,
        date: { gte: lastMonday },
      },
      select: { date: true, type: true },
    }),

    // 6. Para Announcements
    prisma.auditLog.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDs */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="pacientes" count={patientCount} />
          <UserCard type="consultas hoje" count={appointmentsTodayCount} />
          <UserCard type="ações pendentes" count={pendingActionsCount} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer data={patientGenderData} />
          </div>
          {/* ATTENDANCE */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer data={weeklyAppointments} />
          </div>
        </div>
        {/* ANNOUNCEMENTS - Movido para a coluna da esquerda para melhor layout */}
        <div className="lg:hidden">
           <Announcements data={recentActivities} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* CALENDAR */}
        <EventCalendarContainer />
        {/* ANNOUNCEMENTS */}
        <div className="hidden lg:block">
          <Announcements data={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default MedDashboardPage;