"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import App from "next/app";

const schema = z.object({
  id_paciente: z.string().min(1, { message: "Paciente é obrigatório" }),
  data: z.date({ message: "Data da consulta é obrigatória" }),
  hora: z.string({ message: "Hora da consulta é obrigatória" }),
  tipo: z.enum(["consultorio", "domicilio"], {
    message: "Tipo é obrigatório",
  }),
  local: z.string().optional(),
  motivo: z.string().min(1, { message: "Motivo é obrigatório" }),
  diagnostico: z.string().min(1, {
    message: "Diagnóstico é obrigatório",
  }),
  observacoes: z.string().optional(),
  idStatus: z.string().min(1, {
    message: "Status é obrigatório",
  }),
}).refine((data) => {
  if (data.tipo === "domicilio") {
    return !!data.local && data.local.length > 0;
  }
  return true;
}, {
  message: "Local é obrigatório para consultas ao domicílio",
  path: ["local"],
});

type Inputs = z.infer<typeof schema>;

const AppointmentForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    //defaultValues: data,
  });

  const tipo = useWatch({
    control,
    name: "tipo",
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Nova Consulta" : "Editar Consulta"}
      </h1>

      {/* Paciente (autocomplete depois) */}
      <div>
        <label>Paciente</label>
        <input {...register("id_paciente")} />
        {errors.id_paciente && <p>{errors.id_paciente.message}</p>}
      </div>

      {/* Data */}
      <div>
        <label>Data</label>
        <input type="datetime-local" {...register("data")} />
        {errors.data && <p>{errors.data.message}</p>}
      </div>

      {/* Hora */}
      <div>
        <label>Hora</label>
        <input type="time" {...register("hora")} />
        {errors.hora && <p>{errors.hora.message}</p>}
      </div>

      {/* Tipo */}
      <div>
        <label>Tipo</label>
        <select {...register("tipo")}>
          <option value="">Selecionar</option>
          <option value="consultorio">Consultório</option>
          <option value="domicilio">Domicílio</option>
        </select>
        {errors.tipo && <p>{errors.tipo.message}</p>}
      </div>

      {/* Local (condicional) */}
      {tipo === "domicilio" && (
        <div>
          <label>Local</label>
          <input {...register("local")} />
          {errors.local && <p>{errors.local.message}</p>}
        </div>
      )}

      {/* Motivo */}
      <div>
        <label>Motivo</label>
        <textarea {...register("motivo")} />
        {errors.motivo && <p>{errors.motivo.message}</p>}
      </div>

      {/* Diagnóstico */}
      <div>
        <label>Diagnóstico</label>
        <textarea {...register("diagnostico")} />
        {errors.diagnostico && <p>{errors.diagnostico.message}</p>}
      </div>

      {/* Observações */}
      <div>
        <label>Observações</label>
        <textarea {...register("observacoes")} />
      </div>

      {/* Status */}
      <div>
        <label>Status</label>
        <select {...register("idStatus")}>
          <option value="">Selecionar</option>
          <option value="1">Agendada</option>
          <option value="2">Realizada</option>
          <option value="3">Cancelada</option>
        </select>
        {errors.idStatus && <p>{errors.idStatus.message}</p>}
      </div>

      <button className="bg-blue-500 text-white p-2 rounded">
        {type === "create" ? "Criar" : "Atualizar"}
      </button>
    </form>
  );
};

export default AppointmentForm;