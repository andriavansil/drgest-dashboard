"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
  nome: z.string().min(1, { message: "O nome é obrigatório!" }),
  dataNascimento: z.date({ message: "Data de nascimento é obrigatório!" }),
  telemovel: z.string().min(1, { message: "Telemóvel é obrigatório!" }),
  email: z.string().email().opcional,
  morada: z.string().opcional,
  genero: z.enum(["masculino", "femenino"], { message: "Género é obrigatório!" }),
  antecedentes: z.string().opcional,
  observacoes: z.string().opcional,
});

type Inputs = z.infer<typeof schema>;

const PacientForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Novo Paciente</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      {/*<div className="flex flex-col gap-2 w-full md:w-1/4">
        <label classname="text-xs text-gray-500">Username</label>
        <input
          type="text"
          {...register(username)}
          clasname="ring-[1.5px] ring-gray-300 p-2 round-md text-sm w-full"
          />
        {errors.username?message.toString()}
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>*/}
      
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.nome}
          register={register}
          error={errors?.nome}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.dataNscimento}
          register={register}
          error={errors?.dataNascimento}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Género</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("genero")}
            defaultValue={data?.sex}
          >
            <option value="male">Mascuino</option>
            <option value="female">Femenino</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.telemovel}
          register={register}
          error={errors?.telemovel}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.morada}
          register={register}
          error={errors.morada}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.antecedentes}
          register={register}
          error={errors.antecedentes}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.observacoes}
          register={register}
          error={errors.observacoes}
        />
        
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PacientForm;
