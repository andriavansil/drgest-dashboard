import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";
import puppeteer from "puppeteer";
import prisma from "@/lib/prisma";
import { auth, clerkClient as clerkClientFunction } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  const appointmentId = parseInt(params.id, 10);

  if (!userId) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  if (isNaN(appointmentId)) {
    return new NextResponse("ID da consulta inválido", { status: 400 });
  }

  try {
    const clerkClient = clerkClientFunction();

    const [appointment, user] = await Promise.all([
      prisma.appointment.findUnique({
        where: {
          id: appointmentId,
          userId: userId, // Garante que o médico só pode aceder às suas próprias consultas
        },
        include: {
          patient: true,
          status: true,
        },
      }),
      clerkClient.users.getUser(userId),
    ]);

    if (!appointment) {
      return new NextResponse("Consulta não encontrada ou não tem permissão para a aceder", { status: 404 });
    }

    const userWithMetadata = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress || "Sem contacto",
      publicMetadata: user.publicMetadata as { speciality?: string },
    };

    // Renderiza o componente React para uma string HTML usando imports dinâmicos
    const [{ default: AppointmentReport }, React, reactDomServer] = await Promise.all([
      import("@/components/pdf-templates/AppointmentReport"),
      import("react"),
      import("react-dom/server"),
    ]);

    const html = reactDomServer.renderToStaticMarkup(
      React.createElement(AppointmentReport, {
        appointment,
        user: userWithMetadata,
      })
    );

    // Inicia o Puppeteer
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "puppeteer_profile_"));
    let browser = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Importante para ambientes de produção/Vercel
        userDataDir,
      });
      const page = await browser.newPage();

      // Define o conteúdo da página e gera o PDF
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="ficha_consulta_${appointment.id}.pdf"`,
        },
      });
    } finally {
      if (browser) {
        await browser.close();
      }
      fs.rmSync(userDataDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.error("Erro detalhado ao gerar PDF:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    return new NextResponse(`Erro interno ao gerar o relatório em PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, { status: 500 });
  }
}