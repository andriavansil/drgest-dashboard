"use client";

import { getAppointmentsByDate } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type AppointmentWithPatient = {
  id: number;
  date: Date;
  patient: { name: string };
};

const EventList = () => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const [data, setData] = useState<AppointmentWithPatient[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const date = dateParam ? new Date(dateParam) : new Date();
      const appointments = await getAppointmentsByDate(date);
      setData(appointments);
      setLoading(false);
    };

    fetchEvents();
  }, [dateParam]);

  if (loading) {
    return (
      <div className="p-5 rounded-md border-2 border-gray-100">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-ciano/20 border-t-ciano rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 border-t-lamaSky">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-600">Sem consultas para este dia</h1>
        </div>
      </div>
    );
  }
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