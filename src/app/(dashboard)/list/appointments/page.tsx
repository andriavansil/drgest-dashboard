// import Pagination from "@/components/Pagination"
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch"
// import { parentsData, role } from "@/lib/data"
// import {SlidersHorizontal, ArrowDownWideNarrow, Plus, View, Trash, Pencil, Download, ClipboardClock} from "lucide-react"
// import Link from "next/link";
// import FormModal from "@/components/FormModal";

// type Appointment = {
//   id: number;
//   name: string;
//   students: string;
//   phone: string;
//   address: string;
//   email: string;
// };

// const columns = [
//   {
//     header: "Data/Hora",
//     accessor: "name",
//     className: "p-4",
//   },
//   /*{
//     header: "Última Consulta",
//     accessor: "email",
//     className: "p-4 hidden lg:table-cell",
//   },*/
//   {
//     header: "Paciente",
//     accessor: "students",
//     className: "p-4 hidden md:table-cell",
//   },
//   {
//     header: "Tipo",
//     accessor: "phone",
//     className: "p-4 hidden md:table-cell",
//   },
//   {
//     header: "Estado",
//     accessor: "address",
//     className: "p-4 hidden lg:table-cell",
//   },
//   {
//     header: "Ações",
//     accessor: "action",
//     className: "p-4",
//   },
// ];

// const AppointmentListPage = () => {

//     const renderRow = (item: Appointment) => (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 text-sm hover:bg-slate-50"
//     >
//       <td className="p-4">{item.name}</td>
//       <td className="hidden md:table-cell p-4">{item.students}</td>
//       <td className="hidden md:table-cell p-4"><span className={`badge ${item.phone === '1234567890' ? 'badge-office' : 'badge-home'}`}>{item.phone === '234567899' ? 'Consultório' : 'Domicílio'}</span></td>
//       {/* <td className="hidden lg:table-cell p-4">{item.address}</td> */}
//       <td className="hidden lg:table-cell p-4">{item.email}</td>
//       <td>
//         <div className="flex items-center gap-2">
//           <Link href={`/list/pacients/${item.id}`}>
//             <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ciano" title="Ver Detalhes">
//               <View size={16} />
//             </button>
//           </Link>
//           <Link href={`/list/pacients/${item.id}`}>
//             <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-400" title="Editar">
//               <Pencil size={16} />
//             </button>
//           </Link>
//           <Link href={`/list/pacients/${item.id}`}>
//             <button className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500" title="Descarregar PDF">
//               <Download size={16} />
//             </button>
//           </Link>
//           {role === "med" && (
//             //  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500" title="Eliminar">
//             //   <Trash size={16} />
//             // </button>
             
//             <FormModal table="consulta" type="delete" id={item.id}/>
//           )}
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="bg-white rounded-md flex-1 m-4 mt-0">
//       {/* TOP */}
//       <div className="flex items-center justify-between p-4">
//         <h1 className="hidden md:block text-lg font-semibold">Todas as Consultas</h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Filtrar">
//               <SlidersHorizontal size={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Ordenar">
//               <ArrowDownWideNarrow width={14} height={14} />
//             </button>
//             {role === "med" && (
//               //  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Agendar Consulta">
//               //    <ClipboardClock width={14} height={14} />
//               //  </button>
//               <FormModal table="consulta" type="schedule"/>
//             )}
//             {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Adicionar Consulta">
//               <Plus width={14} height={14} />
//             </button> */}
//             <FormModal table="consulta" type="create"/>
//           </div>
//         </div>
//       </div>
//       {/* LIST */}
//       <Table columns={columns} renderRow={renderRow} data={parentsData} />
//       {/* PAGINATION */}
//       <Pagination />
//     </div>
//   )
// }

// export default AppointmentListPage