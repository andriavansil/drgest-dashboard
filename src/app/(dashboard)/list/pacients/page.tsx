import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import {SlidersHorizontal, ArrowDownWideNarrow, Plus, View, Trash, Pencil, Download} from "lucide-react"
import Link from "next/link";
import FormModal from "@/components/FormModal";
import prisma from "@/lib/prisma";
import { Patient, Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";

//type PatientList = Patient & { appointment: Appointment[]} & {status:Status} & {userId:User};
type PatientList = Patient & {
  appointments: { date: Date }[];
  status: { id: number; name: string };
};

const { sessionClaims } = auth();
const role = (sessionClaims?.metadata as { role?: string })?.role;

const columns = [
  {
    header: "Nome",
    accessor: "name",
    className: "p-4",
  },
  {
    header: "Data de Nascimento",
    accessor: "birthday",
    className: "p-4 hidden md:table-cell",
  },
  {
    header: "Contacto",
    accessor: "contact",
    className: "p-4 hidden md:table-cell",
  },
  {
    header: "Morada",
    accessor: "address",
    className: "p-4 hidden lg:table-cell",
  },
  {
    header: "Última Consulta",
    accessor: "lastAppointment",
    className: "p-4 hidden lg:table-cell",
  },
  {
    header: "Ações",
    accessor: "action",
    className: "p-4",
  },
];

const renderRow = (item: PatientList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm hover:bg-slate-50"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell p-4">{new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "short",
      }).format(item.birthday)}</td>
      <td className="hidden md:table-cell p-4">{item.contact}</td>
      <td className="hidden lg:table-cell p-4">{item.address}</td>
    <td className="hidden lg:table-cell p-4">
    {item.appointments[0]
      ? new Intl.DateTimeFormat("pt-PT", {
          dateStyle: "short",
        }).format(item.appointments[0].date)
      : "—"}
    </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "med-pro" && (
            <Link href={`/list/pacients/${item.id}`}>
              <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Ver Detalhes">
                <View size={16} />
              </button>
            </Link>
          )}

          {/*<Link href={`/list/pacients/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-400" title="Editar">
              <Pencil size={16} />
            </button>
          </Link>*/}
          
          <FormModal table="paciente" type="update" data={item}/>
          <Link href={`/list/pacients/${item.id}`}>
            <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Descarregar PDF">
              <Download size={16} />
            </button>
          </Link>
          <FormModal table="paciente" type="delete" id={item.id}/>
        </div>
      </td>
    </tr>
  );

const PacientListPage = async ({searchParams}:{ searchParams: { [key: string]: string | undefined}}) => {

  const {userId} = auth();
  const {page, ...queryParams} = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION

  const query: Prisma.PatientWhereInput = {
    userId: userId!,
  };
  
  if (queryParams) {
    const filters: Prisma.PatientWhereInput[] = [];
  
    for (const [key, value] of Object.entries(queryParams)) {
      if (!value) continue;
  
      switch (key) {
        case "search":
          filters.push({
            OR: [
              {
                name: {
                  contains: value,
                  mode: "insensitive",
                },
              },
              {
                contact: {
                  contains: value,
                  mode: "insensitive",
                },
              },
              {
                address: {
                  contains: value,
                  mode: "insensitive",
                },
              },              
            ],
          });
          break;
  
        case "status":
          filters.push({
            statusId: parseInt(value),
          });
          break;
  
        case "hasAppointments":
          filters.push({
            appointments: {
              some: {},
            },
          });
          break;
      }
    }
  
    if (filters.length > 0) {
      query.AND = filters;
    }
  }
  
  const [data, count] = await prisma.$transaction([
    prisma.patient.findMany({
      where: query,
      include: {
        appointments: {
          orderBy: { date: "desc" },
          take: 1,
          select: { date: true },
        },
        status: {
          select: { id: true, name: true },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        name: "asc",
      },
    }),
    prisma.patient.count({ where: query }),
  ]);

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-4">
      {/* TOP */}
      <div className="flex items-center justify-between p-4">
        <h1 className="hidden md:block text-lg font-semibold">Lista de Pacientes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
          {role === "med-pro" && (
            <>
              <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Filtrar">
                <SlidersHorizontal size={14} />
              </button>
              <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Ordenar">
                <ArrowDownWideNarrow width={14} height={14} />
              </button>
            </>
          )}            

            <FormModal table="paciente" type="create"/>
          </div>
        </div>
      </div>  
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count}/>
    </div>
  )
}

export default PacientListPage