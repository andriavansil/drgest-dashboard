import { Appointment, Patient, Status } from "@prisma/client";

type AppointmentWithDetails = Appointment & {
  patient: Patient;
  status: Status;
};

type UserWithMetadata = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  publicMetadata: {
    speciality?: string;
  };
};

interface AppointmentReportProps {
  appointment: AppointmentWithDetails;
  user: UserWithMetadata;
}

const calculateAge = (birthDate: Date | string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const AppointmentReport = ({ appointment, user }: AppointmentReportProps) => {
  const { patient } = appointment;
  const age = calculateAge(patient.birthday);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{`Ficha de Consulta - ${patient.name}`}</title>
        <style>{`
          body {
              font-family: Arial, Helvetica, sans-serif;
              background: #f4f4f4;
              margin: 0;
              padding: 20px;
          }

          .page {
              width: 210mm;
              min-height: 297mm;
              margin: auto;
              background: #fff;
              padding: 25mm 20mm;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }

          @media print {
              body {
                  background: none;
                  margin: 0;
              }

              .page {
                  box-shadow: none;
                  margin: 0;
                  width: auto;
                  min-height: auto;
                  padding: 10mm;
              }
          }

          h1, h2, h3 {
              margin: 0;
          }

          .header {
              text-align: center;
              padding-bottom: 20px;
              margin-bottom: 30px;
          }

          .header h1 {
              font-size: 18px;
              font-weight: bold;
          }

          .header h2 {
              font-size: 13px;
              font-weight: 600;
          }

          .header p {
              font-size: 12px;
              margin: 3px 0;
          }

          .title {
              text-align: center;
              font-size: 18px;
              margin-bottom: 5px;
              font-weight: bold;
              letter-spacing: 1px;
          }

          .section {
              margin-bottom: 18px;
          }

          .section-title {
              font-weight: bold;
              font-size: 13px;
              margin: 20px 0;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
          }

          .content {
              font-size: 13px;
              line-height: 1.6;
          }

          .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 5px 20px;
          }

          .full {
              grid-column: 1 / -1;
          }

          .list {
              margin-left: 15px;
          }

          .list li {
              margin-bottom: 5px;
          }

          .signature {
              margin-top: 100px;
              text-align: center;
          }

          .signature-line {
              margin: 40px auto 0 auto;
              width: 250px;
              border-top: 1px solid #000;
              text-align: center;
              padding-top: 5px;
              font-size: 13px;
          }
        `}</style>
      </head>
      <body>
        <div className="page">

            <div className="header">
                <div className="title">
                    FICHA DA CONSULTA
                </div>
                <h2>Dr. {user.firstName} {user.lastName}</h2>
                <p>{user.publicMetadata.speciality + ' · ' || ""}{user.email}</p>
            </div>

            <div className="section">
                <div className="section-title">DADOS DO PACIENTE</div>
                <div className="content grid">
                    <div><strong>Nome:</strong> {patient.name}</div>
                    <div><strong>Sexo:</strong> {patient.sex}</div>
                    <div><strong>Contato:</strong> {patient.contact}</div>
                    <div><strong>Data Nasc.:</strong> {new Date(patient.birthday).toLocaleDateString()} ({age} anos)</div>
                </div>
            </div>

            <div className="section">
                <div className="section-title">DADOS DA CONSULTA</div>
                <div className="content grid">
                    <div><strong>Data:</strong> {new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
                    <div><strong>Horário:</strong> {formatTime(appointment.date)}</div>
                    <div><strong>Tipo:</strong> Consultório</div>
                    <div><strong>Status:</strong> Realizada</div>
                </div>
            </div>

            <div className="section">
                <div className="section-title">MOTIVO DA CONSULTA</div>
                <div className="content">
                    {appointment.reason || "Não especificado"}
                </div>
            </div>

            <div className="section">
                <div className="section-title">DIAGNÓSTICO</div>
                <div className="content">
                    {appointment.diagnosis || "Não especificado"}
                </div>
            </div>

            {appointment.medications && (
              <div className="section">
                <div className="section-title">RECEITA MÉDICA</div>
                <div className="content">
                  {appointment.medications.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                    ))}
                </div>
              </div>
            )}

            <div className="section">
                <div className="section-title">OBSERVAÇÕES</div>
                <div className="content">
                    {appointment.observations || "Nenhuma observação adicional."}
                </div>
            </div>
            
            <div className="signature">
                <div className="signature-line">
                    Dr. {user.firstName} {user.lastName}
                </div>
            </div>
        </div>
      </body>
    </html>
  );
};

export default AppointmentReport;
