// RootLayout.tsx
"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Layout from "./component/Layout/layout";
import { config } from "@/middleware";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "./reducers/store";
import Toast from "./component/toast/Toast"; // Adjust the import path accordingly
import BackDropLoader from "./component/BackdropLoader/backDropLoader.component";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Segoe UI"',
      // 'Roboto',
      // '"Helvetica Neue"',
      // 'Arial',
      // 'sans-serif',
      // '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
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
            backgroundColor: '#cc4800',
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
            '&:hover fieldset': {
              borderColor: '#616161',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#616161',
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderRadius: 20,
              borderColor: '#616161',
            },
            '&:hover fieldset': {
              borderColor: '#616161',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#616161',
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
          backgroundColor: '#cc4800',
          ':hover': {
            backgroundColor: '#cc4800',
          }
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
  const pathName = usePathname();
  const isValidPage = config.matcher.includes(pathName);
  const isProfilePage = pathName === '/profile'; // Adjust this according to your profile page route

  return (
    <html lang="en">
      <body className={inter.className} style={{ width: '100%', height: "100%", margin: 0 }}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            {isValidPage ? (
              <Layout displayMainSideBar={!isProfilePage}>{children}</Layout>
            ) : (
              children
            )}
            <Toast /> {/* Add Toast component here */}
            <BackDropLoader></BackDropLoader>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}