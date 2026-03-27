import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role, teachersData } from "@/lib/data"
import {SlidersHorizontal, ArrowDownWideNarrow, Plus, View, Trash, Pencil, Download} from "lucide-react"
import Link from "next/link";
import FormModal from "@/components/FormModal";

type Teacher = {
  id: number;
  name: string;
  teacherId: string;
  phone: string;
  address: string;
  classes: string[];
};

const columns = [
  {
    header: "Nome",
    accessor: "name",
    className: "p-4",
  },
  {
    header: "Data de Nascimento",
    accessor: "teacherId",
    className: "p-4 hidden md:table-cell",
  },
  {
    header: "Contacto",
    accessor: "phone",
    className: "p-4 hidden md:table-cell",
  },
  {
    header: "Morada",
    accessor: "address",
    className: "p-4 hidden lg:table-cell",
  },
  {
    header: "Última Consulta",
    accessor: "classes",
    className: "p-4 hidden lg:table-cell",
  },
  {
    header: "Ações",
    accessor: "action",
    className: "p-4",
  },
];

const PacientListPage = () => {

    const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 text-sm hover:bg-slate-50"
    >
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell p-4">{item.teacherId}</td>
      <td className="hidden md:table-cell p-4">{item.phone}</td>
      <td className="hidden lg:table-cell p-4">{item.address}</td>
      <td className="hidden lg:table-cell p-4">{item.classes}</td>
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
      <Table columns={columns} renderRow={renderRow} data={teachersData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  )
}

export default PacientListPage