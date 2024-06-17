"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Layout from "./component/Layout/layout";
import { config } from "@/middleware";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "./reducers/store";
import { BorderColor } from "@mui/icons-material";
import { DateTimePicker } from "@mui/lab";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    primary: {
      main: "#f5f5f5",
    },
    secondary: {
      main: "#cc4800",
    },
  },
  shape: {
    borderRadius: 20,
  },

  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: '#616161',
          '&.Mui-selected': {
            color: '#fff',
            backgroundColor:'#cc4800',
          },
          '&.Mui-selected .MuiListItemIcon-root': {
            color: '#fff'
          },
          ':hover .MuiListItemIcon-root': {
            color: '#fff'
          },
          ':hover': {
            color: '#fff',
            backgroundColor: '#cc4800',
          },
          '&.Mui-selected:hover': {
            color: '#fff',
            backgroundColor: '#cc4800',
          }
        },
      }
    },
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
          color: "#fff",
          textTransform: 'none',
          backgroundColor:'#cc4800',
          ':hover': {
            backgroundColor:'#cc4800', 
          }
        },
      },
    },
    // MuiDateTimePicker: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiInput-root': {
    //         borderRadius: 20,
    //         '&:hover fieldset': {
    //           borderColor: '#616161',
    //         },
    //       },
    //     },
    //   },
    // },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const isValidPage = config.matcher.includes(pathName);
  const isProfilePage = pathName === '/profile'; // Adjust this according to your profile page route

  return (
    <html lang="en">
      <body className={inter.className} style={{ width: '100%', height: "100%" }}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
          {isValidPage ? (
            <Layout displayMainSideBar={!isProfilePage}>{children}</Layout>
          ) : (
            children
          )}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
