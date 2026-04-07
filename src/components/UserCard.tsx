import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: "pacientes" | "consultas hoje" | "ações pendentes";
}) => {
  const { userId } = auth();
  const currentUserId = userId!; // 🔥 mete aqui o real

  let count = 0;

  if (type === "pacientes") {
    count = await prisma.patient.count({
      where: {
        userId: currentUserId,
      },
    });
  }

  if (type === "consultas hoje") {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    count = await prisma.appointment.count({
      where: {
        userId: currentUserId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  if (type === "ações pendentes") {
    count = await prisma.syncLog.count({
      where: {
        userId: currentUserId,
        syncStatus: false, // pendente
      },
    });
  }

  return (
    <div className="rounded-2xl odd:bg-turquesaescuro even:bg-ciano p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {new Date().getFullYear()}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>

      <h1 className="text-xl font-semibold my-4">
        {count.toLocaleString("pt-PT")}
      </h1>

      <h2 className="capitalize text-xs font-medium text-white">
        {type}
      </h2>
    </div>
  );

  {/*
    return (
      <div className="rounded-2xl odd:bg-turquesaescuro even:bg-ciano p-4 flex-1 min-w-[130px]">
        <div className="flex justify-between items-center">
          <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
            2026
          </span>
          <Image src="/more.png" alt="" width={20} height={20} />
        </div>
        <h1 className="text-xl font-semibold my-4">1,234</h1>
        <h2 className="capitalize text-xs font-medium text-white">{type}</h2>
      </div>
    );
    */}
};

export default UserCard;