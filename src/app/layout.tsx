import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ptPT } from '@clerk/localizations';
import type { LocalizationResource } from '@clerk/types';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Gest",
  description: "Web app para gestão de consultório médico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptPT as LocalizationResource}>
      <html lang="pt-PT">
        <body className={inter.className}>{children} <ToastContainer position="bottom-right" theme="dark" /></body>
      </html>
    </ClerkProvider>
  );
}
