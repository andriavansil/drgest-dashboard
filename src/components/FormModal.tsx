"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import {Plus, View, Trash, Pencil, Download, ClipboardClock, X, AlertTriangle } from "lucide-react";

// USE LAZY LOADING

import TeacherForm from "./forms/TeacherForm";
import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/AppointmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/PacientForm"), {
  loading: () => <h1>Loading...</h1>,
});

 const forms: {
   [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
 } = {
   pacient: (type, data) => <PacientForm type={type} data={data} />,
   appoointment: (type, data) => <AppointmentForm type={type} data={data} />
 };

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "paciente"
    | "consulta";
  type: "create" | "schedule" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-ciano"
      : type === "update"
      ? "bg-ciano"
      : "bg-ciano";

  const [open, setOpen] = useState(false);

const Form = () => {
  return type === "delete" && id ? (
    <form className="p-6 flex flex-col gap-5">
      
      {/* Ícone + título */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="bg-red-100 text-red-600 p-3 rounded-full">
          <AlertTriangle size={28} />
        </div>

        <h2 className="text-lg font-semibold text-gray-800">
          Eliminar registo
        </h2>

        <p className="text-sm text-gray-500 max-w-sm">
          Tem a certeza que deseja eliminar este registo? Esta ação não pode ser desfeita.
        </p>
      </div>

      {/* Botões */}
      <div className="flex justify-center gap-3 mt-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Eliminar
        </button>
      </div>
    </form>
  ) : type === "create" || type === "update" ? (
    forms[table](type, data)
  ) : (
    "Formulário não encontrado!"
  );
};

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {type === "create"
          ? <Plus size={16} />
          : type === "update"
          ? <Pencil size={16} />
          : <Trash size={16} />
        }
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X size={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
