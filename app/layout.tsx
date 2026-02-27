import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // 引入導覽列

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitFlow - Gym Management",
  description: "Professional gym management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen`}>
        <Navbar /> {/* 置頂導覽列 */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}