import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { announcementsData, role } from "@/lib/data"
import {SlidersHorizontal, ArrowDownWideNarrow, Plus, View, Trash, Pencil, Download} from "lucide-react"

type Appointment = {
  id: number;
  title: string;
  class: string;
  date: string;
};

const columns = [
  {
    header: "Data/Hora",
    accessor: "date",
    className: "p-4",
  },
  {
    header: "Tipo",
    accessor: "class",
    className: "p-4 hidden md:table-cell",
  },
  {
    header: "Descrição",
    accessor: "title",
    className: "p-4",
  },
];

const HistoryListPage = () => {

    const renderRow = (item: Appointment) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm hover:bg-slate-50"
    >
      <td className="p-4">{item.date}</td>
      <td className="p-4 hidden md:table-cell"><span className={`badge ${item.class === '4A ' ? 'badge-office' : 'badge-home'}`}>{item.class === '4A' ? 'Paciiente' : 'Consulta'}</span></td>
      {/* <td className="hidden lg:table-cell p-4">{item.address}</td> */}
      <td className="p-4">{item.title}</td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between p-4">
        <h1 className="hidden md:block text-lg font-semibold">Registo de Alterações</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Filtrar">
              <SlidersHorizontal size={14} />
            </button>
            {role === "med" && (
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-turquesaescuro" title="Ordenar">
              <ArrowDownWideNarrow width={14} height={14} />
            </button>
              //<FormModal table="teacher" type="create"/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={announcementsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  )
}

export default HistoryListPage