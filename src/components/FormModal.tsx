"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { deleteAppointment, deletePatient } from "@/lib/actions";

const deleteActionMap = {
  paciente: deletePatient,
  consulta: deleteAppointment,
};

const AppointmentForm = dynamic(() => import("./forms/AppointmentForm"), {
  loading: () => <LoadingSpinner />,
});
const PacientForm = dynamic(() => import("./forms/PacientForm"), {
  loading: () => <LoadingSpinner />,
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-ciano/20 border-t-ciano rounded-full animate-spin" />
  </div>
);

const forms: {
  [key: string]: (type: "create" | "update", data?: any, onClose?: () => void) => JSX.Element;
} = {
  paciente: (type, data, onClose) => <PacientForm type={type} data={data} onClose={onClose} />,
  consulta: (type, data, onClose) => <AppointmentForm type={type} data={data} onClose={onClose} />
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "paciente" | "consulta";
  type: "create" | "schedule" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const [open, setOpen] = useState(false);

  const getButtonStyle = () => {
    const baseStyle = "p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95";
    if (type === "create") return `${baseStyle} bg-ciano text-white hover:bg-ciano/90 shadow-sm`;
    if (type === "update") return `${baseStyle} bg-ciano text-white hover:bg-ciano/90 shadow-sm`;
    return `${baseStyle} bg-red-500 text-white hover:bg-red-600 shadow-sm`;
  };

  const getIcon = () => {
    if (type === "create") return <Plus size={18} />;
    if (type === "update") return <Pencil size={18} />;
    return <Trash size={18} />;
  };

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} eliminado com sucesso!`);
        //onClose?.();
        router.refresh();
      }
    }, [state, router]);

    if (type === "delete" && id) {
      return (
        <form action={formAction} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-red-100 p-4 rounded-full animate-pulse">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <div>
              <input type="text | number" name="id" value={id}  hidden/>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Eliminar Registo
              </h2>
              {table === "paciente" ? (
                <p className="text-sm text-gray-500 max-w-sm">
                  Tem a certeza que deseja eliminar este paciente? 
                  Todas as consultas associadas a este paciente também foram eliminadas.
                </p>
              ) : (
                <p className="text-sm text-gray-500 max-w-sm">
                  Tem a certeza que deseja eliminar esta consulta? 
                  Esta ação não pode ser desfeita.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 
                         font-medium hover:bg-gray-50 hover:border-gray-300 
                         transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium
                         hover:bg-red-700 transition-all duration-200 shadow-sm
                         flex items-center gap-2"
            >
              <Trash size={16} />
              Eliminar
            </button>
          </div>
        </form>
      );
    }
    
    if (type === "create" || type === "update") {
      return forms[table](type, data, () => setOpen(false));
    }
    
    return (
      <div className="p-8 text-center text-gray-500">
        Formulário não encontrado
      </div>
    );
  };

  return (
    <>
      <button
        className={getButtonStyle()}
        onClick={() => setOpen(true)}
        title={type === "create" ? "Adicionar" : type === "update" ? "Editar" : "Eliminar"}
      >
        {getIcon()}
      </button>

      {open && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                     flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] 
                          overflow-y-auto animate-slideUp">
            <div className="top-0 bg-white px-6 py-4 
                           flex justify-end">
            </div>
            <div className="px-6 pb-6">
              <Form />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default FormModal;