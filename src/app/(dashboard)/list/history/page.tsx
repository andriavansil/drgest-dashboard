import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role } from "@/lib/data"
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { AuditLog, Prisma } from "@prisma/client";
import {SlidersHorizontal, ArrowDownWideNarrow, Plus, View, Trash, Pencil, Download} from "lucide-react"

type HistoryList = AuditLog & {
  status: { id: number; name: string };
};

const columns = [
  {
    header: "Data/Hora",
    accessor: "createdAt",
    className: "p-4",
  },
  {
    header: "Ação",
    accessor: "action",
    className: "p-4",
  },
  {
    header: "Tabela",
    accessor: "entityType",
    className: "p-4",
  },
  {
    header: "Descrição",
    accessor: "details",
    className: "p-4 hidden lg:table-cell",
  },
];

const actionMap = {
  CREATE: "Criado",
  UPDATE: "Atualizado",
  DELETE: "Eliminado",
};

const entityMap = {
  Patient: "Paciente",
  Appointment: "Consulta",
};

const renderRow = (item: HistoryList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 text-sm hover:bg-slate-50"
  >
    <td className="p-4">
      {new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(item.createdAt)}
    </td>

    <td className="p-4 hidden md:table-cell">
      <span className={`badge ${
        item.action === "DELETE"
          ? "badge-red"
          : item.action === "UPDATE"
          ? "badge-yellow"
          : "badge-green"
      }`}>
        {actionMap[item.action as keyof typeof actionMap] || item.action}
      </span>

    </td>

    <td className="hidden lg:table-cell p-4">
      {entityMap[item.entityType as keyof typeof entityMap] || item.entityType}
    </td>

    <td className="p-4">
      {item.details}
    </td>
  </tr>
);

const HistoryListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { userId } = auth();
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.AuditLogWhereInput = {
    userId: userId!,
  };

  if (queryParams) {
    const filters: Prisma.AuditLogWhereInput[] = [];

    for (const [key, value] of Object.entries(queryParams)) {
      if (!value) continue;

      switch (key) {
        case "search":
          filters.push({
            OR: [
              {
                action: {
                  contains: value,
                  mode: "insensitive",
                },
              },
              {
                entityType: {
                  contains: value,
                  mode: "insensitive",
                },
              },
              {
                details: {
                  contains: value,
                  mode: "insensitive",
                },
              },
            ],
          });
          break;

        case "entity":
          filters.push({
            entityType: value,
          });
          break;
      }
    }

    if (filters.length > 0) {
      query.AND = filters;
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.auditLog.count({ where: query }),
  ]);

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-4">
      {/* TOP */}
      <div className="flex items-center justify-between p-4">
        <h1 className="hidden md:block text-lg font-semibold">Registo de Alterações</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
          {role === "med-pro" && (
            <>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Filtrar">
                <SlidersHorizontal size={14} />
              </button>
              
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Ordenar">
                <ArrowDownWideNarrow width={14} height={14} />
              </button>
            </>
          )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default HistoryListPage