import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role, teachersData } from "@/lib/data"
import {SlidersHorizontal, ArrowDownWideNarrow, Plus, View, Trash, Pencil, Download} from "lucide-react"
import Link from "next/link";
import FormModal from "@/components/FormModal";
Import { Appointment } from "@prisma/client";
Import { ITEM_PER_PAGE } from "@/lib/settings"

type PatientList = Patient & { appointment: Appointment[]} & {status:Status} & {userId:User};

const columns = [
  {
    header: "Nome",
    accessor: "name",
    className: "p-4",
  },
  {
    header: "Data de Nascimento",
    accessor: "birthdate",
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
      <td className="hidden md:table-cell p-4">{item.birthdate}</td>
      <td className="hidden md:table-cell p-4">{item.contact}</td>
      <td className="hidden lg:table-cell p-4">{item.address}</td>
      <td className="hidden lg:table-cell p-4">
        {new Intl.DateTimeFormat("pt-BR").format(item.lastAppointment.date)}
        {item.lastAppointment.time.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/pacients/${item.id}`}>
            <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Ver Detalhes">
              <View size={16} />
            </button>
          </Link>
          {/*<Link href={`/list/pacients/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-400" title="Editar">
              <Pencil size={16} />
            </button>
          </Link>*/}
          <FormModal table="paciente" type="update" id={item.id}/>
          <Link href={`/list/pacients/${item.id}`}>
            <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Descarregar PDF">
              <Download size={16} />
            </button>
          </Link>
          {role === "med" && (
             //<button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500" title="Eliminar">
              // <Trash size={16} />
             //</button>             
            <FormModal table="paciente" type="delete" id={item.id}/>
          )}
        </div>
      </td>
    </tr>
  );

const PacientListPage = async ({searchParams}:{ searchParams: { [key: string]: string | undefined)} => {

  const {page, ...queryParams} = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION

  const query: Prisma.PatientWhereInput= {};
  
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "appointment":
            query.appointment = { appointmentId: value },
            };
            break;
          case "search":
            query.OR = [
              { patient: { name: { contains: value, mode: "insensitive" } } },
              { patient: { birthdate: { contains: value, mode: "insensitive" } } },
              { patient: { contact: { contains: value, mode: "insensitive" } } },
              { patient: { adress: { contains: value, mode: "insensitive" } } },
              { appointment: { lastAppointment: { contains: value } } },
            ];
            break;
          default:
            query.userId  = { contains: value };
            break;
        }
      }
    }
  }
  
  {/*console.log(searchParams)*/}
   const [data, count] = await prisma.§transaction([
    prisma.patient.findMany ({
     where: query,
      include:{
         appointment: {select: { date: true, time:true } },
         status: {select: { nome: true },
      },
    take:ITEM_PER_PAGE,
    skip:ITEM_PER_PAGE * (p - 1),
   });
    prisma.patient.count(),
  ]);
  const count = await prisma.patient.count(where:query)

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between p-4">
        <h1 className="hidden md:block text-lg font-semibold">Lista de Pacientes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Filtrar">
              <SlidersHorizontal size={14} />
            </button>
            <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Ordenar">
              <ArrowDownWideNarrow width={14} height={14} />
            </button>
            
            <FormModal table="paciente" type="create"/>
            {/*
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Adicionar Paciente">
                  <Plus width={14} height={14} />
                </button>
            */}
          </div>
        </div>
      </div>  
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={d} />
      {/* PAGINATION */}
      <Pagination page={p} count={count}/>
    </div>
  )
}

export default PacientListPage
