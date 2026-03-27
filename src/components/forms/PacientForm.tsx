"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { UserPlus, X, AlertCircle } from "lucide-react";

const schema = z.object({
  nome: z.string().min(1, { message: "O nome é obrigatório!" }),
  dataNascimento: z.string().min(1, { message: "Data de nascimento é obrigatória!" }),
  telemovel: z.string().min(1, { message: "Telemóvel é obrigatório!" }),
  morada: z.string().optional(),
  genero: z.enum(["masculino", "femenino"], { message: "Género é obrigatório!" }),
  antecedentes: z.string().optional(),
  observacoes: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const PacientForm = ({
  type,
  data,
  onClose,
}: {
  type: "create" | "update";
  data?: any;
  onClose?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: data?.nome || "",
      dataNascimento: data?.dataNascimento || "",
      telemovel: data?.telemovel || "",
      morada: data?.morada || "",
      genero: data?.genero || "",
      antecedentes: data?.antecedentes || "",
      observacoes: data?.observacoes || "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    onClose?.();
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 z-10 sticky">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ciano/10 rounded-lg">
            <UserPlus className="w-5 h-5 text-ciano" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {type === "create" ? "Novo Paciente" : "Editar Paciente"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {type === "create" ? "Adicione um novo paciente ao sistema" : "Atualize as informações do paciente"}
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

      {/* Campos do Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nome Completo"
          name="nome"
          defaultValue={data?.nome}
          register={register}
          error={errors?.nome}
          required
        />
        
        <InputField
          label="Data de Nascimento"
          name="dataNascimento"
          type="date"
          defaultValue={data?.dataNascimento}
          register={register}
          error={errors?.dataNascimento}
          required
        />
        
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Género <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                         focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                         transition-all duration-200 outline-none appearance-none
                         bg-white cursor-pointer hover:border-gray-300"
              {...register("genero")}
              defaultValue={data?.genero}
            >
              <option value="">Selecione o género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Feminino</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.genero?.message && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.genero.message.toString()}
            </p>
          )}
        </div>
        
        <InputField
          label="Telemóvel"
          name="telemovel"
          defaultValue={data?.telemovel}
          register={register}
          error={errors?.telemovel}
          required
        />
        
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Morada</label>
          <textarea
            {...register("morada")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={1}
            defaultValue={data?.morada}
          />
          {errors.morada?.message && (
            <p className="text-xs text-red-500">{errors.morada.message.toString()}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Antecedentes</label>
          <textarea
            {...register("antecedentes")}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       focus:border-ciano focus:ring-2 focus:ring-ciano/20 
                       transition-all duration-200 outline-none resize-none
                       hover:border-gray-300"
            rows={3}
            defaultValue={data?.antecedentes}
            placeholder="Doenças anteriores, alergias, histórico familiar..."
          />
          {errors.antecedentes?.message && (
            <p className="text-xs text-red-500">{errors.antecedentes.message.toString()}</p>
          )}
        </div>
        
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
            placeholder="Observações adicionais sobre o paciente..."
          />
          {errors.observacoes?.message && (
            <p className="text-xs text-red-500">{errors.observacoes.message.toString()}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border-2 border-gray-200 text-gray-700 
                       font-medium hover:bg-gray-50 hover:border-gray-300 
                       transition-all duration-200"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-ciano text-white font-medium
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
              <span>{type === "create" ? "Adicionar Paciente" : "Salvar Alterações"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PacientForm;