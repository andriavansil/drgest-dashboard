import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { parentsData, role } from "@/lib/data"
import {SlidersHorizontal, ArrowDownWideNarrow, Plus, View, Trash, Pencil, Download, ClipboardClock} from "lucide-react"
import Link from "next/link";
import FormModal from "@/components/FormModal";
Import { Appointment } from "@prisma/client";
Import { ITEM_PER_PAGE } from "@/lib/settings"

type AppointmentList = Appointment & { patient:Patient[] } & { status:Status[] & {userId:User}} ;

 const columns = [
   {
     header: "Data/Hora",
     accessor: "datetime",
     className: "p-4",
   },
   {
     header: "Paciente",
     accessor: "patient",
     className: "p-4 hidden md:table-cell",
   },
   {
     header: "Tipo",
     accessor: "type",
     className: "p-4 hidden md:table-cell",
   },
   {
     header: "Estado",
     accessor: "status",
     className: "p-4 hidden lg:table-cell",
   },
   {
     header: "Ações",
     accessor: "action",
     className: "p-4",
   },
 ];

const renderRow = (item: AppointmentList) => (
     <tr
       key={item.id}
       className="border-b border-gray-200 text-sm hover:bg-slate-50"
     >
       <td className="p-4">
        {item.date}
        {new Intl.DateTimeFormat("pt-BR").format(item.date)}
       </td>
       <td className="hidden md:table-cell p-4">{item.patient.map(patient=> patient.name)}</td>
       <td className="hidden md:table-cell p-4"><span className={`badge ${item.type === 'Consultório' ? 'badge-office' : 'badge-home'}`}>{item.type}</span></td>
       {/* <td className="hidden lg:table-cell p-4">{item.address}</td> */}
       <td className="hidden lg:table-cell p-4">{item.map(status=> status.name)}</td>
       <td>
         <div className="flex items-center gap-2">
          {item.status.nome === "med" && (
           <>
            <Link href={`/list/pacients/${item.id}`}>
             
              <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Ver Detalhes">
                <View size={16} />
              </button>
            </Link>
           </>
          )}
           {/*<Link href={`/list/pacients/${item.id}`}>
             <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-400" title="Editar">
               <Pencil size={16} />
             </button>
           </Link>*/}

           <FormModal table="consulta" type="update" id={item.id}/>

           <Link href={`/list/pacients/${item.id}`}>
             <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Descarregar PDF">
               <Download size={16} />
             </button>
           </Link>
           
           <FormModal table="consulta" type="delete" id={item.id}/>
           {/*
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500" title="Eliminar">
               <Trash size={16} />
            </button>
           */}
         </div>
       </td>
     </tr>
);

const AppointmentListPage = async ({searchParams}:{ searchParams: { [key: string]: string | undefined)} => {

  const {page, ...queryParams} = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION

  const query: Prisma.AppointmentWhereInput= {};
  
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "patient":
            query.status = {
              some: {
                statusId: parseInt(value),
              },
            };
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            query.OR = [
              { appointment: { datetime: { contains: value, mode: "insensitive" } } },
              { patient: { nome: { contains: value, mode: "insensitive" } } },
              { appointment: { type: { contains: value, mode: "insensitive" } } },
              { status: { name: { contains: value, mode: "insensitive" } } },
            ];         
            break;
        }
      }
    }
  }
  
  {/*console.log(searchParams)*/}
   const [data, count] = await prisma.§transaction([
    prisma.appointment.findMany ({
     where: query,
      include:{
         patient: {select: { nome: true } },
         status: {select: { nome: true } },
      },
    take:ITEM_PER_PAGE,
    skip:ITEM_PER_PAGE * (p - 1),
   });
    prisma.appointment.count(),
  ]);
  const count = await prisma.appointment.count(where:query)
  // console.log(data)
    
   return (
     <div className="bg-white rounded-md flex-1 m-4 mt-0">
       {/* TOP */}
       <div className="flex items-center justify-between p-4">
         <h1 className="hidden md:block text-lg font-semibold">Todas as Consultas</h1>
         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
           <TableSearch />
           <div className="flex items-center gap-4 self-end">
             <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Filtrar">
               <SlidersHorizontal size={14} />
             </button>
             <button className="p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-ciano text-white hover:bg-ciano/90 shadow-sm" title="Ordenar">
               <ArrowDownWideNarrow width={14} height={14} />
             </button>
             {/*
               //  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Agendar Consulta">
               //    <ClipboardClock width={14} height={14} />
               //  </button>
             */}
             {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Adicionar Consulta">
               <Plus width={14} height={14} />
             </button> */}
             <FormModal table="consulta" type="create"/>
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

 export default AppointmentListPage
