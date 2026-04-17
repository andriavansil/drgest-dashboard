import Image from "next/image";

const UserCard = ({
  type,
  count,
}: {
  type: "pacientes" | "consultas hoje" | "ações pendentes";
  count: number;
}) => {
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
};

export default UserCard;