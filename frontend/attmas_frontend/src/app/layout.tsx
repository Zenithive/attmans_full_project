"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import Layout from "./component/Layout/layout";
import { config } from "@/middleware";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: {
      main: "#001762",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderRadius: 20,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
  },
});

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
      <body className={inter.className} style={{ width: '100%', height: "100%" }}>
        <ThemeProvider theme={theme}>
          {isValidPage ? <Layout>{children}</Layout> : children}
        </ThemeProvider>
      </body>
    </html>
  );
}
