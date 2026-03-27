"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { X, Clock, MapPin, Stethoscope, FileText, Activity } from "lucide-react";

const schema = z.object({
  id_paciente: z.string().min(1, { message: "Paciente é obrigatório" }),
  data: z.string().min(1, { message: "Data da consulta é obrigatória" }),
  hora: z.string().min(1, { message: "Hora da consulta é obrigatória" }),
  tipo: z.enum(["consultorio", "domicilio"], {
    message: "Tipo é obrigatório",
  }),
  local: z.string().optional(),
  motivo: z.string().min(1, { message: "Motivo é obrigatório" }),
  diagnostico: z.string().optional(),
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

const AppointmentForm = ({ 
  type, 
  data, 
  onClose 
}: { 
  type: "create" | "update"; 
  data?: any; 
  onClose?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      id_paciente: data?.id_paciente || "",
      data: data?.data || "",
      hora: data?.hora || "",
      tipo: data?.tipo || "",
      local: data?.local || "",
      motivo: data?.motivo || "",
      diagnostico: data?.diagnostico || "",
      observacoes: data?.observacoes || "",
      idStatus: data?.idStatus || "",
    },
  });

  const tipo = useWatch({
    control,
    name: "tipo",
  });

  const onSubmit = handleSubmit(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    onClose?.();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 z-10 sticky">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ciano/10 rounded-lg">
            <Stethoscope className="w-5 h-5 text-ciano" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {type === "create" ? "Nova Consulta" : "Editar Consulta"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {type === "create" ? "Agendar nova consulta" : "Editar dados da consulta"}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paciente */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Paciente <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              {...register("id_paciente")}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                         focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                         transition-all duration-200 outline-none
                         hover:border-gray-300"
              placeholder="Nome do paciente"
              defaultValue={data?.id_paciente}
            />
          </div>
          {errors.id_paciente && (
            <p className="text-xs text-red-500">{errors.id_paciente.message}</p>
          )}
        </div>

        {/* Data */}
        <InputField
          label="Data da Consulta"
          name="data"
          type="date"
          defaultValue={data?.data}
          register={register}
          error={errors?.data}
          required
        />

        {/* Hora */}
        <InputField
          label="Hora da Consulta"
          name="hora"
          type="time"
          defaultValue={data?.hora}
          register={register}
          error={errors?.hora}
          required
        />

        {/* Tipo */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Tipo <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              {...register("tipo")}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                         focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                         transition-all duration-200 outline-none appearance-none
                         bg-white cursor-pointer hover:border-gray-300"
            >
              <option value="">Selecionar tipo</option>
              <option value="consultorio">Consultório</option>
              <option value="domicilio">Domicílio</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.tipo && (
            <p className="text-xs text-red-500">{errors.tipo.message}</p>
          )}
        </div>

        {/* Local (condicional) */}
        {tipo === "domicilio" && (
          <div className="animate-fadeIn">
            <InputField
              label="Local"
              name="local"
              defaultValue={data?.local}
              register={register}
              error={errors?.local}
              required
            />
          </div>
        )}

        {/* Status */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Status <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              {...register("idStatus")}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                         focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                         transition-all duration-200 outline-none appearance-none
                         bg-white cursor-pointer hover:border-gray-300"
            >
              <option value="">Selecionar status</option>
              <option value="1">Agendada</option>
              <option value="2">Realizada</option>
              <option value="3">Cancelada</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          {errors.idStatus && (
            <p className="text-xs text-red-500">{errors.idStatus.message}</p>
          )}
        </div>

        {/* Motivo */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Motivo <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register("motivo")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={2}
            defaultValue={data?.motivo}
            placeholder="Descreva o motivo da consulta..."
          />
          {errors.motivo?.message && (
            <p className="text-xs text-red-500">{errors.motivo.message.toString()}</p>
          )}
        </div>

        {/* Diagnóstico */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Diagnóstico</label>
          <textarea
            {...register("diagnostico")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={2}
            defaultValue={data?.diagnostico}
            placeholder="Diagnóstico do paciente..."
          />
          {errors.diagnostico?.message && (
            <p className="text-xs text-red-500">{errors.diagnostico.message.toString()}</p>
          )}
        </div>

        {/* Observações */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Observações</label>
          <textarea
            {...register("observacoes")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={3}
            defaultValue={data?.observacoes}
            placeholder="Observações adicionais sobre a consulta..."
          />
          {errors.observacoes?.message && (
            <p className="text-xs text-red-500">{errors.observacoes.message.toString()}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 
                       font-medium hover:bg-gray-50 hover:border-gray-300 
                       transition-all duration-200"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg bg-ciano text-white font-medium
                     hover:bg-ciano/90 active:scale-95 
                     transition-all duration-200 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:active:scale-100
                     flex items-center gap-2 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>A processar...</span>
            </>
          ) : (
            <>
              <span>{type === "create" ? "Criar Consulta" : "Salvar Alterações"}</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  );
};

export default AppointmentForm;