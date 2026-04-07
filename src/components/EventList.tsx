import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();
  const {userId} = auth();

  const data = await prisma.appointment.findMany({
    where: {
      userId: userId!,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
    include: {
      patient: {
        select: {
          name: true,
        },
      },
    },
  });

  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.patient.name}</h1>
        <span className="text-gray-300 text-xs">
          {event.date.toLocaleTimeString("pt-PT", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
    </div>
  ));
};

export default EventList;