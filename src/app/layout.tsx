import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import { ptPT as clerkPtPT } from "@clerk/localizations";
import "react-toastify/dist/ReactToastify.css";
import type { LocalizationResource } from '@clerk/types';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Gest",
  description: "Web app para gestão de consultório médico",
};

// As suas traduções personalizadas
const customPtPT: LocalizationResource = {
  locale: "pt-PT",
  signIn: {
    start: {
      title: "Entrar na sua conta",
      subtitle: "Bem-vindo de volta!",
      actionText: "Não tem uma conta?",
      actionLink: "Registar",
    },
  },
  signUp: {
    start: {
      title: "Criar a sua conta",
      subtitle: "Registe-se para começar a gerir os seus pacientes",
      actionText: "Já tem uma conta?",
      actionLink: "Entrar",
    },
  },
};

// Mescla as traduções padrão do Clerk com as suas personalizadas
const ptPT = { ...clerkPtPT, ...customPtPT };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptPT as LocalizationResource} >
      <html lang="pt-PT">
        <body className={inter.className}>{children} <ToastContainer position="bottom-right" theme="dark" /></body>
      </html>
    </ClerkProvider>
  );
}
