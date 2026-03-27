import Image from "next/image";
import { Search } from "lucide-react";

const TableSearch = () => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-lg ring-[1.5px] ring-gray-300 px-2">
      <Search size={14} color="grey" />
      <input
        type="text"
        placeholder="Pesquisar..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;