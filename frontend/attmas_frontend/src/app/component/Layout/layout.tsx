"use client"

import React, { ReactElement } from 'react'
import MainSideBar, { drawerWidth } from '../MainSideBar'
import MainNavBar from '../MainNavBar'

import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material'

interface LayoutProps {
  children: React.ReactNode
}
const mainDivStyle = { display: "flex" };

const theme = createTheme({
  palette: {
    primary: {
      main: "#001762",
    }
  },
});

export default function Layout({ children }: LayoutProps) {

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MainNavBar />
      <MainSideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
    </ThemeProvider>
    // <h1>Main Page</h1>
  )
}



