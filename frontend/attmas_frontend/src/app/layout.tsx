'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import Layout from "./component/Layout/layout";
import { config } from "@/middleware";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const pathName = usePathname();
  const isValidPage = config.matcher.includes(pathName);

  return (
    <html lang="en">
      <body className={inter.className} style={{width: '100%', height: "100%"}}>
        {isValidPage ? <Layout>{children}</Layout> : children}
                
      </body>
    </html>
  );
}
