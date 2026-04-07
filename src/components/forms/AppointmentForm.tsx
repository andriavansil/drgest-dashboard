"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import InputField from "../InputField";
import { X, Clock, MapPin, Stethoscope, FileText, Activity } from "lucide-react";
import { appointmentSchema } from "@/lib/formValidationSchemas";
import { createAppointment, updateAppointment, getPatientsForUser } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import z from "zod";

const AppointmentForm = ({ 
  type, 
  data, 
  onClose 
}: { 
  type: "create" | "update"; 
  data?: any; 
  onClose?: () => void;
}) => {
  const [patients, setPatients] = useState<{ id: number; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
  });

  const tipo = useWatch({
    control,
    name: "type",
  }); 

const [state, formAction] = useFormState(type === "create" ? createAppointment : updateAppointment, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit(async (data) => {
    const parsedData = appointmentSchema.parse(data);
        formAction(parsedData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      type === "create" ? toast.success("Consulta criada com sucesso!") : toast.success("Consulta atualizada com sucesso!");
      onClose?.();
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    const fetchPatients = async () => {
      const patientList = await getPatientsForUser();
      setPatients(patientList);
    };
    fetchPatients();
  }, []);

const formatLocalDateTime =  (date: string | Date): string => {
  const d = new Date(date)

  const pad = (n: number): string => String(n).padStart(2, "0")

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

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
            <select
              {...register("pacienteId")}
              defaultValue={data?.patientId?.toString() ?? ""} // Garante que o valor padrão seja uma string
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                         focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                         transition-all duration-200 outline-none appearance-none
                         bg-white cursor-pointer hover:border-gray-300"
            >
              <option value="">Selecione um paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id.toString()}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          {errors.pacienteId && (
            <p className="text-xs text-red-500">{errors.pacienteId.message}</p>
          )}
        </div>

        {/* Data */}
        <InputField
          label="Data e hora da Consulta"
          name="date"
          type="datetime-local"
          defaultValue= {data?.date ? formatLocalDateTime(data.date) : ""} // Formata a data para o formato YYYY-MM-DDTHH:MM
          register={register}
          error={errors?.date}
          required
        />

        {/* Hora
        <InputField
          label="Hora da Consulta"
          name="time"
          type="time"
          defaultValue={data?.date ? `${data.date.getHours().toString().padStart(2, "0")}:${data.date.getMinutes().toString().padStart(2, "0")}` : ""} // Formata a hora para o formato HH:MM
          register={register}
          error={errors?.time}
          required
        /> */}

        {/* Tipo */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Tipo <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              {...register("type")}
              defaultValue={data?.type}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                         focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                         transition-all duration-200 outline-none appearance-none
                         bg-white cursor-pointer hover:border-gray-300"
            >
              <option value="">Selecionar tipo</option>
              <option value="CONSULTORIO">Consultório</option>
              <option value="DOMICILIO">Domicílio</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.type && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>

        {/* Local (condicional) */}
        
            <div>
              <InputField
                label="Local"
                name="local"
                defaultValue={data?.local}
                register={register}
                error={errors?.local}
                required={tipo === "DOMICILIO"}
              />
            </div>
        

        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        {/* Status */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Status <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              {...register("idStatus")}
              defaultValue={data?.statusId}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                         focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                         transition-all duration-200 outline-none appearance-none
                         bg-white cursor-pointer hover:border-gray-300"
            >
              <option value="">Selecionar status</option>
              <option value="2">Agendada</option>
              <option value="3">Realizada</option>
              <option value="4">Cancelada</option>
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
            {...register("reason")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={2}
            defaultValue={data?.reason}
            placeholder="Descreva o motivo da consulta..."
          />
          {errors.reason?.message && (
            <p className="text-xs text-red-500">{errors.reason.message.toString()}</p>
          )}
        </div>

        {/* Diagnóstico */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Diagnóstico</label>
          <textarea
            {...register("diagnosis")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={2}
            defaultValue={data?.diagnosis}
            placeholder="Diagnóstico do paciente..."
          />
          {errors.diagnosis?.message && (
            <p className="text-xs text-red-500">{errors.diagnosis.message.toString()}</p>
          )}
        </div>

        {/* Observações */}
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Observações</label>
          <textarea
            {...register("observations")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={3}
            defaultValue={data?.observations}
            placeholder="Observações adicionais sobre a consulta..."
          />
          {errors.observations?.message && (
            <p className="text-xs text-red-500">{errors.observations.message.toString()}</p>
          )}
        </div>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Erro!</p>
          <p>Ocorreu um erro ao {type === "create" ? "criar" : "atualizar"} a consulta.</p>
        </div>
      )}
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