"use client"

import React, { ReactElement } from 'react'
import MainSideBar, { drawerWidth } from '../MainSideBar'
import MainNavBar from '../MainNavBar'

import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material'

interface LayoutProps {
  children: React.ReactNode
}


export default function Layout({ children }: LayoutProps) {

  return (
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
    // <h1>Main Page</h1>
  )
}



