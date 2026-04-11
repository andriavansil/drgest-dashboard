import { Patient, Status } from "@prisma/client";

type PatientWithDetails = Patient & {
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

interface PatientReportProps {
  patient: PatientWithDetails;
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

const PatientReport = ({ patient, user }: PatientReportProps) => {
  const age = calculateAge(patient.birthday);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{`Ficha do Paciente - ${patient.name}`}</title>
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
                    FICHA DO PACIENTE
                </div>
                <h2>Dr. {user.firstName} {user.lastName}</h2>
                <p>{user.publicMetadata.speciality || ""} · {user.email}</p>
            </div>

            <div className="section">
                <div className="section-title">DADOS PESSOAIS</div>
                <div className="content grid">
                    <div><strong>Nome:</strong> {patient.name}</div>
                    <div><strong>Sexo:</strong> {patient.sex}</div>
                    <div><strong>Data de Nascimento:</strong> {new Date(patient.birthday).toLocaleDateString()} ({age} anos)</div>
                    <div><strong>Contato:</strong> {patient.contact}</div>
                    {patient.email && (<div className="full"><strong>Email:</strong> {patient.email}</div>)}
                    <div className="full"><strong>Morada:</strong> {patient.address}</div>
                </div>
            </div>

            <div className="section">
                <div className="section-title">ANTECEDENTES</div>
                <div className="content">
                    {patient.medicalHistory || "Nenhum antecedente registado."}
                </div>
            </div>

            <div className="section">
                <div className="section-title">OBSERVAÇÕES</div>
                <div className="content">
                    {patient.notes || "Nenhuma observação registada."}
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

export default PatientReport;