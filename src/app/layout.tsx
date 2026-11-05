import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/QueryProvider";
import StoreProvider from "@/providers/StoreProvider";
import AuthProvider from "@/providers/AuthProvider";
import {Toaster} from 'sonner'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APEX LEDGER",
  description: "Apex Ledger is a comprehensive accounting and financial management platform designed to streamline business operations, enhance financial visibility, and facilitate informed decision-making. With its user-friendly interface and robust features, Apex Ledger empowers businesses to efficiently manage their finances, track expenses, and generate insightful reports.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Providers>
            <AuthProvider>
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
