"use server"

import prisma from "./prisma";
import { AppointmentSchema, PatientSchema, UserSchema } from "./formValidationSchemas";
//import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { spec } from "node:test/reporters";

type CurrentState = { success: boolean; error: boolean };

export const createPatient = async (
    currentState: CurrentState, 
    data: PatientSchema
) => {
    try {
        const { userId } = auth();
        const newPatient = await prisma.patient.create({
            data: {
                name: data.name,
                birthday: data.birthday,
                contact: data.contact,
                email: data.email,
                address: data.address,
                sex: data.sex,
                medicalHistory: data.medicalHistory,
                notes: data.notes,
                userId: userId!,
                statusId: 1, // Status "Ativo"
                updatedAt: new Date(), // Define a data de atualização para a data atual
            }
        });

        await prisma.auditLog.create({
            data: {
                action: "CREATE",
                userId: userId!,
                createdAt: new Date(),
                details: `Paciente ${data.name} criado.`,
                entityType: "Patient",
                entityId: newPatient.id.toString(),
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error("Erro ao criar paciente:", error);
        return { success: false, error: true };
    }
};

export const updatePatient = async (
    currentState: CurrentState, 
    data: PatientSchema
) => {
    try {
        await prisma.patient.update({
            where: { id: data.id },
            data: {
                name: data.name,
                birthday: data.birthday,
                contact: data.contact,
                email: data.email,
                address: data.address,
                sex: data.sex,
                medicalHistory: data.medicalHistory,
                notes: data.notes,
                statusId: 1, // Status "Ativo"
                updatedAt: new Date(), // Atualiza a data de atualização para a data atual
            }
        });
        
        const { userId } = auth();
        await prisma.auditLog.create({
            data: {
                action: "UPDATE",
                userId: userId!,
                createdAt: new Date(),
                details: `Paciente ${data.name} Alterado.`,
                entityType: "Patient",
                entityId: data.id!.toString(),
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error("Erro ao atualizar paciente:", error);
        return { success: false, error: true };
    }
}; 

export const deletePatient = async (
    currentState: CurrentState, 
    data: FormData
) => {
    const id = data.get("id") as string;
    try {

        await prisma.appointment.deleteMany({
            where: { patientId: parseInt(id) },
        });
        const detetedPatient = await prisma.patient.delete({
            where: { id: parseInt(id) },
        });
                
        const { userId } = auth();
        await prisma.auditLog.create({
            data: {
                action: "DELETE",
                userId: userId!,
                createdAt: new Date(),
                details: `Paciente ${detetedPatient.name} Eliminado. Todas as consultas associadas a este paciente também foram eliminadas.`,
                entityType: "Patient",
                entityId: id.toString(), // Garante que entityId é armazenado como string, consistente com createPatient.
            },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error("Erro ao eliminar paciente:", error);
        return { success: false, error: true };
    }
}; 


export const createAppointment = async (
    currentState: CurrentState, 
    data: AppointmentSchema
) => {
    try {
        const { userId } = auth();
        await prisma.appointment.create({
            data: {
                date: new Date(data.date),
                patientId: parseInt(data.pacienteId),
                type: data.type,
                local: data.local? data.local : null,
                reason: data.reason,
                diagnosis: data.diagnosis,
                medications: data.medications,
                observations: data.observations,
                userId: userId!,
                statusId: parseInt(data.idStatus),
                createdAt: new Date(),
                updatedAt: new Date(), // Define a data de atualização para a data atual
            }
        });

        return { success: true, error: false };
    } catch (error) {
        console.error("Erro ao criar consulta:", error);
        return { success: false, error: true };
    }
};

export const updateAppointment = async (
    currentState: CurrentState, 
    data: AppointmentSchema
) => {
    try {
        await prisma.appointment.update({
            where: { id: data.id },
            data: {
                date: new Date(data.date),
                type: data.type,
                local: data.local? data.local : null,
                reason: data.reason,
                diagnosis: data.diagnosis,
                medications: data.medications,
                observations: data.observations,
                statusId: parseInt(data.idStatus),
                updatedAt: new Date(), // Atualiza a data de atualização para a data atual
            }
        });

        return { success: true, error: false };
    } catch (error) {
        console.error("Erro ao atualizar consulta:", error);
        return { success: false, error: true };
    }
}; 

export const deleteAppointment = async (
    currentState: CurrentState, 
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.appointment.delete({
            where: { id: parseInt(id) },
        });

        return { success: true, error: false };
    } catch (error) {
        console.error("Erro ao eliminar consulta:", error);
        return { success: false, error: true };
    }
}; 

export const createUser = async (
    currentState: CurrentState, 
    data: UserSchema
) => {
    try {
        const user = await clerkClient.users.createUser({
            firstName: data.name.split(" ")[0],
            lastName: data.name.split(" ").slice(1).join(" "),
            emailAddress: [data.email],
            password: data.password,
            publicMetadata: {role: "med", speciality: data.speciality},
        });

        // Verificar se o status "active" existe, se não, criar
        let activeStatus = await prisma.status.findFirst({
            where: { name: 'Ativo' }
        });

        if (!activeStatus) {
            activeStatus = await prisma.status.create({
            data: { name: 'Ativo' }
            });

            await prisma.status.create({
                data: { name: 'Agendada' }
            });
            await prisma.status.create({
                data: { name: 'Realizada' }
            });
            await prisma.status.create({
                data: { name: 'Cancelada' }
            });
        }

         await prisma.user.create({
             data: {
                 name: data.name,
                 email: data.email,
                 speciality: data.speciality,
                 password: data.password || "cleck-managed",
                 role: data.role,
                 img: data.imagem? data.imagem : null,
                 statusId: activeStatus.id,
                 createdAt: new Date(),
                 updatedAt: new Date(), // Define a data de atualização para a data atual
             }
         });

        return { success: true, error: false };
    } catch (error) {
        console.error("Erro ao criar utilizador:", error);
        return { success: false, error: true };
    }
}; 

export const getPatientsForUser = async () => {
    try {
        const { userId } = auth();
        if (!userId) {
            // Idealmente, você deve tratar o caso de usuário não autenticado
            return [];
        }

        const patients = await prisma.patient.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return patients;
    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        return [];
    }
};


// export const updateUser = async (
//     currentState: CurrentState, 
//     data: UserSchema
// ) => {
//     try {
//         if (!data.id) {
//             return { success: false, error: true };
//         }
//         const user = await clerkClient.users.updateUser(data.id,{
//             firstName: data.nome.split(" ")[0],
//             lastName: data.nome.split(" ").slice(1).join(" "),
//             email: data.email,
//             ...{data.password !== "" && { password: data.password }},
//             publicMetadata: {role: "med"},
//         });

//         await prisma.user.update({
//             where: { id: data.id },
//             data: {
//                 name: data.nome,
//                 email: data.email,
//                 speciality: data.speciality,
//                 ...{data.password !== "" && { password: data.password }},
//         return { success: true, error: false };
//     } catch (error) {
//         console.error("Erro ao eliminar utilizador:", error);
//         return { success: false, error: true };
//     }
// }; 
