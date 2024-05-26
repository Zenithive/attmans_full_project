'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import Layout from "./component/Layout/layout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const pathName = usePathname();

  return (
    <html lang="en">
      <body className={inter.className} style={{width: '100%', height: "100%"}}>
        {pathName.replaceAll("/", "").length > 0 ? <Layout>{children}</Layout> : children}
                
      </body>
    </html>
  );
}
