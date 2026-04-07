import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from '@/lib/utils';

const { userId } = auth();
const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "id";
  id: string | number;
}) => {
  const dataRes = await prisma.appointment.findMany({
    where: {
      userId: userId!,
    },
  });

  const data = dataRes.map((appointment) => ({
    title: appointment.reason || "No title",
    start: appointment.date,
    end: new Date(appointment.date.getTime() + 40 * 60 * 1000), // Assuming each appointment is 40 minutes long
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;