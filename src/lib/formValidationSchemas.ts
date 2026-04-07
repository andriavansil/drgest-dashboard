import { z } from "zod";

export const appointmentSchema = z.object({
    id: z.coerce.number().optional(),
    pacienteId: z.string().min(1, { message: "Paciente é obrigatório" }),
    date: z.coerce.date({ message: "Data da consulta é obrigatória" }),
    type: z.enum(["CONSULTORIO", "DOMICILIO"], {
      message: "Tipo é obrigatório",
    }),
    local: z.string().optional(),
    reason: z.string().min(1, { message: "Motivo é obrigatório" }),
    diagnosis: z.string().optional(),
    medications: z.string().optional(),
    observations: z.string().optional(),
    idStatus: z.string().min(1, { message: "Status é obrigatório" }),
  }).refine((data) => {
    if (data.type === "DOMICILIO") {
      return !!data.local && data.local.length > 0;
    }
    return true;
  }, {
    message: "Local é obrigatório para consultas ao domicílio",
    path: ["local"],
  });

export type AppointmentSchema = z.infer<typeof appointmentSchema>;

export const patientSchema = z.object({ 
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "O nome é obrigatório!" }),
    birthday: z.coerce.date({ message: "Data de nascimento é obrigatória!" }),
    contact: z.string().min(1, { message: "Telemóvel é obrigatório!" }),
    email: z.email({ message: "Email inválido!" }).optional().or(z.literal("")),
    address: z.string().optional(),
    sex: z.enum(["MASCULINO", "FEMININO"], { message: "Género é obrigatório!" }),
    medicalHistory: z.string().optional(),
    notes: z.string().optional(),
  });

export type PatientSchema = z.infer<typeof patientSchema>;

export const userSchema = z.object({
    name: z.string().min(1, { message: "O nome é obrigatório!" }),
    email: z.string().email({ message: "Email inválido!" }),
    speciality: z.string().optional(),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres!" }).optional().or(z.literal("")),
    //role: z.enum(["med", "med-pro"], { message: "Função é obrigatória!" }),
    imagem: z.string().optional(),
  });

export type UserSchema = z.infer<typeof userSchema>;