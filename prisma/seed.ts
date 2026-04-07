import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log(' Seeding with Faker...')

  // ----------------------
  // STATUS
  // ----------------------
  const activeStatus = await prisma.status.upsert({
    where: { name: 'Ativo' },
    update: {},
    create: {
      name: 'Ativo',
      description: 'Resgistro ativo e em uso',
    },
  })

  // ----------------------
  // USERS (Doctors)
  // ----------------------
  const doctors = []

  for (let i = 0; i < 2; i++) {
    const doctor = await prisma.user.upsert({
      where: { email: `doctor${i}@example.com` },
      update: {},
      create: {
        email: `doctor${i}@example.com`,
        password: 'hashedpassword',
        name: faker.person.fullName(),
        speciality: faker.helpers.arrayElement([
          'Cardiology',
          'Dermatology',
          'Neurology',
          'Pediatrics',
          'Orthopedics',
        ]),
        statusId: activeStatus.id,
      },
    })

    doctors.push(doctor)
  }

  // ----------------------
  // PATIENTS + APPOINTMENTS
  // ----------------------
  const TOTAL_PATIENTS = 35

  for (let i = 0; i < TOTAL_PATIENTS; i++) {
    const doctor = faker.helpers.arrayElement(doctors)

    const patient = await prisma.patient.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        contact: faker.phone.number({ style: 'international' }),
        birthday: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
        sex: faker.helpers.arrayElement(['MASCULINO', 'FEMININO']),
        address: faker.location.city(),
        medicalHistory: faker.lorem.sentence(),
        medications: faker.lorem.words(3),
        notes: faker.lorem.sentence(),
        userId: doctor.id,
        statusId: activeStatus.id,
      },
    })

    // Criar 1 a 5 consultas por paciente
    const appointmentCount = faker.number.int({ min: 1, max: 5 })

    for (let j = 0; j < appointmentCount; j++) {
      await prisma.appointment.create({
        data: {
          date: faker.date.between({
            from: new Date('2024-01-01'),
            to: new Date(),
          }),
          type: faker.helpers.arrayElement([
            'CONSULTORIO',
            'DOMICILIO',
          ]),
          local: `Room ${faker.number.int({ min: 1, max: 10 })}`,
          reason: faker.lorem.sentence(),
          diagnosis: faker.lorem.words(5),
          medications: faker.lorem.words(3),
          observations: faker.lorem.sentence(),
          userId: doctor.id,
          patientId: patient.id,
          statusId: activeStatus.id,
        },
      })
    }
  }

  console.log(' 35+ patients with appointments created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })