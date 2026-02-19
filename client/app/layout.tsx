import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeWrapper } from "@/components/ThemeWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthSync",
  description: "Healthcare Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ThemeWrapper>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
