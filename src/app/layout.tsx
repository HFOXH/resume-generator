import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generador de CV Gratis | Formato Harvard | CV Generator",
  description:
    "Crea tu Curriculum Vitae en formato Harvard gratis. Generador de CV moderno, profesional y compatible con ATS. Descarga en PDF. / Free Harvard format CV generator. ATS-friendly, modern and easy to use.",
  keywords: [
    "generador de cv",
    "cv gratis",
    "curriculum vitae",
    "harvard format",
    "cv generator",
    "resume builder",
    "ats friendly",
    "descargar cv pdf",
    "crear cv online",
    "free resume",
  ],
  authors: [{ name: "Santiago Cárdenas" }],
  openGraph: {
    title: "Generador de CV Gratis | Formato Harvard",
    description:
      "Crea tu CV profesional en formato Harvard gratis. Compatible con ATS, moderno y fácil de usar. Descarga en PDF.",
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generador de CV Gratis | Formato Harvard",
    description:
      "Crea tu CV profesional en formato Harvard gratis. Compatible con ATS, moderno y fácil de usar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
